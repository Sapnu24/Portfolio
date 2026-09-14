import { db, isFirebaseConfigured } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";


export const DEFAULT_TIMELINE = [
  {
    id: "freelance-upwork-engineering",
    role: "Lead Full-Stack Freelance Engineer",
    company: "Freelance & Upwork Engineering",
    period: "2024 - Present",
    description:
      "Delivering bespoke full-stack web engineering, custom cloud architectures, and reactive web applications for global clients with 100% Job Success. Specializing in high-throughput React, Next.js, and Laravel PHP systems.",
    tags: ["React JS", "Laravel PHP", "Cloud Architecture", "REST APIs", "Upwork Top Rated"],
    iconType: "briefcase",
    order: 1,
  },
  {
    id: "contract-client-systems",
    role: "Contract Software Engineer",
    company: "Client MVPs & Custom Systems",
    period: "2022 - 2024",
    description:
      "Engineered bespoke client web portals, database structures, secure REST APIs, and responsive web dashboards with a focus on fast load times, reliability, and clean architecture.",
    tags: ["Full-Stack Engineering", "MySQL", "PHP", "React JS", "Tailwind CSS"],
    iconType: "laptop",
    order: 2,
  },
];

export const LOCAL_STORAGE_KEY = "smv_personal_timeline_data_v3";

/**
 * Read cached Career Roadmap items synchronously from localStorage
 */
export function getCachedTimelineItems() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_TIMELINE;
}

/**
 * Fetch Career Roadmap items from Firestore with local fallback
 */
export async function getTimelineItems() {
  const localData = getCachedTimelineItems();

  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const colRef = collection(db, "career_roadmap");
    let snapshot;
    try {
      const q = query(colRef, orderBy("order", "asc"));
      snapshot = await getDocs(q);
    } catch {
      snapshot = await getDocs(colRef);
    }

    if (snapshot.empty) {
      return localData;
    }

    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        tags: Array.isArray(data.tags)
          ? data.tags
          : typeof data.tags === "string"
          ? data.tags.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    return items;
  } catch (error) {
    console.warn("Could not fetch timeline items from Firestore, using fallback:", error);
    return localData;
  }
}

/**
 * Add a timeline item
 */
export async function addTimelineItem(itemData) {
  const tagsArray = Array.isArray(itemData.tags)
    ? itemData.tags
    : typeof itemData.tags === "string"
    ? itemData.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const payload = {
    ...itemData,
    tags: tagsArray,
    iconType: itemData.iconType || "briefcase",
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = cached ? JSON.parse(cached) : [...DEFAULT_TIMELINE];
    const newId = `timeline-${Date.now()}`;
    const newItem = { id: newId, ...payload };
    list.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return newId;
  }

  const docRef = await addDoc(collection(db, "career_roadmap"), payload);
  return docRef.id;
}

/**
 * Update a timeline item
 */
export async function updateTimelineItem(id, itemData) {
  const tagsArray = Array.isArray(itemData.tags)
    ? itemData.tags
    : typeof itemData.tags === "string"
    ? itemData.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const payload = {
    ...itemData,
    tags: tagsArray,
    updatedAt: new Date().toISOString(),
  };

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).map((item) =>
      item.id === id ? { ...item, ...payload } : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "career_roadmap", id);
  await setDoc(docRef, payload, { merge: true });
}


/**
 * Delete a timeline item
 */
export async function deleteTimelineItem(id) {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "career_roadmap", id);
  await deleteDoc(docRef);
}
