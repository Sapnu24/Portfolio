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


export const DEFAULT_SKILL_CATEGORIES = [
  {
    id: "frontend-uiux",
    title: "Frontend & UI/UX Design",
    icon: "code",
    color: "#4f46e5",
    skills: ["React JS", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "WordPress", "Figma", "Bootstrap", "Responsive Layouts"],
    order: 1,
  },
  {
    id: "backend-api",
    title: "Backend & API Architecture",
    icon: "server",
    color: "#4f46e5",
    skills: ["Laravel PHP", "PHP", "Node.js", "MySQL", "PostgreSQL", "RESTful APIs", "Database Design"],
    order: 2,
  },
  {
    id: "cloud-devops-delivery",
    title: "Cloud, DevOps & Delivery",
    icon: "laptop",
    color: "#4f46e5",
    skills: ["Cloudflare", "Docker", "Git & GitHub", "CI/CD", "Render", "Railway", "Agile Sprints", "Upwork Top Rated"],
    order: 3,
  },
];

export const LOCAL_STORAGE_KEY = "smv_personal_skill_categories_v3";

/**
 * Read cached skill categories synchronously from localStorage
 */
export function getCachedSkillCategories() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_SKILL_CATEGORIES;
}

/**
 * Fetch categorized skills from Firestore with local fallback
 */
export async function getSkillCategories() {
  const localData = getCachedSkillCategories();

  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const colRef = collection(db, "skill_categories");
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

    const categories = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        skills: Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === "string"
          ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
    return categories;
  } catch (error) {
    console.warn("Could not fetch skill categories from Firestore, using fallback:", error);
    return localData;
  }
}

/**
 * Add a new skill category
 */
export async function addSkillCategory(categoryData) {
  const skillsArray = Array.isArray(categoryData.skills)
    ? categoryData.skills
    : typeof categoryData.skills === "string"
    ? categoryData.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const payload = {
    ...categoryData,
    skills: skillsArray,
    color: categoryData.color || "#4f46e5",
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = cached ? JSON.parse(cached) : [...DEFAULT_SKILL_CATEGORIES];
    const newId = `cat-${Date.now()}`;
    const newItem = { id: newId, ...payload };
    list.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return newId;
  }

  const docRef = await addDoc(collection(db, "skill_categories"), payload);
  return docRef.id;
}

/**
 * Update an existing skill category
 */
export async function updateSkillCategory(id, categoryData) {
  const skillsArray = Array.isArray(categoryData.skills)
    ? categoryData.skills
    : typeof categoryData.skills === "string"
    ? categoryData.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const payload = {
    ...categoryData,
    skills: skillsArray,
    updatedAt: new Date().toISOString(),
  };

  // Update local storage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).map((cat) =>
      cat.id === id ? { ...cat, ...payload } : cat
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "skill_categories", id);
  await setDoc(docRef, payload, { merge: true });
}


/**
 * Delete a skill category
 */
export async function deleteSkillCategory(id) {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).filter((cat) => cat.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "skill_categories", id);
  await deleteDoc(docRef);
}
