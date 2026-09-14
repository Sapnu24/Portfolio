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
  // Row 1 - Frontend & Modern Web
  { id: "bs-react", name: "React", iconKey: "react", isVisible: true, showInHero: true, order: 1 },
  { id: "bs-nextjs", name: "Next.js", iconKey: "nextjs", isVisible: true, showInHero: false, order: 2 },
  { id: "bs-typescript", name: "TypeScript", iconKey: "typescript", isVisible: true, showInHero: true, order: 3 },
  { id: "bs-javascript", name: "JavaScript", iconKey: "javascript", isVisible: true, showInHero: false, order: 4 },
  { id: "bs-html5", name: "HTML5", iconKey: "html5", isVisible: true, showInHero: false, order: 5 },
  { id: "bs-css3", name: "CSS3", iconKey: "css3", isVisible: true, showInHero: false, order: 6 },
  { id: "bs-tailwind", name: "Tailwind CSS", iconKey: "tailwind", isVisible: true, showInHero: true, order: 7 },
  { id: "bs-bootstrap", name: "Bootstrap", iconKey: "bootstrap", isVisible: true, showInHero: false, order: 8 },
  { id: "bs-vite", name: "Vite", iconKey: "vite", isVisible: true, showInHero: true, order: 9 },

  // Row 2 - Backend, Servers & APIs
  { id: "bs-laravel", name: "Laravel", iconKey: "laravel", isVisible: true, showInHero: true, order: 10 },
  { id: "bs-php", name: "PHP", iconKey: "php", isVisible: true, showInHero: true, order: 11 },
  { id: "bs-node-express", name: "Node.js & Express", iconKey: "nodejs", isVisible: true, showInHero: true, order: 12 },
  { id: "bs-rest-api", name: "REST APIs", iconKey: "graphql", isVisible: true, showInHero: false, order: 13 },
  { id: "bs-python", name: "Python", iconKey: "python", isVisible: true, showInHero: false, order: 14 },
  { id: "bs-cplusplus", name: "C/C++", iconKey: "cplusplus", isVisible: true, showInHero: false, order: 15 },
  { id: "bs-java", name: "Java", iconKey: "java", isVisible: true, showInHero: false, order: 16 },
  { id: "bs-mysql", name: "MySQL", iconKey: "mysql", isVisible: true, showInHero: false, order: 17 },
  { id: "bs-postgresql", name: "PostgreSQL", iconKey: "postgresql", isVisible: true, showInHero: false, order: 18 },

  // Row 3 - Cloud, Databases, Version Control & DevOps
  { id: "bs-git", name: "Git", iconKey: "git", isVisible: true, showInHero: true, order: 19 },
  { id: "bs-github", name: "GitHub", iconKey: "github", isVisible: true, showInHero: true, order: 20 },
  { id: "bs-firebase", name: "Firebase", iconKey: "firebase", isVisible: true, showInHero: true, order: 21 },
  { id: "bs-supabase", name: "Supabase", iconKey: "supabase", isVisible: true, showInHero: true, order: 22 },
  { id: "bs-vercel", name: "Vercel", iconKey: "vercel", isVisible: true, showInHero: true, order: 23 },
  { id: "bs-redis", name: "Redis", iconKey: "redis", isVisible: true, showInHero: false, order: 24 },
  { id: "bs-cloudflare-pages", name: "Cloudflare Pages", iconKey: "cloudflarepages", isVisible: true, showInHero: false, order: 25 },
  { id: "bs-cloudflare-workers", name: "Cloudflare Workers", iconKey: "cloudflareworkers", isVisible: true, showInHero: false, order: 26 },
  { id: "bs-render", name: "Render", iconKey: "render", isVisible: true, showInHero: false, order: 27 },
  { id: "bs-railway", name: "Railway", iconKey: "railway", isVisible: true, showInHero: false, order: 28 },
  { id: "bs-docker", name: "Docker", iconKey: "docker", isVisible: true, showInHero: false, order: 29 },

  // Row 4 - Observability, Mobile, BaaS & Tooling
  { id: "bs-grafana", name: "Grafana", iconKey: "grafana", isVisible: true, showInHero: false, order: 30 },
  { id: "bs-firebase-baas", name: "Firebase & Firestore", iconKey: "firebase", isVisible: true, showInHero: false, order: 31 },
  { id: "bs-flutter", name: "Flutter", iconKey: "flutter", isVisible: true, showInHero: false, order: 32 },
  { id: "bs-dart", name: "Dart", iconKey: "dart", isVisible: true, showInHero: false, order: 33 },
  { id: "bs-wordpress", name: "WordPress", iconKey: "wordpress", isVisible: true, showInHero: false, order: 34 },
  { id: "bs-figma", name: "Figma", iconKey: "figma", isVisible: true, showInHero: false, order: 35 },
  { id: "bs-postman", name: "Postman", iconKey: "postman", isVisible: true, showInHero: false, order: 36 },
  { id: "bs-xampp", name: "XAMPP", iconKey: "xampp", isVisible: true, showInHero: false, order: 37 },
];

const LOCAL_STORAGE_KEY = "smv_portfolio_banner_skills_v5";

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

/**
 * Seed all default banner skills directly to Firestore
 */
export async function seedBannerSkillsToFirestore(override = false) {
  if (!isFirebaseConfigured || !db) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_BANNER_SKILLS));
    return DEFAULT_BANNER_SKILLS;
  }

  const colRef = collection(db, "banner_skills");
  const snapshot = await getDocs(colRef);

  if (override && !snapshot.empty) {
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "banner_skills", docSnap.id));
    }
  }

  const seeded = [];
  for (const skill of DEFAULT_BANNER_SKILLS) {
    const { id, ...data } = skill;
    const docRef = doc(db, "banner_skills", id);
    const payload = {
      ...data,
      order: data.order || Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    seeded.push({ id, ...payload });
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}
