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
import { detectTechKey } from "@/utils/techIcons";

export const DEFAULT_BANNER_SKILLS = [
  { id: "bs-react", name: "React", iconKey: "react", isVisible: true, order: 1 },
  { id: "bs-laravel", name: "Laravel", iconKey: "laravel", isVisible: true, order: 2 },
  { id: "bs-firebase", name: "Firebase", iconKey: "firebase", isVisible: true, order: 3 },
  { id: "bs-javascript", name: "JavaScript", iconKey: "javascript", isVisible: true, order: 4 },
  { id: "bs-php", name: "PHP", iconKey: "php", isVisible: true, order: 5 },
  { id: "bs-mysql", name: "MySQL", iconKey: "mysql", isVisible: true, order: 6 },
  { id: "bs-tailwind", name: "Tailwind CSS", iconKey: "tailwind", isVisible: true, order: 7 },
  { id: "bs-css", name: "CSS3", iconKey: "css3", isVisible: true, order: 8 },
  { id: "bs-html", name: "HTML5", iconKey: "html5", isVisible: true, order: 9 },
  { id: "bs-git", name: "Git", iconKey: "git", isVisible: true, order: 10 },
  { id: "bs-github", name: "GitHub", iconKey: "github", isVisible: true, order: 11 },
  { id: "bs-bootstrap", name: "Bootstrap", iconKey: "bootstrap", isVisible: true, order: 12 },
  { id: "bs-wordpress", name: "WordPress", iconKey: "wordpress", isVisible: true, order: 13 },
  { id: "bs-flutter", name: "Flutter", iconKey: "flutter", isVisible: true, order: 14 },
  { id: "bs-dart", name: "Dart", iconKey: "dart", isVisible: true, order: 15 },
  { id: "bs-python", name: "Python", iconKey: "python", isVisible: true, order: 16 },
  { id: "bs-xampp", name: "XAMPP", iconKey: "xampp", isVisible: true, order: 17 },
  { id: "bs-cloudflare-pages", name: "Cloudflare Pages", iconKey: "cloudflarepages", isVisible: true, order: 18 },
  { id: "bs-cloudflare-workers", name: "Cloudflare Workers", iconKey: "cloudflareworkers", isVisible: true, order: 19 },
  { id: "bs-render", name: "Render", iconKey: "render", isVisible: true, order: 20 },
];

const LOCAL_STORAGE_KEY = "srn_portfolio_banner_skills_v1";

/**
 * Read cached banner skills synchronously from localStorage
 */
export function getCachedBannerSkills() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_BANNER_SKILLS;
}

/**
 * Fetch Banner Skills from Firestore with local fallback
 */
export async function getBannerSkills() {
  const localData = getCachedBannerSkills();

  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const colRef = collection(db, "banner_skills");
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

    const skills = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(skills));
    return skills;
  } catch (error) {
    console.warn("Could not fetch banner skills from Firestore, using fallback:", error);
    return localData;
  }
}

/**
 * Add a new banner skill / upskill technology with auto-detected icon key
 */
export async function addBannerSkill(skillData) {
  const autoKey = detectTechKey(skillData.iconKey || skillData.name || "default");
  const payload = {
    name: skillData.name || "Skill",
    iconKey: autoKey,
    iconUrl: skillData.iconUrl || "",
    isVisible: skillData.isVisible !== undefined ? Boolean(skillData.isVisible) : true,
    showInHero: skillData.showInHero !== undefined ? Boolean(skillData.showInHero) : true,
    order: Number(skillData.order) || Date.now(),
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = cached ? JSON.parse(cached) : [...DEFAULT_BANNER_SKILLS];
    const newId = `bs-${Date.now()}`;
    const newItem = { id: newId, ...payload };
    list.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return newId;
  }

  const docRef = await addDoc(collection(db, "banner_skills"), payload);
  return docRef.id;
}

/**
 * Update an existing banner skill with auto-detected icon key fallback
 */
export async function updateBannerSkill(id, skillData) {
  const autoKey = detectTechKey(skillData.iconKey || skillData.name || "default");
  const payload = {
    ...skillData,
    iconKey: autoKey,
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

  const docRef = doc(db, "banner_skills", id);
  await setDoc(docRef, payload, { merge: true });
}

/**
 * Delete a banner skill
 */
export async function deleteBannerSkill(id) {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "banner_skills", id);
  await deleteDoc(docRef);
}
