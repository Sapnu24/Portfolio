import { db, storage, isFirebaseConfigured } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const DEFAULT_PROFILE = {
  greeting: "Hi, I'm",
  name: "Sean Marion Velasco",
  role: "Web Developer – Full Stack",
  bio: "Dedicated freelance full-stack developer committed to crafting clean, reliable, and high-performance web applications that help businesses bring their digital vision to life.",
  githubUrl: "https://github.com/Sapnu24",
  linkedinUrl: "https://linkedin.com",
  upworkUrl: "https://www.upwork.com/freelancers/~01c5be6cda3726622f?mp_source=share",
  email: "seanmarionvelasco.work@gmail.com",
  yearsExperience: "1+",
  programmingStartYear: 2023,
};

export const LOCAL_STORAGE_KEY = "smv_personal_profile_settings_v6";

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
      // Document doesn't exist yet, seed it automatically
      await setDoc(docRef, { ...DEFAULT_PROFILE, updatedAt: new Date().toISOString() });
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

/**
 * Seed Hero Profile to Firestore if not exists or forced
 */
export async function seedHeroProfileToFirestore(force = false) {
  if (!isFirebaseConfigured || !db) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }

  try {
    const docRef = doc(db, "settings", "hero");
    if (!force) {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existing = { ...DEFAULT_PROFILE, ...docSnap.data() };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
        return existing;
      }
    }

    await setDoc(docRef, { ...DEFAULT_PROFILE, updatedAt: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  } catch (err) {
    console.warn("Failed to seed hero profile:", err);
    return DEFAULT_PROFILE;
  }
}


