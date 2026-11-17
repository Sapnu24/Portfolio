import { seedHeroProfileToFirestore, DEFAULT_PROFILE } from "./profileServices";
import { seedBannerSkillsToFirestore, DEFAULT_BANNER_SKILLS } from "./bannerSkillsServices";
import { seedProjectsToFirestore, DEFAULT_PROJECTS } from "./projectServices";
import { getLiveAnalytics } from "./analyticsServices";
import { db, isFirebaseConfigured } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

/**
 * Ensures all collections and records exist in Firebase Firestore.
 * If any collection or document is missing or empty, it automatically seeds it with Sean's data.
 */
export async function ensureDatabaseSeeded() {
  if (!isFirebaseConfigured || !db) {
    return { status: "local-mode", message: "Operating in local cache fallback mode" };
  }

  try {
    const results = {
      hero: false,
      bannerSkills: false,
      projects: false,
      analytics: false,
    };

    // 1. Check & Seed Hero Profile
    const hero = await seedHeroProfileToFirestore(false);
    results.hero = Boolean(hero);

    // 2. Check & Seed Banner Skills if empty
    try {
      const skillsCol = collection(db, "banner_skills");
      const skillsSnap = await getDocs(skillsCol);
      if (skillsSnap.empty) {
        await seedBannerSkillsToFirestore(true);
        results.bannerSkills = true;
      }
    } catch {
      // ignore
    }

    // 3. Check & Seed Projects if empty
    try {
      const projCol = collection(db, "projects");
      const projSnap = await getDocs(projCol);
      if (projSnap.empty) {
        await seedProjectsToFirestore(true);
        results.projects = true;
      }
    } catch {
      // ignore
    }

    // 4. Initialize Analytics
    await getLiveAnalytics();
    results.analytics = true;

    return { status: "success", results };
  } catch (err) {
    console.warn("Auto-seed check encountered an issue:", err);
    return { status: "error", error: err.message };
  }
}

/**
 * Force seed all records (Hero profile, 37 banner skills, 10 projects, analytics) to Firestore
 */
export async function seedAllDatabaseRecords(force = true) {
  const [hero, skills, projects, analytics] = await Promise.all([
    seedHeroProfileToFirestore(force),
    seedBannerSkillsToFirestore(force),
    seedProjectsToFirestore(force),
    getLiveAnalytics(),
  ]);

  return {
    hero,
    skillsCount: Array.isArray(skills) ? skills.length : DEFAULT_BANNER_SKILLS.length,
    projectsCount: Array.isArray(projects) ? projects.length : DEFAULT_PROJECTS.length,
    analytics,
  };
}
