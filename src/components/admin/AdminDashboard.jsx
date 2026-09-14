import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebaseClient";
import {
  BriefcaseBusiness,
  CheckCircle2,
  FolderKanban,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  Sparkles,
  ExternalLink,
  Check,
  Briefcase,
  Layers,
  Menu,
  Star,
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Monitor,
  Smartphone,
  Compass,
  Loader2,
  RefreshCw,
  Zap,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";

import styles from "@/styles/AdminDashboard.module.css";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadProjectThumbnail,
  seedProjectsToFirestore,
  setMasterFeaturedProject,
  DEFAULT_PROJECTS,
  formatExternalUrl,
  inferProjectCategory,
} from "@/services/projectServices";
import {
  getHeroProfile,
  updateHeroProfile,
  seedHeroProfileToFirestore,
  DEFAULT_PROFILE,
} from "@/services/profileServices";
import {
  getBannerSkills,
  addBannerSkill,
  updateBannerSkill,
  deleteBannerSkill,
  seedBannerSkillsToFirestore,
  DEFAULT_BANNER_SKILLS,
} from "@/services/bannerSkillsServices";
import {
  getLiveAnalytics,
  subscribeToLiveAnalytics,
  triggerTestVisit,
  resetAnalyticsData,
  DEFAULT_ANALYTICS,
} from "@/services/analyticsServices";
import {
  ensureDatabaseSeeded,
  seedAllDatabaseRecords,
} from "@/services/seedServices";
import { getTechIcon, detectTechKey, getAllTechOptions, getTechBadgeData } from "@/utils/techIcons";
import TechIconPicker from "./TechIconPicker";

const POPULAR_STACK_SUGGESTIONS = [
  { name: "Cloudflare Pages", key: "cloudflarepages" },
  { name: "Cloudflare Workers", key: "cloudflareworkers" },
  { name: "Render", key: "render" },
  { name: "Railway", key: "railway" },
  { name: "Vercel", key: "vercel" },
  { name: "Firebase", key: "firebase" },
  { name: "React JS", key: "react" },
  { name: "Tailwind CSS", key: "tailwind" },
  { name: "TypeScript", key: "typescript" },
  { name: "Node.js", key: "nodejs" },
  { name: "Laravel PHP", key: "laravel" },
  { name: "MySQL", key: "mysql" },
  { name: "PostgreSQL", key: "postgresql" },
  { name: "Docker", key: "docker" },
  { name: "Git", key: "git" },
];

const adminPages = [
  { id: "overview", label: "Overview", icon: FolderKanban },
  { id: "analytics", label: "Analytics & Traffic", icon: BarChart3 },
  { id: "hero", label: "Home / Hero & Profile", icon: Sparkles },
  { id: "banner", label: "Tech Stacks & Banner", icon: Layers },
  { id: "projects", label: "Projects Showcase", icon: BriefcaseBusiness },
];

export default function AdminDashboard({ isDemo = false }) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");
  const activePageMeta = adminPages.find((page) => page.id === activePage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(DEFAULT_ANALYTICS);

  // Lock body scroll on mobile when sidebar drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Toast Notification state
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // 1. Hero & Profile state
  const [heroForm, setHeroForm] = useState(DEFAULT_PROFILE);
  const [savingHero, setSavingHero] = useState(false);

  // 2. Banner Skills state
  const [bannerSkills, setBannerSkills] = useState(DEFAULT_BANNER_SKILLS);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerSearch, setBannerSearch] = useState("");
  const [bannerFilter, setBannerFilter] = useState("all"); // "all" | "hero" | "carousel" | "hidden"
  const [bannerForm, setBannerForm] = useState({
    name: "",
    iconKey: "react",
    iconUrl: "",
    isVisible: true,
    showInHero: true,
  });

  // 3. Projects state
  const [projectList, setProjectList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectTagInput, setProjectTagInput] = useState("");
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Websites",
    status: "Completed",
    duration: "1 year",
    team: "Solo",
    technologies: ["React", "Laravel PHP", "Tailwind CSS"],
    description: "",
    image: "/img/projects/project-generic-thumbnail.jpg",
    demoUrl: "",
    githubUrl: "https://github.com/Sapnu24",
    featured: true,
    isMasterFeatured: false,
  });

  const allTechOptions = useMemo(() => getAllTechOptions(), []);
  const matchingProjectTags = useMemo(() => {
    const q = projectTagInput.trim().toLowerCase();
    if (!q) return [];
    return allTechOptions
      .filter((opt) => opt.name.toLowerCase().includes(q) || opt.key.toLowerCase().includes(q))
      .slice(0, 8);
  }, [projectTagInput, allTechOptions]);

  const handleSelectSuggestedProjectTag = (tagName) => {
    if (!projectForm.technologies.includes(tagName)) {
      setProjectForm((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tagName],
      }));
    }
    setProjectTagInput("");
  };

  const handleToggleProjectTag = (tagName) => {
    setProjectForm((prev) => {
      const current = Array.isArray(prev.technologies) ? prev.technologies : [];
      const exists = current.includes(tagName);
      return {
        ...prev,
        technologies: exists
          ? current.filter((t) => t !== tagName)
          : [...current, tagName],
      };
    });
  };

  // Drag and Drop & Upload state for Project Thumbnail
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Universal CRUD loading tracker
  const [crudLoading, setCrudLoading] = useState({});

  const withLoading = async (key, asyncFn) => {
    setCrudLoading((prev) => ({ ...prev, [key]: true }));
    try {
      return await asyncFn();
    } finally {
      setCrudLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Check Admin session
  useEffect(() => {
    if (isDemo) return;
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          localStorage.removeItem("portfolioAdminSession");
          navigate("/admin");
        } else {
          localStorage.setItem("portfolioAdminSession", "active");
        }
      });
      return () => unsubscribe();
    } else {
      const session = localStorage.getItem("portfolioAdminSession");
      if (session !== "active") {
        navigate("/admin");
      }
    }
  }, [navigate, isDemo]);

  // Load all initial data and subscribe to live Firestore updates
  useEffect(() => {
    // 1. Subscribe to real-time analytics
    const unsubscribeAnalytics = subscribeToLiveAnalytics((liveData) => {
      if (liveData) setAnalyticsData(liveData);
    });

    // 2. Auto-seed check on mount
    ensureDatabaseSeeded().catch((err) => console.warn("Auto-seed error:", err));

    // 3. Load all admin records
    async function loadAllAdminData() {
      try {
        const [heroData, bannerData, projData, liveAnalytics] = await Promise.all([
          getHeroProfile(),
          getBannerSkills(),
          getProjects(),
          getLiveAnalytics(),
        ]);

        if (heroData) setHeroForm(heroData);
        if (bannerData) setBannerSkills(bannerData);
        if (projData) setProjectList(projData);
        if (liveAnalytics) setAnalyticsData(liveAnalytics);
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadAllAdminData();

    return () => {
      if (unsubscribeAnalytics) unsubscribeAnalytics();
    };
  }, [isDemo]);

  const handleLogout = async () => {
    localStorage.removeItem("portfolioAdminSession");
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Sign out failed:", e);
      }
    }
    navigate("/admin");
  };

  // ==========================================
  // HERO & PROFILE HANDLERS
  // ==========================================
  const handleSaveHero = async (e) => {
    if (e) e.preventDefault();
    await withLoading("save-hero", async () => {
      setSavingHero(true);
      try {
        await updateHeroProfile(heroForm);
        showToast("Hero & Profile settings saved successfully!");
      } catch (err) {
        console.error("Save hero failed:", err);
        if (err.code === "permission-denied" || err.message?.toLowerCase().includes("permission")) {
          showToast("Session not authenticated with Firebase. Please sign in at /admin.");
        } else {
          showToast(err.message || "Failed to save hero settings.");
        }
      } finally {
        setSavingHero(false);
      }
    });
  };

  // ==========================================
  // BANNER CAROUSEL & HERO TECH STACK HANDLERS
  // ==========================================
  const handleToggleHeroSkill = async (skill) => {
    const isCurrentlyInHero = Boolean(skill.showInHero);
    const currentHeroCount = bannerSkills.filter((s) => s.showInHero).length;
    const nextStatus = !isCurrentlyInHero;

    if (nextStatus && currentHeroCount >= 12) {
      showToast("Maximum of 12 skills can be featured in the Hero section. Please unfeature one first.");
      return;
    }

    await withLoading(`hero-skill-${skill.id}`, async () => {
      const updated = { ...skill, showInHero: nextStatus };
      setBannerSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? updated : s))
      );
      try {
        await updateBannerSkill(skill.id, updated);
        showToast(`${skill.name} ${nextStatus ? "featured in" : "removed from"} Hero section!`);
      } catch (err) {
        console.warn("Hero skill toggle failed:", err);
      }
    });
  };

  const handleToggleBannerVisibility = async (skill) => {
    await withLoading(`vis-skill-${skill.id}`, async () => {
      const updated = { ...skill, isVisible: !skill.isVisible };
      setBannerSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? updated : s))
      );
      try {
        await updateBannerSkill(skill.id, updated);
        showToast(`${skill.name} carousel visibility updated.`);
      } catch (err) {
        console.warn("Banner skill toggle failed:", err);
      }
    });
  };

  const handleDeleteBannerSkill = async (id) => {
    if (!window.confirm("Remove this tech stack from the banner and hero?")) return;
    await withLoading(`del-banner-${id}`, async () => {
      try {
        await deleteBannerSkill(id);
        setBannerSkills((prev) => prev.filter((s) => s.id !== id));
        showToast("Tech stack removed.");
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleSaveAllBannerSkills = async () => {
    await withLoading("save-all-banner", async () => {
      try {
        for (const skill of bannerSkills) {
          await updateBannerSkill(skill.id, skill);
        }
        showToast("All banner skills saved to database!");
      } catch (err) {
        console.error("Failed to sync banner skills:", err);
        showToast(err.message || "Failed to save banner skills.");
      }
    });
  };

  const handleSaveBannerSkillModal = async (e) => {
    e.preventDefault();
    await withLoading("save-banner", async () => {
      const newId = await addBannerSkill(bannerForm);
      setBannerSkills((prev) => [...prev, { id: newId, ...bannerForm }]);
      showToast(`Added ${bannerForm.name} to tech stacks!`);
      setShowBannerModal(false);
      setBannerForm({ name: "", iconKey: "react", iconUrl: "", isVisible: true, showInHero: true });
    });
  };

  // ==========================================
  // PROJECTS & THUMBNAIL HANDLERS
  // ==========================================
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectTagInput("");
    setProjectForm({
      title: "",
      category: "Websites",
      status: "Completed",
      duration: "1 year",
      team: "Solo",
      technologies: ["React", "Laravel PHP"],
      description: "",
      image: "/img/projects/project-generic-thumbnail.jpg",
      demoUrl: "",
      githubUrl: "https://github.com/Sapnu24",
      featured: true,
      isMasterFeatured: false,
    });
    setUploadProgress(null);
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (project) => {
    setEditingProject(project);
    setProjectTagInput("");
    const cleanDemoUrl = formatExternalUrl(
      project.demoUrl || project.demoLink || project.liveUrl || project.link
    );
    const cleanGithubUrl = formatExternalUrl(
      project.githubUrl || project.githubLink || project.repoUrl
    );

    setProjectForm({
      title: project.title || "",
      category: project.category || inferProjectCategory(project) || "Websites",
      status: project.status || "Completed",
      duration: project.duration || "",
      team: project.team || "Solo",
      technologies: Array.isArray(project.technologies)
        ? [...project.technologies]
        : typeof project.technologies === "string"
          ? project.technologies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      description: project.description || "",
      image: project.image || "/img/projects/project-generic-thumbnail.jpg",
      demoUrl: cleanDemoUrl,
      githubUrl: cleanGithubUrl || "https://github.com/Sapnu24",
      featured: Boolean(project.featured),
      isMasterFeatured: Boolean(project.isMasterFeatured),
    });
    setUploadProgress(null);
    setShowProjectModal(true);
  };

  const handleToggleMasterFeatured = async (id) => {
    const target = projectList.find((p) => p.id === id);
    const newStatus = !target?.isMasterFeatured;
    await withLoading(`star-proj-${id}`, async () => {
      try {
        await setMasterFeaturedProject(id, newStatus);
        setProjectList((prev) => {
          const updated = prev.map((p) => ({
            ...p,
            isMasterFeatured: p.id === id ? newStatus : false,
            featured: p.id === id && newStatus ? true : p.featured,
          }));
          updated.sort((a, b) => {
            if (a.isMasterFeatured && !b.isMasterFeatured) return -1;
            if (!a.isMasterFeatured && b.isMasterFeatured) return 1;
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (Number(a.order) || 0);
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (Number(b.order) || 0);
            return dateB - dateA;
          });
          return updated;
        });
        showToast(
          newStatus
            ? `🌟 Set "${target?.title || "Project"}" as Master Featured (#1 in Dev)!`
            : `Removed Master Featured priority from "${target?.title || "Project"}".`
        );
      } catch (err) {
        console.error(err);
        showToast("Failed to update Master Featured status.");
      }
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    await withLoading(`del-proj-${id}`, async () => {
      try {
        await deleteProject(id);
        setProjectList((prev) => prev.filter((p) => p.id !== id));
        showToast("Project deleted.");
      } catch (e) {
        console.warn("Project delete failed:", e);
      }
    });
  };

  const handleThumbnailFileUpload = async (file) => {
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setProjectForm((prev) => ({ ...prev, image: tempUrl }));
    setUploadingImage(true);
    setUploadProgress(15);

    try {
      const downloadURL = await uploadProjectThumbnail(file, (progress) => {
        setUploadProgress(progress);
      });
      setProjectForm((prev) => ({ ...prev, image: downloadURL }));
      showToast("Thumbnail uploaded successfully!");
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      showToast(err.message || "Failed to upload project thumbnail.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleThumbnailFileUpload(file);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (uploadingImage) {
      showToast("Please wait for the image upload to complete before saving.");
      return;
    }
    if (projectForm.image && projectForm.image.startsWith("blob:")) {
      showToast("Image upload still in progress or failed. Please re-select the image.");
      return;
    }
    await withLoading("save-project", async () => {
      const formattedDemoUrl = formatExternalUrl(projectForm.demoUrl);
      const formattedGithubUrl = formatExternalUrl(projectForm.githubUrl);

      const payload = {
        ...projectForm,
        category: (projectForm.category && projectForm.category.trim()) ? projectForm.category.trim() : "Websites",
        demoUrl: formattedDemoUrl,
        githubUrl: formattedGithubUrl,
        technologies: Array.isArray(projectForm.technologies)
          ? projectForm.technologies
          : typeof projectForm.technologies === "string"
            ? projectForm.technologies.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
      };

      if (editingProject) {
        try {
          await updateProject(editingProject.id, payload);
        } catch (err) {
          console.warn("Project update failed:", err);
        }
        setProjectList((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...p, ...payload } : p))
        );
        showToast("Project updated successfully!");
      } else {
        let newId = `proj-${Date.now()}`;
        try {
          const createdId = await addProject(payload);
          if (createdId) newId = createdId;
        } catch (err) {
          console.warn("Project add failed:", err);
        }
        setProjectList((prev) => [{ id: newId, ...payload }, ...prev]);
        showToast("New project added!");
      }

      setShowProjectModal(false);
    });
  };

  // ==========================================
  // SEED ALL DATABASE RECORDS HANDLER
  // ==========================================
  const handleSeedAllRecords = async () => {
    if (!window.confirm("Seed all portfolio records (Hero profile, 37 tech stacks, 10 projects, analytics) to your Firebase Firestore?")) return;
    await withLoading("seed-all", async () => {
      try {
        const result = await seedAllDatabaseRecords(true);
        if (result.hero) setHeroForm(result.hero);
        const [updatedSkills, updatedProjects] = await Promise.all([
          getBannerSkills(),
          getProjects(),
        ]);
        if (updatedSkills) setBannerSkills(updatedSkills);
        if (updatedProjects) setProjectList(updatedProjects);
        showToast("🌟 Successfully seeded all 10 projects, 37 tech stacks, and Sean's Hero info to Firebase!");
      } catch (err) {
        console.error("Seeding all records failed:", err);
        showToast(err.message || "Failed to seed records to Firebase.");
      }
    });
  };

  const filteredProjects = projectList.filter((p) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(query);
    const techMatch = Array.isArray(p.technologies)
      ? p.technologies.some((t) => t.toLowerCase().includes(query))
      : false;
    return titleMatch || techMatch;
  });

  // ==========================================
  // PANEL RENDERERS
  // ==========================================

  // 1. OVERVIEW
  const renderOverview = () => {
    const heroFeaturedCount = bannerSkills.filter((s) => s.showInHero).length;
    const activeMarqueeCount = bannerSkills.filter((s) => s.isVisible !== false).length;

    return (
      <>
        <section className={styles.metricsGrid}>
          {[
            {
              icon: BarChart3,
              label: "Live Pageviews",
              value: `${analyticsData.totalPageviews || 1}`,
              isAnalytics: true,
            },
            {
              icon: Users,
              label: "Unique Visitors",
              value: `${analyticsData.uniqueVisitors || 1}`,
              isAnalytics: true,
            },
            {
              icon: FolderKanban,
              label: "Total Projects",
              value: projectList.length.toString(),
            },
            {
              icon: Sparkles,
              label: "Years Experience",
              value: heroForm.yearsExperience || "1+",
            },
            {
              icon: Layers,
              label: "Marquee Tech Stacks",
              value: activeMarqueeCount.toString(),
            },
            {
              icon: Zap,
              label: "Hero Featured Skills",
              value: `${heroFeaturedCount}/12`,
            },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                className={styles.metricCard}
                style={m.isAnalytics ? { cursor: "pointer", border: "1.5px solid rgba(79, 70, 229, 0.25)", background: "#eef2ff" } : {}}
                onClick={m.isAnalytics ? () => setActivePage("analytics") : undefined}
                title={m.isAnalytics ? "Click to open Live Real-time Analytics" : undefined}
              >
                <Icon size={26} color={m.isAnalytics ? "var(--primary-color, #4f46e5)" : undefined} />
                <div>
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              </div>
            );
          })}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Quick Actions & Live Status</h2>
          </div>
          <div className={styles.quickActionsGrid}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setActivePage("analytics")}
            >
              <BarChart3 size={16} /> Live Analytics Hub
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setActivePage("hero")}
            >
              <Sparkles size={16} /> Home & Hero Profile
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleOpenAddProject}
            >
              <Plus size={16} /> Add New Project
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setActivePage("banner")}
            >
              <Layers size={16} /> Tech Stacks Manager
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleSeedAllRecords}
              disabled={crudLoading["seed-all"]}
              title="Seed all Sean's initial records to Firebase"
              style={{ color: "var(--primary-color, #4f46e5)", borderColor: "rgba(79, 70, 229, 0.35)", background: "rgba(79, 70, 229, 0.05)" }}
            >
              {crudLoading["seed-all"] ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Seeding Firebase...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Seed All Data to Firebase</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.liveStatusCard}>
            <h4>Portfolio Live Status</h4>
            <p>
              <strong>Active Name:</strong> {heroForm.greeting} {heroForm.name}
            </p>
            <p>
              <strong>Current Role:</strong> {heroForm.role}
            </p>
            <p>
              <strong>Real-time Total Pageviews:</strong>{" "}
              <span style={{ color: "#059669", fontWeight: 700 }}>
                {analyticsData.totalPageviews || 1}
              </span>{" "}
              (Unique Visitors: {analyticsData.uniqueVisitors || 1})
            </p>
            <p>
              <strong>Upwork Freelance Status:</strong>{" "}
              <span style={{ color: "#10b981", fontWeight: 700 }}>100% Job Success • Top Rated</span>
            </p>
          </div>
        </section>
      </>
    );
  };

  // 2. ANALYTICS & TRAFFIC
  const renderAnalytics = () => {
    const totalViews = Math.max(analyticsData.totalPageviews || 1, 1);
    const uniqueVisitors = Math.max(analyticsData.uniqueVisitors || 1, 1);

    // Real-time Route Pageviews matching live site components
    const rawPages = [
      { path: "/", label: "Home / Hero Section", count: analyticsData.pageCounts?.["/"] || 1 },
      { path: "/#nextSection", label: "About / Philosophy", count: analyticsData.pageCounts?.["/#nextSection"] || 0 },
      { path: "/#skills", label: "Tech Stacks Marquee", count: analyticsData.pageCounts?.["/#skills"] || 0 },
      { path: "/#projects", label: "Projects Showcase", count: analyticsData.pageCounts?.["/#projects"] || 0 },
      { path: "/#contact", label: "Contact & Upwork Form", count: analyticsData.pageCounts?.["/#contact"] || 0 },
    ];

    const topPages = rawPages.map((p) => ({
      ...p,
      percent: Math.min(Math.round((p.count / totalViews) * 100), 100),
    }));

    // Real-time Devices
    const devCounts = analyticsData.deviceCounts || { desktop: 1, mobile: 0, tablet: 0 };
    const devTotal = Math.max((devCounts.desktop || 0) + (devCounts.mobile || 0) + (devCounts.tablet || 0), 1);
    const devDesktopPct = Math.round(((devCounts.desktop || 0) / devTotal) * 100);
    const devMobilePct = Math.round(((devCounts.mobile || 0) / devTotal) * 100);
    const devTabletPct = Math.max(100 - devDesktopPct - devMobilePct, 0);

    // Real-time Referrers
    const refCounts = analyticsData.referrerCounts || { direct: 1, github: 0, upwork: 0, linkedin: 0, search: 0, other: 0 };
    const refTotal = Math.max(
      (refCounts.direct || 0) + (refCounts.github || 0) + (refCounts.upwork || 0) + (refCounts.linkedin || 0) + (refCounts.search || 0) + (refCounts.other || 0),
      1
    );

    const trafficSources = [
      { source: "Direct Link & Bookmarks", count: refCounts.direct || 0, share: Math.round(((refCounts.direct || 0) / refTotal) * 100) },
      { source: "GitHub Profile & Repos", count: refCounts.github || 0, share: Math.round(((refCounts.github || 0) / refTotal) * 100) },
      { source: "Upwork Client Traffic", count: refCounts.upwork || 0, share: Math.round(((refCounts.upwork || 0) / refTotal) * 100) },
      { source: "LinkedIn Networking", count: refCounts.linkedin || 0, share: Math.round(((refCounts.linkedin || 0) / refTotal) * 100) },
      { source: "Google & Search Engines", count: refCounts.search || 0, share: Math.round(((refCounts.search || 0) / refTotal) * 100) },
    ];

    const recentVisits = Array.isArray(analyticsData.recentVisits) && analyticsData.recentVisits.length > 0
      ? analyticsData.recentVisits
      : [
        {
          id: "v-default",
          path: "/",
          device: "desktop",
          referrer: "direct",
          timestamp: new Date().toISOString(),
        },
      ];

    const handleTriggerTest = async () => {
      await withLoading("trigger-test", async () => {
        const updated = await triggerTestVisit("/");
        if (updated) {
          setAnalyticsData(updated);
          showToast(`Real-time visit logged! Live Pageviews: ${updated.totalPageviews}`);
        }
      });
    };

    const handleResetAnalytics = async () => {
      if (!window.confirm("Are you sure you want to reset the real-time analytics counter?")) return;
      await withLoading("reset-analytics", async () => {
        const reset = await resetAnalyticsData();
        if (reset) {
          setAnalyticsData(reset);
          showToast("Analytics counters reset successfully!");
        }
      });
    };

    return (
      <>
        {/* Analytics Top Control Header */}
        <section className={styles.panel} style={{ marginBottom: "1.25rem" }}>
          <div className={styles.analyticsHeader}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>Live Real-Time Traffic & Analytics</h2>
                <div className={styles.statusPillLive}>
                  <span className={styles.pulseDotGreen} />
                  <span>Real-Time Firestore Tracking Active</span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Live visitor tracking synchronized across Firestore. Real page loads and section views update these numbers instantly.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleTriggerTest}
                disabled={crudLoading["trigger-test"]}
                title="Test increment real-time visitor count"
                style={{ fontSize: "0.82rem" }}
              >
                {crudLoading["trigger-test"] ? (
                  <Loader2 size={15} className={styles.spinner} />
                ) : (
                  <Activity size={15} />
                )}
                <span>Record Test Visit</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
                style={{ fontSize: "0.82rem", textDecoration: "none" }}
              >
                <ExternalLink size={15} /> Open Live Site
              </a>
            </div>
          </div>

          {/* 4 Real-time KPI Cards */}
          <div className={styles.metricsGrid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            <div className={styles.metricCard}>
              <BarChart3 size={24} color="var(--primary-color, #4f46e5)" />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <strong>{totalViews}</strong>
                  <span className={styles.trendBadgePositive}>
                    <TrendingUp size={11} /> Real Live
                  </span>
                </div>
                <span>Total Page Views</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <Users size={24} color="#06b6d4" />
              <div>
                <strong>{uniqueVisitors}</strong>
                <span>Unique Visitors</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <Compass size={24} color="#3b82f6" />
              <div>
                <strong>{trafficSources.filter(s => s.count > 0).length || 1}</strong>
                <span>Active Channels</span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <Activity size={24} color="#10b981" />
              <div>
                <strong style={{ color: "#10b981" }}>Live (24/7)</strong>
                <span>Tracking Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Breakdown Grid */}
        <section className={styles.analyticsGrid}>
          {/* Card 1: Top Pages & Routes */}
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsCardHeader}>
              <h4>Real Visited Routes & Sections</h4>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Live Hits (%)</span>
            </div>
            <div className={styles.progressList}>
              {topPages.map((page, idx) => (
                <div key={idx} className={styles.progressItem}>
                  <div className={styles.progressLabelRow}>
                    <span>
                      {page.label}{" "}
                      <code style={{ fontSize: "0.72rem", color: "#64748b", background: "#f1f5f9", padding: "0.1rem 0.3rem", borderRadius: "4px" }}>
                        {page.path}
                      </code>
                    </span>
                    <span>
                      <strong>{page.count}</strong> ({page.percent}%)
                    </span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${Math.max(page.percent, 3)}%`,
                        background: idx === 0 ? "var(--primary-color, #4f46e5)" : idx === 1 ? "#06b6d4" : idx === 2 ? "#3b82f6" : "#6366f1",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Traffic Sources & Channels */}
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsCardHeader}>
              <h4>Traffic Acquisition Channels</h4>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Referral Share</span>
            </div>
            <div className={styles.progressList}>
              {trafficSources.map((src, idx) => (
                <div key={idx} className={styles.progressItem}>
                  <div className={styles.progressLabelRow}>
                    <span>{src.source}</span>
                    <span>
                      <strong>{src.count}</strong> ({src.share}%)
                    </span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${Math.max(src.share, 3)}%`,
                        background: idx === 0 ? "var(--primary-color, #4f46e5)" : idx === 1 ? "#06b6d4" : idx === 2 ? "#3b82f6" : "#6366f1",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Devices & Browsers */}
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsCardHeader}>
              <h4>Real Visitor Devices</h4>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Distribution</span>
            </div>
            <div className={styles.analyticsDeviceGrid}>
              <div className={styles.deviceItemCard}>
                <Monitor size={22} color="var(--primary-color, #4f46e5)" style={{ margin: "0 auto 0.4rem" }} />
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{devDesktopPct}%</div>
                <div style={{ fontSize: "0.74rem", color: "#64748b" }}>Desktop ({devCounts.desktop || 0})</div>
              </div>
              <div className={styles.deviceItemCard}>
                <Smartphone size={22} color="#06b6d4" style={{ margin: "0 auto 0.4rem" }} />
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{devMobilePct}%</div>
                <div style={{ fontSize: "0.74rem", color: "#64748b" }}>Mobile ({devCounts.mobile || 0})</div>
              </div>
              <div className={styles.deviceItemCard}>
                <Activity size={22} color="#f59e0b" style={{ margin: "0 auto 0.4rem" }} />
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{devTabletPct || 0}%</div>
                <div style={{ fontSize: "0.74rem", color: "#64748b" }}>Tablet ({devCounts.tablet || 0})</div>
              </div>
            </div>
          </div>

          {/* Card 4: Recent Real Visits Feed */}
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsCardHeader}>
              <h4>Recent Live Visits Feed</h4>
              <span style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 700 }}>Live Feed</span>
            </div>
            <div className={styles.recentVisitsFeed}>
              {recentVisits.map((visit, i) => (
                <div
                  key={visit.id || i}
                  className={styles.recentVisitRow}
                >
                  <div className={styles.recentVisitLeft}>
                    <span style={{ textTransform: "capitalize", fontWeight: 700, color: "var(--primary-color, #4f46e5)" }}>
                      {visit.device || "desktop"}
                    </span>
                    <span style={{ color: "#64748b" }}>→</span>
                    <code>{visit.path || "/"}</code>
                  </div>
                  <span style={{ color: "#94a3b8", fontSize: "0.72rem", flexShrink: 0 }}>
                    {visit.timestamp ? new Date(visit.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Testing & Reset Panel */}
        <section className={styles.panel} style={{ marginTop: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--primary-color, #4f46e5)" }}>
                Live Tracking Controls & Calibration
              </h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Test pageview logging or reset analytics database counters at any time.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleResetAnalytics}
                disabled={crudLoading["reset-analytics"]}
                style={{ color: "#ef4444", borderColor: "#fca5a5" }}
              >
                {crudLoading["reset-analytics"] ? (
                  <Loader2 size={15} className={styles.spinner} />
                ) : (
                  <Trash2 size={15} />
                )}
                <span>Reset Counters</span>
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleTriggerTest}
                disabled={crudLoading["trigger-test"]}
              >
                {crudLoading["trigger-test"] ? (
                  <Loader2 size={16} className={styles.spinner} />
                ) : (
                  <Activity size={16} />
                )}
                <span>Record Test Visit</span>
              </button>
            </div>
          </div>
        </section>
      </>
    );
  };

  // 3. HOME / HERO & PROFILE SETTINGS
  const renderHero = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Home, Hero & Profile Settings</h2>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Customize your intro greeting, full name, role, bio, and verified client channels.
          </span>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleSaveHero}
          disabled={savingHero || crudLoading["save-hero"]}
        >
          {crudLoading["save-hero"] || savingHero ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSaveHero} style={{ display: "grid", gap: "1.25rem" }}>
        <div className={styles.formGrid}>
          <label>
            Greeting Prefix
            <input
              type="text"
              value={heroForm.greeting || ""}
              onChange={(e) => setHeroForm({ ...heroForm, greeting: e.target.value })}
              placeholder="Hi, I'm"
            />
          </label>
          <label>
            Full Name
            <input
              type="text"
              value={heroForm.name || ""}
              onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
              placeholder="Sean Marion Velasco"
            />
          </label>
        </div>

        <div className={styles.formGrid}>
          <label>
            Main Role / Subtitle
            <input
              type="text"
              value={heroForm.role || ""}
              onChange={(e) => setHeroForm({ ...heroForm, role: e.target.value })}
              placeholder="Web Developer – Full Stack"
            />
          </label>
          <label>
            Programming Years Experience
            <input
              type="text"
              value={heroForm.yearsExperience || ""}
              onChange={(e) =>
                setHeroForm({ ...heroForm, yearsExperience: e.target.value })
              }
              placeholder="1+"
            />
          </label>
        </div>

        <label className={styles.textAreaLabel}>
          Hero Bio / Tagline Narrative
          <textarea
            rows="3"
            value={heroForm.bio || ""}
            onChange={(e) => setHeroForm({ ...heroForm, bio: e.target.value })}
            placeholder="Dedicated freelance full-stack developer committed to crafting clean, reliable, and high-performance web applications..."
          />
        </label>

        <div className={styles.panelHeader} style={{ marginTop: "0.5rem" }}>
          <h3>Client Channels & Social Links</h3>
        </div>

        <div className={styles.formGrid}>
          <label>
            Email Address
            <input
              type="email"
              value={heroForm.email || ""}
              onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
              placeholder="seanmarionvelasco.work@gmail.com"
            />
          </label>
          <label>
            Upwork Profile URL
            <input
              type="url"
              value={heroForm.upworkUrl || ""}
              onChange={(e) =>
                setHeroForm({ ...heroForm, upworkUrl: e.target.value })
              }
              placeholder="https://www.upwork.com/freelancers/~01c5be6cda3726622f?mp_source=share"
            />
          </label>
        </div>

        <div className={styles.formGrid}>
          <label>
            GitHub Profile URL
            <input
              type="url"
              value={heroForm.githubUrl || ""}
              onChange={(e) =>
                setHeroForm({ ...heroForm, githubUrl: e.target.value })
              }
              placeholder="https://github.com/Sapnu24"
            />
          </label>
          <label>
            Dynamic Projects Handled / Done
            <input
              type="text"
              disabled
              value={`${projectList.length} Projects (Auto-computed from Projects database)`}
              style={{ background: "#f1f5f9", cursor: "not-allowed" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={savingHero || crudLoading["save-hero"]}
          >
            {crudLoading["save-hero"] || savingHero ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );

  // 4. BANNER CAROUSEL & HERO TECH STACKS
  const renderBanner = () => {
    const heroCount = bannerSkills.filter((s) => s.showInHero).length;
    const carouselCount = bannerSkills.filter((s) => s.isVisible !== false).length;
    const hiddenCount = bannerSkills.filter((s) => s.isVisible === false).length;

    const filteredBannerSkills = bannerSkills.filter((s) => {
      if (bannerFilter === "hero" && !s.showInHero) return false;
      if (bannerFilter === "carousel" && s.isVisible === false) return false;
      if (bannerFilter === "hidden" && s.isVisible !== false) return false;
      if (bannerSearch.trim()) {
        const q = bannerSearch.trim().toLowerCase();
        return (
          s.name?.toLowerCase().includes(q) ||
          s.iconKey?.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return (
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Tech Stacks & Banner Skills Manager</h2>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Manage technologies, carousel marquee visibility, and choose up to 12 featured skills for your Hero section.
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
            <div
              className={`${styles.heroSkillCounterBadge} ${
                heroCount >= 12 ? styles.heroSkillCounterFull : ""
              }`}
            >
              <Sparkles size={14} />
              <span>
                Featured in Hero: <strong>{heroCount}/12</strong>
                {heroCount >= 12 ? " (Hero Full)" : ` (${12 - heroCount} left)`}
              </span>
            </div>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={crudLoading["seed-banner"]}
              onClick={() => {
                if (window.confirm("Seed and sync all 37 curated technologies to Firebase Firestore?")) {
                  withLoading("seed-banner", async () => {
                    const seeded = await seedBannerSkillsToFirestore(true);
                    setBannerSkills(seeded);
                    showToast("Successfully seeded 37 tech stacks to Firebase Firestore!");
                  });
                }
              }}
              title="Seed all 37 curated technologies to Firebase"
            >
              {crudLoading["seed-banner"] ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Seeding...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Seed Skills</span>
                </>
              )}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={crudLoading["save-all-banner"]}
              onClick={handleSaveAllBannerSkills}
            >
              {crudLoading["save-all-banner"] ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save All</span>
                </>
              )}
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => setShowBannerModal(true)}
            >
              <Plus size={18} /> Add Tech Stack
            </button>
          </div>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className={styles.bannerToolbar}>
          <div className={styles.bannerSearchBox}>
            <Search size={15} className={styles.bannerSearchIcon} />
            <input
              type="text"
              placeholder="Search tech (e.g. React, Laravel, Docker, Python)..."
              value={bannerSearch}
              onChange={(e) => setBannerSearch(e.target.value)}
              className={styles.bannerSearchInput}
            />
            {bannerSearch && (
              <button
                type="button"
                onClick={() => setBannerSearch("")}
                className={styles.bannerSearchClear}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.bannerFilterTabs}>
            <button
              type="button"
              className={`${styles.bannerFilterBtn} ${
                bannerFilter === "all" ? styles.bannerFilterBtnActive : ""
              }`}
              onClick={() => setBannerFilter("all")}
            >
              <span>All Tech</span>
              <span className={styles.bannerFilterBadge}>{bannerSkills.length}</span>
            </button>
            <button
              type="button"
              className={`${styles.bannerFilterBtn} ${
                bannerFilter === "hero" ? styles.bannerFilterBtnActive : ""
              }`}
              onClick={() => setBannerFilter("hero")}
            >
              <Sparkles size={13} />
              <span>Hero Featured</span>
              <span className={styles.bannerFilterBadge}>{heroCount}/12</span>
            </button>
            <button
              type="button"
              className={`${styles.bannerFilterBtn} ${
                bannerFilter === "carousel" ? styles.bannerFilterBtnActive : ""
              }`}
              onClick={() => setBannerFilter("carousel")}
            >
              <Globe size={13} />
              <span>In Carousel</span>
              <span className={styles.bannerFilterBadge}>{carouselCount}</span>
            </button>
            <button
              type="button"
              className={`${styles.bannerFilterBtn} ${
                bannerFilter === "hidden" ? styles.bannerFilterBtnActive : ""
              }`}
              onClick={() => setBannerFilter("hidden")}
            >
              <EyeOff size={13} />
              <span>Hidden</span>
              <span className={styles.bannerFilterBadge}>{hiddenCount}</span>
            </button>
          </div>
        </div>

        {/* Tech Stacks Grid */}
        {filteredBannerSkills.length === 0 ? (
          <div className={styles.bannerEmptyState}>
            <p>No technologies match your current search or filter criteria.</p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setBannerSearch("");
                setBannerFilter("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.bannerSkillsGrid}>
            {filteredBannerSkills.map((s) => {
              const inHero = Boolean(s.showInHero);
              const isHidden = s.isVisible === false;

              return (
                <div
                  key={s.id}
                  className={`${styles.bannerSkillCard} ${
                    inHero ? styles.bannerSkillCardInHero : ""
                  } ${isHidden ? styles.bannerSkillCardHidden : ""}`}
                >
                  <div className={styles.bannerSkillMain}>
                    <div className={styles.bannerSkillIconWrap}>
                      {getTechIcon(s.iconKey || s.name, 20)}
                    </div>
                    <div className={styles.bannerSkillInfoGroup}>
                      <span className={styles.bannerSkillName} title={s.name}>
                        {s.name}
                      </span>
                      <div className={styles.bannerSkillBadges}>
                        {inHero && (
                          <span className={styles.inHeroMiniBadge}>
                            <Sparkles size={10} /> Hero
                          </span>
                        )}
                        {!isHidden ? (
                          <span className={styles.carouselActiveBadge}>Carousel</span>
                        ) : (
                          <span className={styles.carouselHiddenBadge}>Hidden</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.bannerSkillActions}>
                    {/* Hero Toggle */}
                    <button
                      type="button"
                      className={`${styles.bannerActionBtn} ${
                        inHero
                          ? styles.bannerActionHeroActive
                          : styles.bannerActionHeroInactive
                      }`}
                      disabled={crudLoading[`hero-skill-${s.id}`]}
                      title={
                        inHero
                          ? "Featured in Hero section (Click to remove)"
                          : heroCount >= 12
                          ? "Hero section is full (12/12). Unfeature one to add this."
                          : "Feature in Hero section (up to 12)"
                      }
                      onClick={() => handleToggleHeroSkill(s)}
                    >
                      {crudLoading[`hero-skill-${s.id}`] ? (
                        <Loader2 size={14} className={styles.spinner} />
                      ) : (
                        <Sparkles size={14} />
                      )}
                      <span className={styles.bannerActionText}>
                        {inHero ? "In Hero" : "Hero"}
                      </span>
                    </button>

                    {/* Carousel Visibility Toggle */}
                    <button
                      type="button"
                      className={`${styles.bannerActionBtn} ${
                        !isHidden
                          ? styles.bannerActionVisActive
                          : styles.bannerActionVisInactive
                      }`}
                      disabled={crudLoading[`vis-skill-${s.id}`]}
                      title={
                        !isHidden
                          ? "Visible in Carousel (Click to hide)"
                          : "Hidden from Carousel (Click to show)"
                      }
                      onClick={() => handleToggleBannerVisibility(s)}
                    >
                      {crudLoading[`vis-skill-${s.id}`] ? (
                        <Loader2 size={14} className={styles.spinner} />
                      ) : !isHidden ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className={`${styles.bannerActionBtn} ${styles.bannerActionDelete}`}
                      title="Remove tech stack"
                      disabled={crudLoading[`del-banner-${s.id}`]}
                      onClick={() => handleDeleteBannerSkill(s.id)}
                    >
                      {crudLoading[`del-banner-${s.id}`] ? (
                        <Loader2 size={14} className={styles.spinner} />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // 5. PROJECTS
  const renderProjects = () => (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Projects Manager ({filteredProjects.length})</h2>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Add and manage portfolio projects with drag & drop thumbnail uploading to Firebase Storage.
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              if (window.confirm("Seed all 10 portfolio projects to your Firebase Firestore?")) {
                withLoading("seed-projects", async () => {
                  const seeded = await seedProjectsToFirestore(true);
                  setProjectList(seeded);
                  showToast("Successfully seeded 10 projects to Firebase Firestore!");
                });
              }
            }}
            disabled={crudLoading["seed-projects"]}
            title="Seed all 10 projects to Firebase"
          >
            {crudLoading["seed-projects"] ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                <span>Seeding...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Seed Projects</span>
              </>
            )}
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleOpenAddProject}
          >
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      {loadingProjects ? (
        <p style={{ padding: "1.5rem" }}>Loading projects...</p>
      ) : (
        <div className={styles.projectTableWrapper}>
          <div className={styles.projectTable}>
            <div className={styles.projectTableHeader}>
              <span>Project</span>
              <span>Category</span>
              <span>Status</span>
              <span>Duration</span>
              <span>Tech Stack</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>
            {filteredProjects.map((p) => {
              const statusClass =
                p.status === "Completed"
                  ? styles.statusCompleted
                  : p.status === "Deployment"
                    ? styles.statusDeployment
                    : styles.statusProgress;

              return (
                <div key={p.id} className={styles.projectTableRow}>
                  <div className={styles.mobileFieldRow}>
                    <strong className={styles.projectTitleText}>
                      {p.title}
                    </strong>
                    {p.isMasterFeatured && (
                      <span className={styles.masterFeaturedBadge}>
                        Master Featured (#1 in Dev)
                      </span>
                    )}
                    {p.featured && !p.isMasterFeatured && (
                      <small className={styles.featuredBadge}>
                        ★ Featured
                      </small>
                    )}
                    {/* Live Demo & GitHub link indicators */}
                    <div className={styles.projectLinksRow}>
                      {formatExternalUrl(p.demoUrl) ? (
                        <a
                          href={formatExternalUrl(p.demoUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectDemoLink}
                          title={`Live Demo: ${formatExternalUrl(p.demoUrl)}`}
                        >
                          <Globe size={11} /> Live Demo
                        </a>
                      ) : (
                        <span
                          className={styles.projectNoDemoBadge}
                          title="No Live Demo URL configured (button hidden on portfolio)"
                        >
                          No Demo Link
                        </span>
                      )}
                      {formatExternalUrl(p.githubUrl) && (
                        <a
                          href={formatExternalUrl(p.githubUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectGithubLink}
                          title={`GitHub: ${formatExternalUrl(p.githubUrl)}`}
                        >
                          <ExternalLink size={11} /> GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={styles.mobileFieldRow}>
                    <span className={styles.mobileFieldLabel}>Category</span>
                    <span className={styles.categoryBadge}>
                      {p.category || inferProjectCategory(p)}
                    </span>
                  </div>

                  <div className={styles.mobileFieldRow}>
                    <span className={styles.mobileFieldLabel}>Status</span>
                    <span className={`${styles.statusBadge} ${statusClass}`}>{p.status || "In progress"}</span>
                  </div>

                  <div className={styles.mobileFieldRow}>
                    <span className={styles.mobileFieldLabel}>Duration</span>
                    <span className={styles.durationText}>{p.duration || "—"}</span>
                  </div>

                  <div className={styles.mobileFieldRow}>
                    <span className={styles.mobileFieldLabel}>Tech Stack</span>
                    <div className={styles.techStackRow}>
                      {Array.isArray(p.technologies) && p.technologies.length > 0 ? (
                        p.technologies.map((t, idx) => {
                          const badge = getTechBadgeData(t);
                          const Icon = badge.icon;
                          return (
                            <span
                              key={idx}
                              className={styles.techBadgeChip}
                              title={t}
                            >
                              {Icon && <Icon size={11} className={styles.techBadgeIcon} />}
                              <span>{t}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>—</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={`${styles.iconButton} ${p.isMasterFeatured ? styles.masterStarBtnActive : styles.masterStarBtn}`}
                      disabled={crudLoading[`star-proj-${p.id}`]}
                      title={
                        p.isMasterFeatured
                          ? "Master Featured (Latest Works) - Click to unpin"
                          : "Pin as Master Featured (Latest Works #1)"
                      }
                      onClick={() => handleToggleMasterFeatured(p.id)}
                    >
                      {crudLoading[`star-proj-${p.id}`] ? (
                        <Loader2 size={16} className={styles.spinner} />
                      ) : (
                        <Star size={16} fill={p.isMasterFeatured ? "#f59e0b" : "none"} />
                      )}
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      title="Edit project"
                      onClick={() => handleOpenEditProject(p)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.deleteBtn}`}
                      title="Delete project"
                      disabled={crudLoading[`del-proj-${p.id}`]}
                      onClick={() => handleDeleteProject(p.id)}
                    >
                      {crudLoading[`del-proj-${p.id}`] ? (
                        <Loader2 size={16} className={styles.spinner} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );

  const renderActivePage = () => {
    switch (activePage) {
      case "analytics":
        return renderAnalytics();
      case "hero":
        return renderHero();
      case "banner":
        return renderBanner();
      case "projects":
        return renderProjects();
      default:
        return renderOverview();
    }
  };

  return (
    <main className={styles.adminPage}>
      {/* Toast */}
      {toastMsg && (
        <div className={styles.toast}>
          <CheckCircle2 size={20} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <a href="/" className={styles.brand} title="Back to Portfolio">
            SMV<span className={styles.brandDot}>.</span>
          </a>
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sideNav} aria-label="Admin sections">
          {adminPages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                type="button"
                key={page.id}
                className={activePage === page.id ? styles.active : ""}
                onClick={() => {
                  setActivePage(page.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} /> {page.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={18} /> {isDemo ? "Exit Demo" : "Logout"}
        </button>
      </aside>

      {/* Workspace */}
      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.menuToggle}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <span className={styles.eyebrow}>
                {isDemo ? "Portfolio Admin Panel (Demo Sandbox)" : "Portfolio Admin Panel"}
              </span>
              <h1>{activePageMeta?.label || "Content Manager"}</h1>
            </div>
          </div>
          <div className={styles.topbarActions}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search projects or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ThemeToggle compact />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={16} /> <span className={styles.liveSiteText}>View Live Site</span>
            </a>
          </div>
        </header>

        {renderActivePage()}
      </section>

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT PROJECT (DRAG & DROP THUMBNAIL) */}
      {/* ======================================================== */}
      {showProjectModal && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowProjectModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{editingProject ? "Edit Project" : "Add New Project"}</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowProjectModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveProject}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  placeholder="e.g. WellPet VetCore Pro"
                />
              </div>

              {/* Drag and Drop Thumbnail Zone */}
              <div>
                <label>Project Thumbnail (Drag & Drop or Click to Upload)</label>
                {projectForm.image ? (
                  <div className={styles.previewThumbContainer}>
                    <img
                      src={projectForm.image}
                      alt="Thumbnail Preview"
                      className={styles.previewThumb}
                      onError={(e) => {
                        if (!e.target.src.endsWith("/img/projects/project-generic-thumbnail.jpg")) {
                          e.target.src = "/img/projects/project-generic-thumbnail.jpg";
                        }
                      }}
                    />
                    <div className={styles.thumbOverlay}>
                      <button
                        type="button"
                        className={styles.changeThumbBtn}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus size={15} /> Change Thumbnail
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles.removeThumbBtn}
                      onClick={() => setProjectForm({ ...projectForm, image: "" })}
                      title="Remove image"
                    >
                      <X size={16} color="#ffffff" strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""
                      }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus size={36} className={styles.dropZoneIcon} />
                    <div className={styles.dropZoneText}>
                      <strong>Drag & drop thumbnail here, or click to browse</strong>
                      <span>Supports PNG, JPG, WEBP, GIF, SVG (Max 5MB)</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailFileUpload(file);
                  }}
                />

                {uploadingImage && uploadProgress !== null && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginTop: "0.4rem",
                      }}
                    >
                      <span>Uploading to Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label>Project Category</label>
                  <select
                    value={
                      ["Websites", "Systems", "Mobile Apps", "Full Stack", "UI/UX Design", "IoT & Hardware", "Cloud & DevOps"].includes(projectForm.category)
                        ? projectForm.category
                        : "Other"
                    }
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setProjectForm({ ...projectForm, category: "" });
                      } else {
                        setProjectForm({ ...projectForm, category: e.target.value });
                      }
                    }}
                  >
                    <option value="Websites">Websites (Web Apps, Portals, Landing Pages)</option>
                    <option value="Systems">Systems (Management Systems, POS, ERP, DMS)</option>
                    <option value="Mobile Apps">Mobile Apps (iOS, Android, PWA, Flutter)</option>
                    <option value="Full Stack">Full Stack (Backend + Frontend Platforms)</option>
                    <option value="UI/UX Design">UI/UX Design (Prototypes & Interfaces)</option>
                    <option value="IoT & Hardware">IoT & Hardware (Telemetry, Embedded)</option>
                    <option value="Cloud & DevOps">Cloud & DevOps (Serverless, Monitoring)</option>
                    <option value="Other">Custom Category (Type below)...</option>
                  </select>
                  {(!["Websites", "Systems", "Mobile Apps", "Full Stack", "UI/UX Design", "IoT & Hardware", "Cloud & DevOps"].includes(projectForm.category) || projectForm.category === "") && (
                    <input
                      type="text"
                      style={{ marginTop: "0.45rem" }}
                      placeholder="Type custom category (e.g. AI Tools, Web3, Blockchain)..."
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    />
                  )}
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, status: e.target.value })
                    }
                  >
                    <option value="Completed">Completed</option>
                    <option value="Deployment">Deployment</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label>Team</label>
                  <select
                    value={projectForm.team}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, team: e.target.value })
                    }
                  >
                    <option value="Solo">Solo</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
                <div>
                  <label>Duration</label>
                  <input
                    type="text"
                    value={projectForm.duration}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, duration: e.target.value })
                    }
                    placeholder="e.g. Ongoing, 1 year, 3 weeks"
                  />
                </div>
              </div>

              <div>
                <label>Thumbnail Image URL / Path</label>
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, image: e.target.value })
                  }
                  placeholder="/img/projects/project-generic-thumbnail.jpg"
                />
              </div>

              {/* Technologies Tag Input */}
              <div>
                <label>Tech Stack Tags</label>
                <div className={styles.tagContainer} style={{ flexWrap: "wrap", minHeight: "48px" }}>
                  {(Array.isArray(projectForm.technologies)
                    ? projectForm.technologies
                    : []
                  ).map((t, idx) => {
                    const badge = getTechBadgeData(t);
                    const Icon = badge.icon;
                    return (
                      <span
                        key={idx}
                        className={styles.tagPill}
                      >
                        {Icon && <Icon size={12} className={styles.tagPillIcon} />}
                        <span>{t}</span>
                        <button
                          type="button"
                          className={styles.tagRemoveBtn}
                          onClick={() =>
                            setProjectForm({
                              ...projectForm,
                              technologies: projectForm.technologies.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          title={`Remove ${t}`}
                        >
                          <X size={13} />
                        </button>
                      </span>
                    );
                  })}
                  <div className={styles.tagInputWrapper}>
                    <input
                      type="text"
                      placeholder="+ Type or search tag..."
                      className={styles.tagInputField}
                      value={projectTagInput}
                      onChange={(e) => setProjectTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const tag = projectTagInput.trim();
                          if (tag && !projectForm.technologies.includes(tag)) {
                            setProjectForm({
                              ...projectForm,
                              technologies: [...projectForm.technologies, tag],
                            });
                            setProjectTagInput("");
                          }
                        }
                      }}
                    />
                    {matchingProjectTags.length > 0 && (
                      <div className={styles.tagAutocompleteMenu}>
                        {matchingProjectTags.map((opt) => {
                          const IconComp = opt.icon;
                          const isAlreadyAdded = (projectForm.technologies || []).includes(opt.name);
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              className={styles.tagAutocompleteItem}
                              onClick={() => handleSelectSuggestedProjectTag(opt.name)}
                              style={{
                                opacity: isAlreadyAdded ? 0.5 : 1,
                              }}
                            >
                              {IconComp ? (
                                <IconComp size={14} style={{ color: opt.color }} />
                              ) : (
                                getTechIcon(opt.key, 14)
                              )}
                              <span>{opt.name}</span>
                              <span className={styles.tagAutocompleteCategory}>
                                {opt.category}
                              </span>
                              {isAlreadyAdded && <Check size={11} color="#10b981" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick-Add / Popular Stacks Pill Bar */}
                <div className={styles.tagQuickAddSection}>
                  <div className={styles.tagQuickAddHeading}>
                    <Sparkles size={12} style={{ color: "var(--primary-color, #4f46e5)" }} />
                    <span>Quick-Add Deployment, Cloud & Stacks:</span>
                  </div>
                  <div className={styles.tagQuickAddGrid}>
                    {POPULAR_STACK_SUGGESTIONS.map((item) => {
                      const isAdded = (projectForm.technologies || []).includes(item.name);
                      const badge = getTechBadgeData(item.key || item.name);
                      const Icon = badge.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          className={`${styles.tagQuickAddChip} ${isAdded ? styles.tagQuickAddChipActive : ""
                            }`}
                          onClick={() => handleToggleProjectTag(item.name)}
                          title={isAdded ? `Remove ${item.name}` : `Add ${item.name}`}
                        >
                          {Icon && (
                            <Icon
                              size={11}
                              className={styles.quickAddIcon}
                            />
                          )}
                          <span>{item.name}</span>
                          {isAdded ? (
                            <Check size={10} strokeWidth={3} />
                          ) : (
                            <Plus size={10} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Short project summary..."
                />
              </div>

              <div className={styles.formGrid}>
                <div>
                  <label>Demo Live URL</label>
                  <input
                    type="text"
                    value={projectForm.demoUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, demoUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                  <span style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                    Leave blank to hide Live Demo button on portfolio.
                  </span>
                </div>
                <div>
                  <label>GitHub Repository URL</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        githubUrl: e.target.value,
                      })
                    }
                    placeholder="https://github.com/..."
                  />
                  <span style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                    Leave blank to hide GitHub button on portfolio.
                  </span>
                </div>
              </div>

              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      featured: e.target.checked,
                      isMasterFeatured: e.target.checked ? projectForm.isMasterFeatured : false,
                    })
                  }
                />
                Show on Featured Projects grid
              </label>

              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={Boolean(projectForm.isMasterFeatured)}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      isMasterFeatured: e.target.checked,
                      featured: e.target.checked ? true : projectForm.featured,
                    })
                  }
                />
                <span>
                  <strong>Master Featured (Latest Works)</strong> — Pinned as #1 prioritized project in row
                </span>
              </label>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={uploadingImage || crudLoading["save-project"]}
                >
                  {crudLoading["save-project"] ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      <span>{editingProject ? "Updating..." : "Saving..."}</span>
                    </>
                  ) : uploadingImage ? (
                    "Uploading Image..."
                  ) : editingProject ? (
                    "Update Project"
                  ) : (
                    "Save Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD BANNER SKILL */}
      {/* ======================================================== */}
      {showBannerModal && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowBannerModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Add Tech Stack to Carousel & Hero</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowBannerModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBannerSkillModal} style={{ display: "grid", gap: "1rem" }}>
              <label>
                Technology / Skill Name
                <input
                  type="text"
                  required
                  placeholder="e.g. Flutter, Dart, React, Laravel"
                  value={bannerForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoKey = detectTechKey(val);
                    setBannerForm((prev) => ({
                      ...prev,
                      name: val,
                      iconKey: autoKey !== "default" ? autoKey : prev.iconKey,
                    }));
                  }}
                />
              </label>

              <div className={styles.formGrid}>
                <label>
                  Built-in Icon Identifier (Searchable)
                  <TechIconPicker
                    value={bannerForm.iconKey}
                    onChange={(selectedKey) =>
                      setBannerForm((prev) => ({ ...prev, iconKey: selectedKey }))
                    }
                    suggestedKey={detectTechKey(bannerForm.name)}
                  />
                  <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.82rem", color: "var(--primary-color, #4f46e5)" }}>
                    {getTechIcon(bannerForm.iconKey || bannerForm.name, 18)}
                    <span>Selected: <strong>{bannerForm.iconKey}</strong></span>
                  </div>
                </label>

                <label>
                  Custom Icon/Logo Image URL (Optional)
                  <input
                    type="url"
                    placeholder="https://..."
                    value={bannerForm.iconUrl}
                    onChange={(e) => setBannerForm((prev) => ({ ...prev, iconUrl: e.target.value }))}
                  />
                </label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={bannerForm.showInHero !== false}
                    onChange={(e) =>
                      setBannerForm((prev) => ({
                        ...prev,
                        showInHero: e.target.checked,
                      }))
                    }
                  />
                  <span>Display in Hero Section (Featured badge, up to 12)</span>
                </label>

                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={bannerForm.isVisible}
                    onChange={(e) =>
                      setBannerForm((prev) => ({
                        ...prev,
                        isVisible: e.target.checked,
                      }))
                    }
                  />
                  <span>Visible in infinite marquee carousel</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowBannerModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={crudLoading["save-banner"]}
                >
                  {crudLoading["save-banner"] ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      <span>Adding...</span>
                    </>
                  ) : (
                    "Add Tech Stack"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}