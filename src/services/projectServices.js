import { db, storage, isFirebaseConfigured } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const DEFAULT_PROJECTS = [
  {
    id: "kam-maalam-website",
    title: "Kam Maalam Enterprise Web Portal",
    description:
      "Full-scale enterprise organizational web portal featuring dynamic content publishing, client inquiry pipeline, member directory, and multimedia showcase.",
    technologies: ["React JS", "PHP", "Bootstrap", "MySQL", "REST APIs"],
    status: "Production Ready",
    duration: "6 months",
    team: "Lead Developer: Sean Marion Velasco (with my team)",
    featured: true,
    isMasterFeatured: true,
    image: "/img/projects/KMUwebsite.png",
    mobileImage: "/img/projects/km-mobile.png",
    demoUrl: "#",
    githubUrl: "https://github.com",
    order: 3,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "portfolio-website",
    title: "Interactive Developer & Client Portfolio Platform",
    description:
      "High-performance interactive developer portfolio and client showcase built with React, modern CSS architecture, responsive layout systems, and AI assistant.",
    technologies: ["React JS", "JavaScript", "CSS Modules", "Vite", "Framer Motion"],
    status: "Completed",
    duration: "1 month",
    team: "Lead Developer: Sean Marion Velasco",
    featured: true,
    isMasterFeatured: false,
    image: "/img/projects/portfoliov1.png",
    mobileImage: "/img/projects/portfolio-mobile.png",
    demoUrl: "#",
    githubUrl: "https://github.com",
    order: 2,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "acv-adoption",
    title: "Veterinary Management & Adoption System",
    description:
      "Comprehensive animal welfare & veterinary record portal with real-time application processing, patient history tracking, and automated adoption workflows.",
    technologies: ["PHP", "Laravel", "MySQL", "JavaScript", "Bootstrap"],
    status: "Completed",
    duration: "1 year",
    team: "Lead Developer: Sean Marion Velasco (with my team)",
    featured: true,
    isMasterFeatured: false,
    image: "/img/projects/acv.png",
    mobileImage: "/img/projects/acv-mobile.png",
    demoUrl: "https://acvet.example.com",
    githubUrl: "https://github.com",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export const PROJECTS_STORAGE_KEY = "smv_personal_projects_v2";
const LOCAL_STORAGE_KEY = PROJECTS_STORAGE_KEY;

// Map default mobile images for automatic migration
const DEFAULT_MOBILE_MAP = {
  "kam-maalam-website": "/img/projects/km-mobile.png",
  "portfolio-website": "/img/projects/portfolio-mobile.png",
  "acv-adoption": "/img/projects/acv-mobile.png",
};

/**
 * Standard sorting helper: Master Featured project first (#1), then Featured projects, then sorted by createdAt/order descending
 */
export function sortProjects(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const isMasterA = a.isMasterFeatured === true || a.isMasterFeatured === "true";
    const isMasterB = b.isMasterFeatured === true || b.isMasterFeatured === "true";
    if (isMasterA && !isMasterB) return -1;
    if (!isMasterA && isMasterB) return 1;

    const isFeaturedA = a.featured === true || a.featured === "true" || a.featured === 1;
    const isFeaturedB = b.featured === true || b.featured === "true" || b.featured === 1;
    if (isFeaturedA && !isFeaturedB) return -1;
    if (!isFeaturedA && isFeaturedB) return 1;

    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (Number(a.order) || 0);
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (Number(b.order) || 0);
    return dateB - dateA;
  });
}

export function getCachedProjects() {
  try {
    const cached = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const enriched = parsed.map((p) => ({
          ...p,
          mobileImage: p.mobileImage || DEFAULT_MOBILE_MAP[p.id] || p.image,
        }));
        return sortProjects(enriched);
      }
    }
  } catch {
    // fallback
  }
  return sortProjects(DEFAULT_PROJECTS);
}

/**
 * Read total project count synchronously from localStorage
 */
export function getCachedProjectCount() {
  try {
    const cachedProjects = getCachedProjects();
    if (Array.isArray(cachedProjects) && cachedProjects.length > 0) {
      return cachedProjects.length;
    }
  } catch {
    // fallback
  }
  return DEFAULT_PROJECTS.length;
}

/**
 * Fetch all projects from Firestore with local fallback
 */
export async function getProjects() {
  const localData = getCachedProjects();

  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const projectsRef = collection(db, "projects");
    // Fetch all documents directly without strict orderBy filter to avoid skipping docs without order field
    const snapshot = await getDocs(projectsRef);

    if (snapshot.empty) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }

    const projects = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const isMaster = Boolean(data.isMasterFeatured);
      const isFeatured = Boolean(data.featured || isMaster);
      return {
        id: docSnap.id,
        ...data,
        isMasterFeatured: isMaster,
        featured: isFeatured,
        technologies: Array.isArray(data.technologies)
          ? data.technologies
          : typeof data.technologies === "string"
          ? data.technologies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
    });

    // Prioritize Master Featured project at #1 first position, then latest to least
    const sorted = sortProjects(projects);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(sorted));
    return sorted;
  } catch (error) {
    console.warn("Error fetching projects from Firestore, using fallback:", error);
    return localData;
  }
}

/**
 * Toggle or set a project as the Master Featured (Latest Works) project.
 */
export async function setMasterFeaturedProject(projectId, status = true) {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).map((p) => ({
      ...p,
      isMasterFeatured: p.id === projectId ? status : false,
      featured: p.id === projectId && status ? true : p.featured,
    }));
    list.sort((a, b) => {
      if (a.isMasterFeatured && !b.isMasterFeatured) return -1;
      if (!a.isMasterFeatured && b.isMasterFeatured) return 1;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (Number(a.order) || 0);
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (Number(b.order) || 0);
      return dateB - dateA;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) return;

  const snapshot = await getDocs(collection(db, "projects"));
  for (const docSnap of snapshot.docs) {
    const isTarget = docSnap.id === projectId;
    const shouldBeMaster = isTarget ? status : false;
    const currentStatus = docSnap.data().isMasterFeatured;
    if (shouldBeMaster !== currentStatus) {
      await setDoc(
        doc(db, "projects", docSnap.id),
        {
          isMasterFeatured: shouldBeMaster,
          ...(shouldBeMaster ? { featured: true } : {}),
        },
        { merge: true }
      );
    }
  }
}

/**
 * Seed only RIET Website and ACV Vet Capstone directly to Firebase Firestore
 */
export async function seedProjectsToFirestore(override = false) {
  if (!isFirebaseConfigured || !db) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }

  const projectsRef = collection(db, "projects");
  const snapshot = await getDocs(projectsRef);

  // If override, clean up existing
  if (override && !snapshot.empty) {
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "projects", docSnap.id));
    }
  }

  const seeded = [];
  for (const project of DEFAULT_PROJECTS) {
    const { id, ...data } = project;
    const docRef = doc(db, "projects", id);
    const payload = {
      ...data,
      order: data.order || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    seeded.push({ id, ...payload });
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

/**
 * Get total project count dynamically
 */
export async function getProjectCount() {
  try {
    const projects = await getProjects();
    if (Array.isArray(projects) && projects.length > 0) {
      return projects.length;
    }
    return DEFAULT_PROJECTS.length;
  } catch (error) {
    console.error("Error calculating total project count:", error);
    return DEFAULT_PROJECTS.length;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Automatically compress and resize an image into a super-compact Base64 WebP string (~30KB-60KB).
 * This fits easily within Firestore's 1MB document size limit and loads instantaneously on Vercel without storage buckets.
 */
export async function fileToBase64WebP(file, maxWidth = 960, maxHeight = 640, quality = 0.78) {
  if (!file) return "";
  if (file.type === "image/svg+xml") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP Base64
        const webpDataUrl = canvas.toDataURL("image/webp", quality);
        resolve(webpDataUrl);
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve("");
  });
}

/**
 * Automatically compress and resize an image before uploading.
 */
export async function compressImage(file, maxWidth = 1200, maxHeight = 800, quality = 0.82) {
  if (!file) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = "image/webp";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanName, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export const PROJECT_FOLDER_IMAGES = [
  { label: "KMU Web Portal (Kam Maalam)", path: "/img/projects/KMUwebsite.png" },
  { label: "Kam Maalam (km.png)", path: "/img/projects/km.png" },
  { label: "Kam Maalam Mobile View", path: "/img/projects/km-mobile.png" },
  { label: "Personal Portfolio", path: "/img/projects/portfoliov1.png" },
  { label: "Personal Portfolio Mobile View", path: "/img/projects/portfolio-mobile.png" },
  { label: "Angeles City Vet (ACV)", path: "/img/projects/acv.png" },
  { label: "ACV Mobile View", path: "/img/projects/acv-mobile.png" },
  { label: "RIET Website", path: "/img/projects/riet.png" },
  { label: "ACV Admin Panel", path: "/img/projects/acv-admin.png" },
  { label: "Kam Maalam Admin", path: "/img/projects/admin-kmu.png" },
  { label: "Kam Maalam Final", path: "/img/projects/kmu-final.png" },
  { label: "Document Management System", path: "/img/projects/dms.png" },
  { label: "Internship System", path: "/img/projects/intern.png" },
  { label: "Main Web Portal", path: "/img/projects/mainweb.png" },
];

/**
 * Upload a project thumbnail image:
 * 1. Locally (npm run dev): Automatically saves directly into public/img/projects/ via Vite plugin.
 * 2. On Vercel / Production: Automatically compresses to ultra-compact WebP Base64 in Firestore!
 */
export async function uploadProjectThumbnail(file, onProgress) {
  if (!file) throw new Error("No file selected for upload.");

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a PNG, JPG, WEBP, GIF, or SVG image.");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("File is too large. Maximum size is 25MB.");
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  if (onProgress) onProgress(25);

  // 1. Attempt local file system save (Active in Vite local dev)
  try {
    const res = await fetch("/api/save-project-image", {
      method: "POST",
      headers: {
        "x-filename": encodeURIComponent(cleanFileName),
      },
      body: file,
    });

    if (res.ok) {
      const data = await res.json();
      if (onProgress) onProgress(100);
      return data.path || `/img/projects/${cleanFileName}`;
    }
  } catch (err) {
    console.info("Local filesystem endpoint unavailable (Vercel/Production mode):", err);
  }

  // 2. Production / Vercel fallback: Auto-compress to ultra-compact WebP Base64 in Firestore!
  if (onProgress) onProgress(60);
  const compressedBase64 = await fileToBase64WebP(file);
  if (onProgress) onProgress(100);

  if (compressedBase64 && compressedBase64.length > 50) {
    return compressedBase64;
  }

  return `/img/projects/${cleanFileName}`;
}


/**
 * Add a new project to Firestore
 */
export async function addProject(projectData) {
  const payload = {
    ...projectData,
    order: Number(projectData.order) || Date.now(),
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = cached ? JSON.parse(cached) : [...DEFAULT_PROJECTS];
    const newId = `proj-${Date.now()}`;
    const newItem = { id: newId, ...payload };
    list.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return newId;
  }

  const docRef = await addDoc(collection(db, "projects"), payload);
  return docRef.id;
}

/**
 * Update an existing project in Firestore
 */
export async function updateProject(id, projectData) {
  const payload = {
    ...projectData,
    updatedAt: new Date().toISOString(),
  };

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).map((p) =>
      p.id === id ? { ...p, ...payload } : p
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "projects", id);
  await setDoc(docRef, payload, { merge: true });
}


/**
 * Delete a project from Firestore
 */
export async function deleteProject(id) {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "projects", id);
  await deleteDoc(docRef);
}