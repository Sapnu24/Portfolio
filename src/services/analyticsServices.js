import { db, isFirebaseConfigured } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

const STORAGE_KEY = "portfolio_live_analytics_data_v3";
const SESSION_VISITOR_KEY = "portfolio_session_visitor_id";

const getTodayKey = () => new Date().toISOString().split("T")[0];

export const DEFAULT_ANALYTICS = {
  totalPageviews: 1,
  uniqueVisitors: 1,
  avgSessionSeconds: 165,
  pageCounts: {
    "/": 1,
    "/#nextSection": 0,
    "/#skills": 0,
    "/#projects": 0,
    "/#contact": 0,
  },
  deviceCounts: {
    desktop: 1,
    mobile: 0,
    tablet: 0,
  },
  referrerCounts: {
    direct: 1,
    github: 0,
    linkedin: 0,
    upwork: 0,
    search: 0,
    other: 0,
  },
  countryCounts: {
    "🇵🇭 Philippines": 1,
    "🇺🇸 United States": 0,
    "🇸🇬 Singapore": 0,
    "🌍 Others": 0,
  },
  recentVisits: [
    {
      id: "v-initial",
      path: "/",
      device: "desktop",
      referrer: "direct",
      timestamp: new Date().toISOString(),
    },
  ],
  dailyViews: {
    [getTodayKey()]: 1,
  },
  lastUpdated: new Date().toISOString(),
};

/**
 * Get cached or live analytics
 */
export async function getLiveAnalytics() {
  const cached = localStorage.getItem(STORAGE_KEY);
  let localData = cached ? JSON.parse(cached) : DEFAULT_ANALYTICS;

  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const docRef = doc(db, "analytics", "realtime_metrics");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const live = docSnap.data();
      const merged = {
        ...localData,
        ...live,
        pageCounts: { ...DEFAULT_ANALYTICS.pageCounts, ...(live.pageCounts || {}) },
        deviceCounts: { ...DEFAULT_ANALYTICS.deviceCounts, ...(live.deviceCounts || {}) },
        referrerCounts: { ...DEFAULT_ANALYTICS.referrerCounts, ...(live.referrerCounts || {}) },
        countryCounts: { ...DEFAULT_ANALYTICS.countryCounts, ...(live.countryCounts || {}) },
        dailyViews: { ...DEFAULT_ANALYTICS.dailyViews, ...(live.dailyViews || {}) },
        recentVisits: Array.isArray(live.recentVisits) ? live.recentVisits : localData.recentVisits,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } else {
      // Initialize doc in Firestore
      await setDoc(docRef, { ...localData, createdAt: serverTimestamp() });
      return localData;
    }
  } catch (err) {
    console.warn("Could not fetch live analytics from Firestore, using local cache:", err);
    return localData;
  }
}

/**
 * Subscribe to live Firestore analytics changes in real-time
 */
export function subscribeToLiveAnalytics(callback) {
  if (!isFirebaseConfigured || !db) {
    const handleLocalUpdate = (e) => {
      if (e.detail && callback) callback(e.detail);
    };
    window.addEventListener("portfolio-analytics-update", handleLocalUpdate);
    return () => window.removeEventListener("portfolio-analytics-update", handleLocalUpdate);
  }

  try {
    const docRef = doc(db, "analytics", "realtime_metrics");
    const unsubscribeFirestore = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const live = docSnap.data();
          const merged = {
            ...DEFAULT_ANALYTICS,
            ...live,
            pageCounts: { ...DEFAULT_ANALYTICS.pageCounts, ...(live.pageCounts || {}) },
            deviceCounts: { ...DEFAULT_ANALYTICS.deviceCounts, ...(live.deviceCounts || {}) },
            referrerCounts: { ...DEFAULT_ANALYTICS.referrerCounts, ...(live.referrerCounts || {}) },
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          if (callback) callback(merged);
        }
      },
      (error) => {
        console.warn("Real-time analytics snapshot listener error:", error);
      }
    );

    const handleLocalUpdate = (e) => {
      if (e.detail && callback) callback(e.detail);
    };
    window.addEventListener("portfolio-analytics-update", handleLocalUpdate);

    return () => {
      unsubscribeFirestore();
      window.removeEventListener("portfolio-analytics-update", handleLocalUpdate);
    };
  } catch (err) {
    console.warn("Failed to attach Firestore live listener:", err);
    return () => {};
  }
}

/**
 * Detect Device Category
 */
function getDeviceCategory() {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  const ua = (navigator.userAgent || "").toLowerCase();
  const isTouch = navigator.maxTouchPoints > 0;

  if (width <= 640 || /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) {
    return "mobile";
  }
  if ((width <= 1024 && isTouch) || /ipad|android(?!.*mobile)|tablet/i.test(ua)) {
    return "tablet";
  }
  return "desktop";
}

/**
 * Detect Referrer Category
 */
function getReferrerCategory() {
  if (typeof document === "undefined") return "direct";
  const ref = (document.referrer || "").toLowerCase();
  if (!ref) return "direct";
  if (ref.includes("github.com")) return "github";
  if (ref.includes("linkedin.com") || ref.includes("lnkd.in")) return "linkedin";
  if (ref.includes("upwork.com")) return "upwork";
  if (ref.includes("google.") || ref.includes("bing.") || ref.includes("duckduckgo.") || ref.includes("yahoo.")) {
    return "search";
  }
  return "other";
}

/**
 * Normalize section hash to clean key
 */
function normalizePath(rawPath) {
  if (!rawPath || rawPath === "/") return "/";
  if (rawPath.includes("about") || rawPath.includes("nextSection")) return "/#nextSection";
  if (rawPath.includes("skills")) return "/#skills";
  if (rawPath.includes("projects")) return "/#projects";
  if (rawPath.includes("contact")) return "/#contact";
  return rawPath;
}

/**
 * Track a real page / section visit
 */
export async function recordPageView(rawPath = "/") {
  if (typeof window === "undefined") return;

  // Don't track admin pages to avoid inflating admin's own statistics
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.startsWith("/admin") || currentPath.startsWith("/demo")) {
    return;
  }

  const path = normalizePath(rawPath || window.location.hash || "/");
  const device = getDeviceCategory();
  const referrer = getReferrerCategory();
  const today = getTodayKey();

  // Check if unique visitor session
  const isNewSession = !sessionStorage.getItem(SESSION_VISITOR_KEY);
  if (isNewSession) {
    sessionStorage.setItem(SESSION_VISITOR_KEY, "session_" + Date.now());
  }

  // Load current stats
  const cached = localStorage.getItem(STORAGE_KEY);
  const current = cached ? JSON.parse(cached) : { ...DEFAULT_ANALYTICS };

  const updatedPageCounts = { ...current.pageCounts };
  updatedPageCounts[path] = (updatedPageCounts[path] || 0) + 1;

  const updatedDeviceCounts = { ...current.deviceCounts };
  updatedDeviceCounts[device] = (updatedDeviceCounts[device] || 0) + 1;

  const updatedReferrerCounts = { ...current.referrerCounts };
  updatedReferrerCounts[referrer] = (updatedReferrerCounts[referrer] || 0) + 1;

  const updatedDailyViews = { ...current.dailyViews };
  updatedDailyViews[today] = (updatedDailyViews[today] || 0) + 1;

  const newVisitRecord = {
    id: "v-" + Date.now(),
    path,
    device,
    referrer,
    timestamp: new Date().toISOString(),
  };

  const updatedRecentVisits = [newVisitRecord, ...(current.recentVisits || [])].slice(0, 15);

  const updatedData = {
    ...current,
    totalPageviews: (current.totalPageviews || 0) + 1,
    uniqueVisitors: (current.uniqueVisitors || 0) + (isNewSession ? 1 : 0),
    pageCounts: updatedPageCounts,
    deviceCounts: updatedDeviceCounts,
    referrerCounts: updatedReferrerCounts,
    dailyViews: updatedDailyViews,
    recentVisits: updatedRecentVisits,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Save locally
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

  // 2. Dispatch local event for instant admin panel update
  window.dispatchEvent(new CustomEvent("portfolio-analytics-update", { detail: updatedData }));

  // 3. Save to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "analytics", "realtime_metrics");
      await setDoc(docRef, updatedData, { merge: true });
    } catch (err) {
      console.warn("Could not sync pageview to Firestore:", err);
    }
  }

  return updatedData;
}

/**
 * Trigger a simulated / verified real visit for testing
 */
export async function triggerTestVisit(customPath = "/") {
  return recordPageView(customPath);
}

/**
 * Reset / calibrate analytics counters
 */
export async function resetAnalyticsData() {
  const resetData = {
    ...DEFAULT_ANALYTICS,
    dailyViews: { [getTodayKey()]: 1 },
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
  window.dispatchEvent(new CustomEvent("portfolio-analytics-update", { detail: resetData }));

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "analytics", "realtime_metrics");
      await setDoc(docRef, resetData);
    } catch (e) {
      console.warn("Reset analytics in Firestore failed:", e);
    }
  }

  return resetData;
}

