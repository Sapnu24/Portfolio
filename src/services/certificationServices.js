import { db, isFirebaseConfigured } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  getCountFromServer,
} from "firebase/firestore";

export const DEFAULT_CERTIFICATIONS = [
  {
    id: "laravel-php-cert",
    title: "Laravel & PHP Full-Stack Engineering",
    description: "Advanced backend architecture, MVC design patterns, API development, and database optimizations.",
    skills: ["Laravel", "PHP", "MySQL", "REST APIs"],
    status: "Verified",
    duration: "Certified",
    issuer: "Ground Gurus & Professional Engineering",
    verificationUrl: "https://groundgurus.net/certificate/dkb/",
    featured: true,
    order: 1,
  },
  {
    id: "react-js-cert",
    title: "Modern React.js & Frontend Architecture",
    description: "Component architecture, state management, reactive UI design systems, and responsive web development.",
    skills: ["React JS", "JavaScript", "TypeScript", "Tailwind CSS"],
    status: "Verified",
    duration: "Certified",
    issuer: "Ground Gurus & Professional Engineering",
    verificationUrl: "https://groundgurus.net/certificate/iy3/",
    featured: true,
    order: 2,
  },
];

export const LOCAL_STORAGE_KEY = "smv_srn_certifications_v1";

/**
 * Read cached certifications synchronously from localStorage
 */
export function getCachedCertifications() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_CERTIFICATIONS;
}

/**
 * Fetch all certifications from Firestore with local fallback
 */
export async function getCertifications() {
  const localData = getCachedCertifications();

  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const certsRef = collection(db, "certifications");
    const snapshot = await getDocs(certsRef);

    if (snapshot.empty) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CERTIFICATIONS));
      return DEFAULT_CERTIFICATIONS;
    }

    const certs = snapshot.docs.map((docSnap) => {
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

    // Sort by order or createdAt
    certs.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certs));
    return certs;
  } catch (error) {
    console.warn("Error fetching certifications from Firestore, using fallback:", error);
    return localData;
  }
}

/**
 * Add a new certification to Firestore
 */
export async function addCertification(certData) {
  const payload = {
    ...certData,
    order: Number(certData.order) || Date.now(),
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = cached ? JSON.parse(cached) : [...DEFAULT_CERTIFICATIONS];
    const newId = `cert-${Date.now()}`;
    const newItem = { id: newId, ...payload };
    list.push(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return newId;
  }

  const docRef = await addDoc(collection(db, "certifications"), payload);
  return docRef.id;
}

/**
 * Update an existing certification in Firestore
 */
export async function updateCertification(id, certData) {
  const payload = {
    ...certData,
    updatedAt: new Date().toISOString(),
  };

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).map((c) =>
      c.id === id ? { ...c, ...payload } : c
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "certifications", id);
  await setDoc(docRef, payload, { merge: true });
}

/**
 * Delete a certification from Firestore
 */
export async function deleteCertification(id) {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    const list = JSON.parse(cached).filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }

  if (!isFirebaseConfigured || !db) {
    return;
  }

  const docRef = doc(db, "certifications", id);
  await deleteDoc(docRef);
}

/**
 * Seed existing Ground Gurus certifications directly to Firestore
 */
export async function seedCertificationsToFirestore(override = false) {
  if (!isFirebaseConfigured || !db) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_CERTIFICATIONS));
    return DEFAULT_CERTIFICATIONS;
  }

  const certsRef = collection(db, "certifications");
  const snapshot = await getDocs(certsRef);

  if (override && !snapshot.empty) {
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "certifications", docSnap.id));
    }
  }

  const seeded = [];
  for (const cert of DEFAULT_CERTIFICATIONS) {
    const { id, ...data } = cert;
    const docRef = doc(db, "certifications", id);
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
 * Get total certification count dynamically
 */
export async function getCertificationCount() {
  if (!isFirebaseConfigured || !db) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = cached ? JSON.parse(cached) : DEFAULT_CERTIFICATIONS;
    return list.length;
  }

  try {
    const certsRef = collection(db, "certifications");
    const snapshot = await getCountFromServer(certsRef);
    const count = snapshot.data().count;
    return count > 0 ? count : DEFAULT_CERTIFICATIONS.length;
  } catch {
    const certs = await getCertifications();
    return certs.length;
  }
}
