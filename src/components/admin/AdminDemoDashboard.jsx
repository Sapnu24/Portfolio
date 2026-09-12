import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderGit2,
  Settings,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  UserRound,
  X,
  Eye,
  Sparkles,
  Palette,
  Award,
  Briefcase,
  Globe,
  Menu,
  Star,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import styles from "@/styles/AdminDashboard.module.css";

// Generic simulated mock data (completely isolated from live database & personal records)
const INITIAL_DEMO_PROJECTS = [
  {
    id: "demo-proj-1",
    title: "CloudMetrics Enterprise Analytics",
    description: "High-throughput cloud metrics aggregation portal featuring real-time stream processing, customizable charts, and automated team alerting.",
    technologies: ["React JS", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    status: "In progress",
    duration: "6 months",
    team: "Team",
    featured: true,
    isMasterFeatured: true,
    image: "/img/projects/mainweb.png",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/demo-analytics",
    order: 3,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "demo-proj-2",
    title: "Nexus Payment & E-Commerce Gateway",
    description: "Distributed e-commerce checkout and inventory management engine handling asynchronous payment webhooks and automated order dispatch.",
    technologies: ["Laravel PHP", "PHP", "MySQL", "Redis", "Bootstrap"],
    status: "Completed",
    duration: "1 year",
    team: "Solo",
    featured: true,
    isMasterFeatured: false,
    image: "/img/projects/portfoliov1.png",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/demo-ecommerce",
    order: 2,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "demo-proj-3",
    title: "HealthPulse Telehealth Consultation Portal",
    description: "HIPAA-compliant patient booking portal with integrated WebRTC video consultations, encrypted records, and real-time appointment reminders.",
    technologies: ["JavaScript", "React JS", "CSS", "Express", "MongoDB"],
    status: "Completed",
    duration: "8 months",
    team: "Team",
    featured: true,
    isMasterFeatured: false,
    image: "/img/projects/admin.png",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/demo-telehealth",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const INITIAL_DEMO_CERTS = [
  {
    id: "demo-cert-1",
    title: "Professional Full-Stack Systems Engineer",
    issuer: "Global Web Standards Institute",
    issueDate: "Feb 2026",
    credentialUrl: "https://example.com/verify/demo-01",
    status: "Completed",
    skills: ["React JS", "JavaScript (ES6+)", "Component Architecture", "State Management", "REST APIs"],
    description: "Mastery of enterprise single-page web applications, modern reactive design patterns, and asynchronous backend integration.",
    featured: true,
  },
  {
    id: "demo-cert-2",
    title: "Enterprise Backend Architecture & Database Security",
    issuer: "Cloud & Software Engineering Academy",
    issueDate: "Jan 2026",
    credentialUrl: "https://example.com/verify/demo-02",
    status: "Completed",
    skills: ["Laravel PHP", "MySQL", "ORM", "API Security", "Middleware", "Caching"],
    description: "Advanced certification covering relational database design, query optimization, secure authentication pipelines, and distributed APIs.",
    featured: true,
  },
];

const INITIAL_DEMO_SKILLS = [
  {
    id: "demo-cat-1",
    name: "Frontend Development",
    icon: "code",
    color: "#004643",
    skills: ["React JS", "JavaScript (ES6+)", "HTML5", "CSS3 / Vanilla CSS", "Bootstrap", "Responsive Layouts"],
  },
  {
    id: "demo-cat-2",
    name: "Backend & Database",
    icon: "server",
    color: "#028090",
    skills: ["Laravel PHP", "PHP", "MySQL", "RESTful APIs", "Relational Modeling", "Authentication"],
  },
  {
    id: "demo-cat-3",
    name: "DevOps & Tools",
    icon: "laptop",
    color: "#f59e0b",
    skills: ["Git & GitHub", "Vite", "VS Code", "Postman", "CI/CD Workflows", "npm"],
  },
  {
    id: "demo-cat-4",
    name: "UI/UX & Design Systems",
    icon: "brush",
    color: "#8b5cf6",
    skills: ["Glassmorphism", "Micro-interactions", "Design Tokens", "Wireframing", "Prototyping"],
  },
];

const INITIAL_DEMO_TIMELINE = [
  {
    id: "demo-time-1",
    period: "2025 — Present",
    role: "Senior Full-Stack Web Developer",
    company: "TechNova Cloud Solutions",
    type: "Work",
    description: "Leading development of client-facing administrative dashboards, real-time analytics portals, and responsive enterprise interfaces.",
  },
  {
    id: "demo-time-2",
    period: "2023 — 2025",
    role: "Web Application Developer",
    company: "Apex Digital Labs",
    type: "Work",
    description: "Engineered scalable REST APIs, relational database schemas, and intuitive single-page applications.",
  },
  {
    id: "demo-time-3",
    period: "2019 — 2023",
    role: "B.S. in Computer Science / Information Technology",
    company: "Institute of Technology",
    type: "Education",
    description: "Specialized in Software Engineering, Web Development Architecture, Database Management, and Systems Security.",
  },
];

export default function AdminDemoDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sandbox States (100% In-Memory)
  const [projects, setProjects] = useState(INITIAL_DEMO_PROJECTS);
  const [certifications, setCertifications] = useState(INITIAL_DEMO_CERTS);
  const [skillCategories, setSkillCategories] = useState(INITIAL_DEMO_SKILLS);
  const [timeline, setTimeline] = useState(INITIAL_DEMO_TIMELINE);

  // Generic Demo Profile State (No personal contact information)
  const [profile, setProfile] = useState({
    name: "Alex Morgan (Demo Profile)",
    title: "Full-Stack Web Engineer & CMS Architect",
    bio: "Passionate developer showcasing interactive administration workflows, custom CMS components, real-time UI synchronization, and design system engineering.",
    email: "demo.developer@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA / Remote",
    github: "https://github.com/example/demo-portfolio",
    linkedin: "https://linkedin.com",
    avatar: "/img/projects/portfoliov1.png",
  });

  // Settings Demo State
  const [settings, setSettings] = useState({
    siteTitle: "Demo Portfolio | Web Application Engineer",
    themeAccent: "#004643",
    enableAnimations: true,
    enableGuestContactForm: true,
    maintenanceMode: false,
  });

  // Modals State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    status: "In progress",
    duration: "3 months",
    team: "Sean Marion Velasco (with my team)",
    technologies: ["React JS", "JavaScript", "CSS"],
    description: "",
    image: "/img/projects/portfoliov1.png",
    demoUrl: "",
    githubUrl: "https://github.com",
    featured: true,
    isMasterFeatured: false,
  });
  const [projectTagInput, setProjectTagInput] = useState("");

  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "Ground Gurus",
    issueDate: "2026",
    credentialUrl: "https://groundgurus.ph",
    status: "Completed",
    skills: ["React JS", "JavaScript"],
    description: "",
    featured: true,
  });
  const [certSkillInput, setCertSkillInput] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "code",
    color: "#004643",
    skills: [],
  });

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    period: "2026",
    role: "",
    company: "",
    type: "Work",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleResetSandbox = () => {
    if (window.confirm("Reset demo sandbox back to default initial state?")) {
      setProjects(INITIAL_DEMO_PROJECTS);
      setCertifications(INITIAL_DEMO_CERTS);
      setSkillCategories(INITIAL_DEMO_SKILLS);
      setTimeline(INITIAL_DEMO_TIMELINE);
      showToast("🔄 Demo sandbox reset to default showcase data.");
    }
  };

  // Project Actions
  const handleToggleMasterFeatured = (id) => {
    const target = projects.find((p) => p.id === id);
    const newStatus = !target?.isMasterFeatured;
    const updated = projects.map((p) => ({
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
    setProjects(updated);
    showToast(
      newStatus
        ? `🌟 [Demo] Set "${target?.title}" as Master Featured (#1 in Dev)!`
        : `[Demo] Removed Master Featured priority from "${target?.title}".`
    );
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("[Demo Sandbox] Delete this project from demo list?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("🗑️ [Demo] Project deleted from sandbox.");
    }
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...projectForm } : p))
      );
      showToast("✨ [Demo] Project updated successfully!");
    } else {
      const newProj = {
        id: `demo-proj-${Date.now()}`,
        ...projectForm,
        createdAt: new Date().toISOString(),
      };
      setProjects((prev) => [newProj, ...prev]);
      showToast("🚀 [Demo] New project added to sandbox!");
    }
    setShowProjectModal(false);
  };

  // Cert Actions
  const handleDeleteCert = (id) => {
    if (window.confirm("[Demo Sandbox] Delete this certification?")) {
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      showToast("🗑️ [Demo] Certification removed.");
    }
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (editingCert) {
      setCertifications((prev) =>
        prev.map((c) => (c.id === editingCert.id ? { ...c, ...certForm } : c))
      );
      showToast("✨ [Demo] Certification updated!");
    } else {
      const newCert = {
        id: `demo-cert-${Date.now()}`,
        ...certForm,
      };
      setCertifications((prev) => [newCert, ...prev]);
      showToast("🏆 [Demo] New certification added!");
    }
    setShowCertModal(false);
  };

  // Category Actions
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setSkillCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryForm } : c))
      );
      showToast("✨ [Demo] Skill category updated!");
    } else {
      const newCat = {
        id: `demo-cat-${Date.now()}`,
        ...categoryForm,
      };
      setSkillCategories((prev) => [...prev, newCat]);
      showToast("💡 [Demo] New skill category created!");
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("[Demo Sandbox] Delete this skill category?")) {
      setSkillCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("🗑️ [Demo] Skill category removed.");
    }
  };

  // Timeline Actions
  const handleSaveTimeline = (e) => {
    e.preventDefault();
    if (editingTimeline) {
      setTimeline((prev) =>
        prev.map((t) => (t.id === editingTimeline.id ? { ...t, ...timelineForm } : t))
      );
      showToast("✨ [Demo] Timeline entry updated!");
    } else {
      const newEntry = {
        id: `demo-time-${Date.now()}`,
        ...timelineForm,
      };
      setTimeline((prev) => [newEntry, ...prev]);
      showToast("🚀 [Demo] Timeline milestone added!");
    }
    setShowTimelineModal(false);
  };

  const handleDeleteTimeline = (id) => {
    if (window.confirm("[Demo Sandbox] Delete this roadmap milestone?")) {
      setTimeline((prev) => prev.filter((t) => t.id !== id));
      showToast("🗑️ [Demo] Timeline entry deleted.");
    }
  };

  // Filtered lists
  const filteredProjects = projects.filter((p) =>
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCerts = certifications.filter((c) =>
    (c.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.adminPage}>
      {/* Toast */}
      {toastMessage && (
        <div className={styles.toast} style={{ background: "#004643", border: "1px solid #028090" }}>
          <CheckCircle2 size={18} color="#fffffe" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className={styles.mobileBackdrop} onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.brand}>
            Portfolio CMS
          </Link>
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ShieldCheck size={18} color="#fffffe" />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fffffe" }}>
                UI/UX Live Demo
              </div>
              <div style={{ fontSize: "0.68rem", opacity: 0.85 }}>Safe Sandbox Mode</div>
            </div>
          </div>
        </div>

        <nav className={styles.sideNav}>
          <button
            type="button"
            className={activeTab === "overview" ? styles.active : ""}
            onClick={() => {
              setActiveTab("overview");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            type="button"
            className={activeTab === "hero" ? styles.active : ""}
            onClick={() => {
              setActiveTab("hero");
              setSidebarOpen(false);
            }}
          >
            <UserRound size={18} /> Profile & Hero
          </button>
          <button
            type="button"
            className={activeTab === "projects" ? styles.active : ""}
            onClick={() => {
              setActiveTab("projects");
              setSidebarOpen(false);
            }}
          >
            <FolderGit2 size={18} /> Projects ({projects.length})
          </button>
          <button
            type="button"
            className={activeTab === "certifications" ? styles.active : ""}
            onClick={() => {
              setActiveTab("certifications");
              setSidebarOpen(false);
            }}
          >
            <Award size={18} /> Certifications ({certifications.length})
          </button>
          <button
            type="button"
            className={activeTab === "skills" ? styles.active : ""}
            onClick={() => {
              setActiveTab("skills");
              setSidebarOpen(false);
            }}
          >
            <Sparkles size={18} /> Skills & Tags
          </button>
          <button
            type="button"
            className={activeTab === "timeline" ? styles.active : ""}
            onClick={() => {
              setActiveTab("timeline");
              setSidebarOpen(false);
            }}
          >
            <Briefcase size={18} /> Career Roadmap
          </button>
          <button
            type="button"
            className={activeTab === "appearance" ? styles.active : ""}
            onClick={() => {
              setActiveTab("appearance");
              setSidebarOpen(false);
            }}
          >
            <Palette size={18} /> Appearance
          </button>
          <button
            type="button"
            className={activeTab === "settings" ? styles.active : ""}
            onClick={() => {
              setActiveTab("settings");
              setSidebarOpen(false);
            }}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className={styles.sidebarFooter} style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
          <button
            type="button"
            onClick={handleResetSandbox}
            className={styles.secondaryButton}
            style={{
              width: "100%",
              marginBottom: "0.75rem",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              fontSize: "0.8rem",
            }}
          >
            <RotateCcw size={14} /> Reset Sandbox
          </button>
          <Link
            to="/"
            className={styles.logoutBtn}
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Globe size={18} /> Back to Portfolio
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={styles.mainContentWrapper}>
        {/* TOP DEMO NOTIFICATION BANNER */}
        <div
          style={{
            background: "linear-gradient(90deg, #004643, #028090)",
            color: "#fffffe",
            padding: "0.6rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.82rem",
            fontWeight: 500,
            boxShadow: "0 2px 10px rgba(0, 70, 67, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShieldCheck size={18} />
            <span>
              <strong>Live UI/UX Interactive Demo:</strong> All actions are securely isolated in your browser sandbox. Real database records are not modified.
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleResetSandbox}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                color: "#fff",
                borderRadius: "0.35rem",
                padding: "0.2rem 0.6rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Reset Data
            </button>
            <Link
              to="/admin"
              style={{
                color: "#abd1c6",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              Go to Admin Login →
            </Link>
          </div>
        </div>

        {/* TOPBAR */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.mobileMenuToggle}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className={styles.searchBox}>
              <input
                type="search"
                placeholder="Search demo records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.topbarRight}>
            <span
              style={{
                background: "rgba(0, 70, 67, 0.08)",
                color: "var(--primary-color, #004643)",
                border: "1px solid rgba(0, 70, 67, 0.2)",
                padding: "0.3rem 0.8rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              🟢 Sandbox Active
            </span>
            <Link to="/" target="_blank" className={styles.visitSiteBtn}>
              <Eye size={16} /> Preview Site
            </Link>
          </div>
        </header>

        {/* MAIN BODY PANELS */}
        <main className={styles.contentBody}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: "rgba(0, 70, 67, 0.12)", color: "#004643" }}>
                    <FolderGit2 size={24} />
                  </div>
                  <div>
                    <span className={styles.statLabel}>Featured Projects</span>
                    <strong className={styles.statValue}>{projects.length}</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: "rgba(2, 128, 144, 0.12)", color: "#028090" }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <span className={styles.statLabel}>Certifications</span>
                    <strong className={styles.statValue}>{certifications.length}</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <span className={styles.statLabel}>Skill Categories</span>
                    <strong className={styles.statValue}>{skillCategories.length}</strong>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span className={styles.statLabel}>Simulated Visitors</span>
                    <strong className={styles.statValue}>1,420</strong>
                  </div>
                </div>
              </div>

              {/* Master Featured Spotlight */}
              {projects.find((p) => p.isMasterFeatured) && (
                <div
                  className={styles.panel}
                  style={{
                    border: "2px solid #004643",
                    background: "linear-gradient(135deg, rgba(0, 70, 67, 0.04), rgba(2, 128, 144, 0.08))",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          background: "#004643",
                          color: "#fff",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                        }}
                      >
                        <Star size={12} fill="#fff" /> Master Featured (#1 Priority in Dev)
                      </span>
                      <h3 style={{ margin: "0 0 0.4rem 0", color: "#004643", fontSize: "1.2rem" }}>
                        {projects.find((p) => p.isMasterFeatured)?.title}
                      </h3>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                        {projects.find((p) => p.isMasterFeatured)?.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setActiveTab("projects")}
                    >
                      Manage in Projects →
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions Panel */}
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Quick Management Actions</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    style={{ justifyContent: "center" }}
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        title: "",
                        status: "In progress",
                        duration: "",
                        team: "Sean Marion Velasco (with my team)",
                        technologies: ["React JS"],
                        description: "",
                        image: "/img/projects/portfoliov1.png",
                        demoUrl: "",
                        githubUrl: "https://github.com",
                        featured: true,
                        isMasterFeatured: false,
                      });
                      setShowProjectModal(true);
                    }}
                  >
                    <Plus size={18} /> New Project
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    style={{ justifyContent: "center" }}
                    onClick={() => {
                      setEditingCert(null);
                      setCertForm({
                        title: "",
                        issuer: "Ground Gurus",
                        issueDate: "2026",
                        credentialUrl: "",
                        status: "Completed",
                        skills: ["React JS"],
                        description: "",
                        featured: true,
                      });
                      setShowCertModal(true);
                    }}
                  >
                    <Plus size={18} /> New Certification
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    style={{ justifyContent: "center" }}
                    onClick={() => {
                      setEditingTimeline(null);
                      setTimelineForm({
                        period: "2026",
                        role: "",
                        company: "",
                        type: "Work",
                        description: "",
                      });
                      setShowTimelineModal(true);
                    }}
                  >
                    <Plus size={18} /> New Career Milestone
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: PROFILE & HERO */}
          {activeTab === "hero" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Hero & Profile Manager</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Configure the hero introduction, contact links, and real-time developer identity.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => showToast("✨ [Demo] Profile saved to sandbox!")}
                >
                  Save Profile
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); showToast("✨ [Demo] Profile saved to sandbox!"); }} style={{ display: "grid", gap: "1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <label>
                    Full Name
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </label>
                  <label>
                    Professional Headline / Role
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </label>
                </div>

                <label>
                  Bio / Summary
                  <textarea
                    rows="3"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <label>
                    Email Address
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </label>
                  <label>
                    Location
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </label>
                  <label>
                    GitHub URL
                    <input
                      type="text"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    />
                  </label>
                </div>
              </form>
            </section>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Projects Manager ({filteredProjects.length})</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Manage showcased projects, pin Master Featured project, and customize tech tags.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: "",
                      status: "In progress",
                      duration: "",
                      team: "Solo",
                      technologies: [],
                      description: "",
                      image: "/img/projects/portfoliov1.png",
                      demoUrl: "",
                      githubUrl: "https://github.com",
                      featured: true,
                      isMasterFeatured: false,
                    });
                    setShowProjectModal(true);
                  }}
                >
                  <Plus size={18} /> New Project
                </button>
              </div>

              <div className={styles.projectTable}>
                <div className={styles.tableHeader}>
                  <span>Project</span>
                  <span>Status</span>
                  <span>Duration</span>
                  <span>Tech Stack</span>
                  <span />
                </div>
                {filteredProjects.map((p) => (
                  <div key={p.id} className={styles.tableRow}>
                    <span>
                      <strong>{p.title}</strong>
                      {p.isMasterFeatured && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            background: "linear-gradient(135deg, #004643, #028090)",
                            color: "#ffffff",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.5rem",
                            borderRadius: "9999px",
                            marginTop: "0.25rem",
                            boxShadow: "0 2px 6px rgba(0, 70, 67, 0.25)",
                          }}
                        >
                          Master Featured (#1 in Dev)
                        </span>
                      )}
                      {p.featured && !p.isMasterFeatured && (
                        <small style={{ display: "block", color: "var(--accent-color, #4f46e5)", fontWeight: 600 }}>
                          ★ Featured
                        </small>
                      )}
                    </span>
                    <span>{p.status}</span>
                    <span>{p.duration}</span>
                    <span>
                      {Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}
                    </span>
                    <span className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        style={{
                          color: p.isMasterFeatured ? "#f59e0b" : "#64748b",
                          background: p.isMasterFeatured ? "#fef3c7" : "transparent",
                          border: p.isMasterFeatured ? "1px solid #fde68a" : "1px solid #e2e8f0",
                        }}
                        title={p.isMasterFeatured ? "Master Featured - Click to unpin" : "Pin as Master Featured (#1)"}
                        onClick={() => handleToggleMasterFeatured(p.id)}
                      >
                        <Star size={16} fill={p.isMasterFeatured ? "#f59e0b" : "none"} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconButton}
                        title="Edit project"
                        onClick={() => {
                          setEditingProject(p);
                          setProjectForm({ ...p });
                          setShowProjectModal(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteBtn}`}
                        title="Delete project"
                        onClick={() => handleDeleteProject(p.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Certifications Manager ({filteredCerts.length})</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Showcase verified credentials, diplomas, course completions, and skills earned.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingCert(null);
                    setCertForm({
                      title: "",
                      issuer: "Ground Gurus",
                      issueDate: "2026",
                      credentialUrl: "",
                      status: "Completed",
                      skills: [],
                      description: "",
                      featured: true,
                    });
                    setShowCertModal(true);
                  }}
                >
                  <Plus size={18} /> New Certification
                </button>
              </div>

              <div className={styles.projectTable}>
                <div className={styles.tableHeader}>
                  <span>Certification Title</span>
                  <span>Issuer</span>
                  <span>Issued</span>
                  <span>Skills Covered</span>
                  <span />
                </div>
                {filteredCerts.map((c) => (
                  <div key={c.id} className={styles.tableRow}>
                    <span>
                      <strong>{c.title}</strong>
                      {c.featured && (
                        <small style={{ display: "block", color: "var(--accent-color, #4f46e5)", fontWeight: 600 }}>
                          ★ Featured
                        </small>
                      )}
                    </span>
                    <span>{c.issuer}</span>
                    <span>{c.issueDate}</span>
                    <span>{Array.isArray(c.skills) ? c.skills.join(", ") : c.skills}</span>
                    <span className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        title="Edit certification"
                        onClick={() => {
                          setEditingCert(c);
                          setCertForm({ ...c });
                          setShowCertModal(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteBtn}`}
                        title="Delete certification"
                        onClick={() => handleDeleteCert(c.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: SKILLS & TAGS */}
          {activeTab === "skills" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Skills & Categories ({skillCategories.length})</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Organize technical skill categories, color accents, and interactive badges.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "", icon: "code", color: "#004643", skills: [] });
                    setShowCategoryModal(true);
                  }}
                >
                  <Plus size={18} /> Add Category
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
                {skillCategories.map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${cat.color}33`,
                      borderLeft: `4px solid ${cat.color}`,
                      borderRadius: "0.75rem",
                      padding: "1.25rem",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", color: cat.color, fontWeight: 700 }}>
                        {cat.name}
                      </h3>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({ ...cat });
                            setShowCategoryModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {cat.skills.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            background: `${cat.color}14`,
                            color: cat.color,
                            border: `1px solid ${cat.color}33`,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 6: CAREER ROADMAP / TIMELINE */}
          {activeTab === "timeline" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Career Roadmap & Milestones ({timeline.length})</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Manage professional milestones, work experience, and educational background.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => {
                    setEditingTimeline(null);
                    setTimelineForm({
                      period: "2026",
                      role: "",
                      company: "",
                      type: "Work",
                      description: "",
                    });
                    setShowTimelineModal(true);
                  }}
                >
                  <Plus size={18} /> New Milestone
                </button>
              </div>

              <div style={{ display: "grid", gap: "1rem" }}>
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.75rem",
                      padding: "1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span
                          style={{
                            background: item.type === "Work" ? "rgba(0, 70, 67, 0.1)" : "rgba(2, 128, 144, 0.1)",
                            color: item.type === "Work" ? "#004643" : "#028090",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.5rem",
                            borderRadius: "9999px",
                          }}
                        >
                          {item.type}
                        </span>
                        <strong style={{ color: "#004643", fontSize: "1.05rem" }}>{item.role}</strong>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                        {item.company} • <span style={{ color: "#64748b", fontWeight: 400 }}>{item.period}</span>
                      </div>
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                        {item.description}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() => {
                          setEditingTimeline(item);
                          setTimelineForm({ ...item });
                          setShowTimelineModal(true);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteTimeline(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 7: APPEARANCE */}
          {activeTab === "appearance" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Visual Identity & Theme</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Configure site palette accents, micro-animations, and visual polish.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => showToast("🎨 [Demo] Appearance settings applied!")}
                >
                  Save Theme
                </button>
              </div>

              <div style={{ display: "grid", gap: "1.25rem", maxWidth: "600px" }}>
                <label>
                  Primary Brand Theme Accent
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.3rem" }}>
                    <input
                      type="color"
                      value={settings.themeAccent}
                      onChange={(e) => setSettings({ ...settings, themeAccent: e.target.value })}
                      style={{ width: "50px", height: "42px", padding: "0.2rem", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={settings.themeAccent}
                      onChange={(e) => setSettings({ ...settings, themeAccent: e.target.value })}
                    />
                  </div>
                </label>

                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={settings.enableAnimations}
                    onChange={(e) => setSettings({ ...settings, enableAnimations: e.target.checked })}
                  />
                  <span>Enable smooth 3D Vanta background and micro-interactions</span>
                </label>
              </div>
            </section>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === "settings" && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Site Settings & SEO</h2>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Global configuration, meta tags, and visitor contact accessibility.
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => showToast("⚙️ [Demo] Global settings saved!")}
                >
                  Save Settings
                </button>
              </div>

              <div style={{ display: "grid", gap: "1.25rem", maxWidth: "650px" }}>
                <label>
                  Site Meta Title
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  />
                </label>

                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={settings.enableGuestContactForm}
                    onChange={(e) => setSettings({ ...settings, enableGuestContactForm: e.target.checked })}
                  />
                  <span>Allow guest direct messages through Contact Form</span>
                </label>

                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  />
                  <span>Maintenance Mode (Show placeholder splash for public visitors)</span>
                </label>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* DEMO MODAL 1: ADD / EDIT PROJECT */}
      {/* ======================================================== */}
      {showProjectModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowProjectModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary-color, #004643)" }}>
                {editingProject ? "Edit Project (Sandbox)" : "New Project (Sandbox)"}
              </h3>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Angeles City Vet Web Portal"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Deployment">Deployment</option>
                    <option value="In progress">In progress</option>
                  </select>
                </div>
                <div>
                  <label>Team Scope</label>
                  <select
                    value={projectForm.team}
                    onChange={(e) => setProjectForm({ ...projectForm, team: e.target.value })}
                  >
                    <option value="Solo">Solo</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Duration</label>
                  <input
                    type="text"
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                    placeholder="e.g. 6 months"
                  />
                </div>
                <div>
                  <label>Project Image Path</label>
                  <input
                    type="text"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    placeholder="/img/projects/portfoliov1.png"
                  />
                </div>
              </div>

              {/* Technologies Tag Input */}
              <div>
                <label>Tech Stack Tags</label>
                <div className={styles.tagContainer}>
                  {(Array.isArray(projectForm.technologies) ? projectForm.technologies : []).map((t, idx) => (
                    <span key={idx} className={styles.tagPill}>
                      {t}
                      <button
                        type="button"
                        className={styles.tagRemoveBtn}
                        onClick={() =>
                          setProjectForm({
                            ...projectForm,
                            technologies: projectForm.technologies.filter((_, i) => i !== idx),
                          })
                        }
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="+ Add tag (Press Enter)"
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
                </div>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Short project summary..."
                />
              </div>

              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                />
                <span>Show on Featured Projects grid</span>
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingProject ? "Update Project (Sandbox)" : "Save Project (Sandbox)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEMO MODAL 2: ADD / EDIT CERTIFICATION */}
      {/* ======================================================== */}
      {showCertModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCertModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary-color, #004643)" }}>
                {editingCert ? "Edit Certification (Sandbox)" : "New Certification (Sandbox)"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCert} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label>Certification Title</label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. React JS: Building Modern Web Applications"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label>Issuing Organization</label>
                  <input
                    type="text"
                    required
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. Ground Gurus"
                  />
                </div>
                <div>
                  <label>Issue Date / Period</label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="e.g. Feb 2026"
                  />
                </div>
              </div>

              <div>
                <label>Verification Link / Credential URL</label>
                <input
                  type="text"
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label>Skills / Competencies Tags</label>
                <div className={styles.tagContainer}>
                  {(Array.isArray(certForm.skills) ? certForm.skills : []).map((s, idx) => (
                    <span key={idx} className={styles.tagPill}>
                      {s}
                      <button
                        type="button"
                        className={styles.tagRemoveBtn}
                        onClick={() =>
                          setCertForm({
                            ...certForm,
                            skills: certForm.skills.filter((_, i) => i !== idx),
                          })
                        }
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="+ Add skill (Press Enter)"
                    className={styles.tagInputField}
                    value={certSkillInput}
                    onChange={(e) => setCertSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const skill = certSkillInput.trim();
                        if (skill && !certForm.skills.includes(skill)) {
                          setCertForm({
                            ...certForm,
                            skills: [...certForm.skills, skill],
                          });
                          setCertSkillInput("");
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  rows="3"
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  placeholder="Summary of skills and competencies covered..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowCertModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingCert ? "Update Certification" : "Save Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEMO MODAL 3: ADD / EDIT SKILL CATEGORY */}
      {/* ======================================================== */}
      {showCategoryModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowCategoryModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary-color, #004643)" }}>
                {editingCategory ? "Edit Skill Category" : "New Skill Category"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label>Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Cloud & DevOps"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label>
                  Category Icon
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  >
                    <option value="code">Code (FaCode)</option>
                    <option value="server">Server (FaServer)</option>
                    <option value="laptop">Laptop (FaLaptopCode)</option>
                    <option value="brush">Design (FaPaintBrush)</option>
                  </select>
                </label>
                <label>
                  Glow Accent Color
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    style={{ height: "42px", padding: "0.2rem" }}
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEMO MODAL 4: ADD / EDIT TIMELINE MILESTONE */}
      {/* ======================================================== */}
      {showTimelineModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowTimelineModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary-color, #004643)" }}>
                {editingTimeline ? "Edit Milestone" : "New Career Milestone"}
              </h3>
              <button
                type="button"
                onClick={() => setShowTimelineModal(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTimeline} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label>
                  Role / Title
                  <input
                    type="text"
                    required
                    value={timelineForm.role}
                    onChange={(e) => setTimelineForm({ ...timelineForm, role: e.target.value })}
                    placeholder="e.g. Full-Stack Developer"
                  />
                </label>
                <label>
                  Company / Institution
                  <input
                    type="text"
                    required
                    value={timelineForm.company}
                    onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })}
                    placeholder="e.g. Freelance / Tech Co."
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label>
                  Period / Year
                  <input
                    type="text"
                    required
                    value={timelineForm.period}
                    onChange={(e) => setTimelineForm({ ...timelineForm, period: e.target.value })}
                    placeholder="e.g. 2026 — Present"
                  />
                </label>
                <label>
                  Milestone Type
                  <select
                    value={timelineForm.type}
                    onChange={(e) => setTimelineForm({ ...timelineForm, type: e.target.value })}
                  >
                    <option value="Work">Work / Employment</option>
                    <option value="Education">Education</option>
                  </select>
                </label>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  rows="3"
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  placeholder="Key responsibilities and achievements..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowTimelineModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
