import { db, storage, isFirebaseConfigured } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const DEFAULT_PROFILE = {
  greeting: "Hi, I'm",
  name: "Sean Marion Velasco",
  role: "Full-Stack Developer & Software Engineer",
  bio: "Full-stack software engineer specializing in high-performance React web applications, scalable Laravel PHP backends, REST APIs, and bespoke digital solutions for global clients.",
  githubUrl: "https://github.com",
  facebookUrl: "",
  upworkUrl: "https://www.upwork.com",
  email: "contact@seanvelasco.dev",
  phone: "+1 (555) 019-2834",
  yearsExperience: "4+",
  programmingStartYear: 2021,
  resumeUrl: "",
};

export const LOCAL_STORAGE_KEY = "smv_personal_profile_settings_v2";

/**
 * Read cached hero and profile settings synchronously from localStorage for instant, flicker-free rendering
 */
export function getCachedHeroProfile() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          upworkUrl: parsed.upworkUrl || parsed.indeedUrl || DEFAULT_PROFILE.upworkUrl,
        };
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PROFILE;
}

/**
 * Fetch hero and profile settings from Firestore with local fallback
 */
export async function getHeroProfile() {
  // Check local cache first for instant UI response or fallback
  const localData = getCachedHeroProfile();


  if (!isFirebaseConfigured || !db) {
    return localData;
  }

  try {
    const docRef = doc(db, "settings", "hero");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const merged = { ...DEFAULT_PROFILE, ...data };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } else {
      // Document doesn't exist yet, return local/default data
      return localData;
    }
  } catch (error) {
    console.warn("Could not fetch hero profile from Firestore, using fallback:", error);
    return localData;
  }
}

/**
 * Save / Update hero and profile settings in Firestore
 */
export async function updateHeroProfile(profileData) {
  const merged = {
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  // Always keep localStorage updated
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));

  if (!isFirebaseConfigured || !db) {
    console.info("Saved profile to local cache (Firebase not yet configured).");
    return merged;
  }

  try {
    const docRef = doc(db, "settings", "hero");
    await setDoc(docRef, merged, { merge: true });
    return merged;
  } catch (error) {
    console.error("Failed to update profile settings in Firestore:", error);
    throw error;
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
 * Upload a PDF resume file to Firebase Storage with automatic fallback
 */
export async function uploadResumeFile(file, onProgress) {
  if (!file) throw new Error("No file selected for upload.");

  if (!isFirebaseConfigured || !storage) {
    if (onProgress) {
      onProgress(50);
      await new Promise((r) => setTimeout(r, 100));
      onProgress(100);
    }
    return await fileToBase64(file);
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageRef = ref(storage, `resumes/${Date.now()}_${cleanFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || "application/pdf",
    });

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (onProgress) onProgress(progress);
        },
        async (error) => {
          console.warn("Firebase Storage upload fallback triggered:", error);
          if (onProgress) onProgress(100);
          try {
            const base64 = await fileToBase64(file);
            resolve(base64);
          } catch (e) {
            reject(e);
          }
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            const base64 = await fileToBase64(file);
            resolve(base64);
          }
        }
      );
    });
  } catch (err) {
    console.warn("Firebase Storage error, falling back to Base64:", err);
    if (onProgress) onProgress(100);
    return await fileToBase64(file);
  }
}

