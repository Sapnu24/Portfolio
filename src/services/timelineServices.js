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
    id: "agency-founder-scaling",
    role: "Full-Stack Developer & Technical Lead",
    company: "Freelance & Upwork Engineering",
    period: "2024 - Present",
    description:
      "Delivering full-stack web engineering and technical architecture for international clients on Upwork. Leading development of high-throughput React, Laravel, and Node.js solutions (assisted by my team for larger project scopes).",
    tags: ["React JS", "Laravel PHP", "Cloud Architecture", "REST APIs"],
    iconType: "briefcase",
    order: 1,
  },
  {
    id: "lead-web-engineering",
    role: "Senior Full-Stack Developer",
    company: "Digital Solutions & Client Engineering",
    period: "2023 - 2024",
    description:
      "Architected responsive web portals, secure RESTful APIs, database structures, and dynamic dashboards with a focus on performance and clean code standards.",
    tags: ["Full-Stack Engineering", "MySQL", "PHP", "React JS"],
    iconType: "award",
    order: 2,
  },
  {
    id: "frontend-uiux-specialization",
    role: "Frontend & UI/UX Engineer",
    company: "Web Platforms & Custom Systems",
    period: "2022 - 2023",
    description:
      "Crafted intuitive user interfaces, modular design systems, and responsive layouts across cross-functional client web applications.",
    tags: ["React", "UI/UX", "Tailwind CSS", "JavaScript"],
    iconType: "laptop",
    order: 3,
  },
  {
    id: "academic-engineering",
    role: "B.S. in Information Technology & Software Engineering",
    company: "Academic & Technical Engineering Foundation",
    period: "2020 - 2024",
    description:
      "Comprehensive engineering background covering algorithms, distributed database systems, network protocols, and software development methodologies.",
    tags: ["Software Engineering", "Databases", "Web Architecture"],
    iconType: "graduation",
    order: 4,
  },
];

export const LOCAL_STORAGE_KEY = "smv_personal_timeline_data_v2";

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
