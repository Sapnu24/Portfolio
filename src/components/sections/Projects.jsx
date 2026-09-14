import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Projects.module.css";
import { FaUsers, FaUser, FaGithub, FaCheckCircle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import {
  Sparkles,
  Maximize2,
  X,
  Layers,
  Globe,
  Server,
  Laptop,
  Smartphone,
  FolderKanban,
  RotateCcw,
} from "lucide-react";
import {
  getProjects,
  getCachedProjects,
  sortProjects,
  inferProjectCategory,
  formatExternalUrl,
} from "@/services/projectServices";
import { getTechBadgeData } from "@/utils/techIcons";

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 15,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

function getCategoryIcon(category, size = 14) {
  const lower = (category || "").toLowerCase();
  if (lower === "all") return <Layers size={size} className={styles.filterIcon} />;
  if (lower.includes("site") || lower.includes("portal"))
    return <Globe size={size} className={styles.filterIcon} />;
  if (
    lower.includes("system") ||
    lower.includes("server") ||
    lower.includes("backend") ||
    lower.includes("dms")
  )
    return <Server size={size} className={styles.filterIcon} />;
  if (lower.includes("app") || lower.includes("application"))
    return <Laptop size={size} className={styles.filterIcon} />;
  if (lower.includes("mobile") || lower.includes("ios") || lower.includes("android"))
    return <Smartphone size={size} className={styles.filterIcon} />;
  return <FolderKanban size={size} className={styles.filterIcon} />;
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState(getCachedProjects);
  const [activePopover, setActivePopover] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const data = await getProjects();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProjects((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(data)) {
              return prev;
            }
            return data;
          });
        }
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Auto-dismiss popover after 3.5s or on outside click
  useEffect(() => {
    if (!activePopover) return;
    const timer = setTimeout(() => {
      setActivePopover(null);
    }, 3500);

    const handleDocClick = () => setActivePopover(null);
    window.addEventListener("click", handleDocClick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleDocClick);
    };
  }, [activePopover]);

  const sortedProjects = useMemo(() => sortProjects(projects), [projects]);

  // Display only projects marked as Featured (or Master Featured) and not hidden
  const displayedProjects = useMemo(() => {
    return sortedProjects.filter(
      (p) =>
        (p.featured === true ||
          p.featured === "true" ||
          p.featured === 1 ||
          p.isMasterFeatured === true ||
          p.isMasterFeatured === "true") &&
        p.isVisible !== false
    );
  }, [sortedProjects]);

  // Compute category list and item counts dynamically
  const categoryTabs = useMemo(() => {
    const counts = { All: displayedProjects.length };
    const categoriesSet = new Set();

    displayedProjects.forEach((p) => {
      const cat = inferProjectCategory(p);
      categoriesSet.add(cat);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const ordered = ["All"];
    if (categoriesSet.has("Websites")) ordered.push("Websites");
    if (categoriesSet.has("Systems")) ordered.push("Systems");
    categoriesSet.forEach((cat) => {
      if (!ordered.includes(cat)) {
        ordered.push(cat);
      }
    });

    return ordered.map((cat) => ({
      id: cat,
      label: cat,
      count: counts[cat] || 0,
    }));
  }, [displayedProjects]);

  // Filtered projects according to selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return displayedProjects;
    return displayedProjects.filter((p) => {
      const cat = inferProjectCategory(p);
      return cat.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [displayedProjects, selectedCategory]);

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        {/* Section Header with Scroll Reveal */}
        <motion.div
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className={styles.eyebrowBadge}>
            <Sparkles size={14} />
            <span>Featured Work & Projects</span>
          </div>
          <h2 className={styles.title}>
            Featured <span className={styles.titleGradient}>Projects & Work</span>
          </h2>
          <p className={styles.subtitle}>
            A curated portfolio of production-grade web applications and systems engineered, developed, and delivered by Sean Marion Velasco.
          </p>

          {/* Category Filter Tabs */}
          {categoryTabs.length > 1 && (
            <div className={styles.filterWrapper}>
              <div
                className={styles.filterTrack}
                role="tablist"
                aria-label="Filter projects by category"
              >
                {categoryTabs.map((tab) => {
                  const isActive = selectedCategory.toLowerCase() === tab.id.toLowerCase();
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                      onClick={() => setSelectedCategory(tab.id)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryHighlight"
                          className={styles.activeBackground}
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      {getCategoryIcon(tab.id, 14)}
                      <span>{tab.label}</span>
                      <span className={styles.filterCount}>{tab.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* 2-Column Projects Grid with Staggered Scroll Animation */}
        <motion.div
          className={styles.projectsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const isMaster =
                  project.isMasterFeatured === true || project.isMasterFeatured === "true";
                const projectCategory = inferProjectCategory(project);

                return (
                  <motion.div
                    key={project.id || project.title}
                    className={`${styles.projectCard} ${isMaster ? styles.masterCard : ""}`}
                    variants={cardVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                  >
                    {/* Master Featured Badge */}
                    {isMaster && (
                      <div className={styles.masterBadgeWrapper}>
                        <span className={styles.masterBadge}>
                          <span className={styles.masterPulseDot} />
                          Latest Works
                        </span>
                      </div>
                    )}

                    {/* Project Image Frame with Zoom Overlay */}
                    <div className={styles.projectImageContainer}>
                      <button
                        type="button"
                        className={styles.projectImageButton}
                        onClick={() => setSelectedProject(project)}
                        aria-label={`View ${project.title} screenshot`}
                        title="Click to zoom image"
                      >
                        <img
                          src={project.image || "/img/projects/project-generic-thumbnail.jpg"}
                          alt={project.title}
                          className={styles.projectImage}
                          loading="eager"
                          decoding="async"
                          onError={(e) => {
                            if (!e.target.src.endsWith("/img/projects/project-generic-thumbnail.jpg")) {
                              e.target.src = "/img/projects/project-generic-thumbnail.jpg";
                            }
                          }}
                        />

                        <div className={styles.imageOverlay}>
                          <Maximize2 size={20} className={styles.zoomIcon} />
                          <span>Click to preview</span>
                        </div>
                      </button>
                    </div>

                    {/* Project Content */}
                    <div className={styles.projectContent}>
                      <div className={styles.projectHeader}>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <span
                          className={`${styles.statusBadge} ${project.status === "Completed"
                              ? styles.statusCompleted
                              : project.status === "Deployment"
                                ? styles.statusDeployment
                                : styles.statusProgress
                            }`}
                        >
                          {project.status === "Completed" && <FaCheckCircle size={10} />}
                          {project.status || "In Progress"}
                        </span>
                      </div>

                      <p className={styles.projectDescription}>{project.description}</p>

                      {/* Technology Tags with Auto-Mapped Branding & Icons */}
                      <div className={styles.projectTags}>
                        {(Array.isArray(project.technologies) ? project.technologies : []).map(
                          (tech, index) => {
                            const badge = getTechBadgeData(tech);
                            const IconComponent = badge.icon;
                            return (
                              <span
                                key={index}
                                className={styles.tag}
                                title={`${tech} (${badge.name})`}
                              >
                                {IconComponent && (
                                  <IconComponent
                                    size={12}
                                    className={styles.tagIcon}
                                  />
                                )}
                                <span>{tech}</span>
                              </span>
                            );
                          }
                        )}
                      </div>

                      {/* Meta Stats: Category Badge & Team */}
                      <div className={styles.projectMeta}>
                        <span
                          className={styles.categoryBadge}
                          title={`Category: ${projectCategory}`}
                        >
                          {getCategoryIcon(projectCategory, 12)}
                          <span>{projectCategory}</span>
                        </span>

                        <div className={styles.metaItem}>
                          {project.team === "Team" ? (
                            <FaUsers size={14} className={styles.metaIcon} />
                          ) : (
                            <FaUser size={13} className={styles.metaIcon} />
                          )}
                          <span>{project.team || "Solo"}</span>
                        </div>
                      </div>

                      {/* Action Buttons (Strict Equal Length 50/50 Pair) */}
                      <div className={styles.projectLinks}>
                        {(() => {
                          const demoUrl = formatExternalUrl(
                            project.demoUrl || project.demoLink || project.liveUrl || project.link
                          );
                          const githubUrl = formatExternalUrl(
                            project.githubUrl || project.githubLink || project.repoUrl
                          );

                          return (
                            <>
                              {/* Live Demo Button (Hero & Navbar Primary Gradient Pill) */}
                              {demoUrl ? (
                                <a
                                  href={demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${styles.cardBtn} ${styles.primaryDemoBtn}`}
                                >
                                  <span>Live Demo</span>
                                  <FiExternalLink size={15} className={styles.btnArrow} />
                                </a>
                              ) : (
                                <div className={styles.popoverWrapper}>
                                  <button
                                    type="button"
                                    className={`${styles.cardBtn} ${styles.primaryDemoBtn}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActivePopover((prev) =>
                                        prev?.id === `${project.id}-demo`
                                          ? null
                                          : {
                                            id: `${project.id}-demo`,
                                            title: "Live Demo Unavailable",
                                            text: "Live demo is not available yet for this project (in development / internal system).",
                                          }
                                      );
                                    }}
                                    title="Live Demo not available yet — Click for info"
                                  >
                                    <span>Live Demo</span>
                                    <FiExternalLink size={15} className={styles.btnArrow} />
                                  </button>
                                  <AnimatePresence>
                                    {activePopover?.id === `${project.id}-demo` && (
                                      <motion.div
                                        className={styles.inlinePopover}
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className={styles.popoverArrow} />
                                        <div className={styles.popoverHeaderRow}>
                                          <span className={styles.popoverDot} />
                                          <strong>{activePopover.title}</strong>
                                          <button
                                            type="button"
                                            className={styles.popoverMiniClose}
                                            onClick={() => setActivePopover(null)}
                                            aria-label="Close"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                        <p className={styles.popoverText}>{activePopover.text}</p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}

                              {/* GitHub Button (Equal Length Secondary Pill) */}
                              {githubUrl ? (
                                <a
                                  href={githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${styles.cardBtn} ${styles.secondaryGithubBtn}`}
                                  title="View GitHub Repository"
                                  aria-label={`${project.title} GitHub Repository`}
                                >
                                  <FaGithub size={16} />
                                  <span>Code</span>
                                </a>
                              ) : (
                                <div className={styles.popoverWrapper}>
                                  <button
                                    type="button"
                                    className={`${styles.cardBtn} ${styles.secondaryGithubBtn}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActivePopover((prev) =>
                                        prev?.id === `${project.id}-github`
                                          ? null
                                          : {
                                            id: `${project.id}-github`,
                                            title: "Private Repository",
                                            text: "Source code is confidential or under client NDA. Available upon request.",
                                          }
                                      );
                                    }}
                                    title="Private repository — Click for info"
                                    aria-label={`${project.title} Private Codebase`}
                                  >
                                    <FaGithub size={16} />
                                    <span>Code</span>
                                  </button>
                                  <AnimatePresence>
                                    {activePopover?.id === `${project.id}-github` && (
                                      <motion.div
                                        className={`${styles.inlinePopover} ${styles.inlinePopoverRight}`}
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className={`${styles.popoverArrow} ${styles.popoverArrowRight}`} />
                                        <div className={styles.popoverHeaderRow}>
                                          <span className={`${styles.popoverDot} ${styles.popoverDotYellow}`} />
                                          <strong>{activePopover.title}</strong>
                                          <button
                                            type="button"
                                            className={styles.popoverMiniClose}
                                            onClick={() => setActivePopover(null)}
                                            aria-label="Close"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                        <p className={styles.popoverText}>{activePopover.text}</p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                key="empty-state"
                className={styles.emptyState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={styles.emptyIconWrapper}>
                  <FolderKanban size={26} />
                </div>
                <h3 className={styles.emptyTitle}>No Projects in &ldquo;{selectedCategory}&rdquo;</h3>
                <p className={styles.emptyDesc}>
                  There are currently no featured projects listed under this category.
                </p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => setSelectedCategory("All")}
                >
                  <RotateCcw size={14} />
                  <span>Show All Projects</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* macOS-Style Window Lightbox Preview (Desktop Only) */}
      {selectedProject && (
        <div
          className={styles.imageViewer}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} image preview`}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className={styles.imageViewerContent}
            onClick={(event) => event.stopPropagation()}
          >
            {/* macOS Window Top Header Bar */}
            <div className={styles.imageViewerHeader}>
              <div className={styles.headerLeft}>
                <span className={styles.windowDots}>
                  <span className={`${styles.windowDot} ${styles.dotRed}`} />
                  <span className={`${styles.windowDot} ${styles.dotYellow}`} />
                  <span className={`${styles.windowDot} ${styles.dotGreen}`} />
                </span>
                <div className={styles.headerTitleGroup}>
                  <h4 className={styles.imageViewerTitle}>{selectedProject.title}</h4>
                  <span className={styles.headerSubtitle}>Desktop Preview</span>
                </div>
              </div>

              {/* Polished Glass Close Button */}
              <button
                type="button"
                className={styles.imageViewerCloseBtn}
                onClick={() => setSelectedProject(null)}
                aria-label="Close image preview"
                title="Close (Esc)"
              >
                <span className={styles.closeBtnText}>Close</span>
                <kbd className={styles.escBadge}>ESC</kbd>
                <X size={16} className={styles.closeIcon} />
              </button>
            </div>

            {/* Modal Image Display Stage */}
            <div className={styles.imageViewerBody}>
              <div className={styles.desktopImageWrapper}>
                <img
                  src={selectedProject.image || "/img/projects/project-generic-thumbnail.jpg"}
                  alt={`${selectedProject.title} Desktop View`}
                  className={styles.imageViewerImage}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    if (!e.target.src.endsWith("/img/projects/project-generic-thumbnail.jpg")) {
                      e.target.src = "/img/projects/project-generic-thumbnail.jpg";
                    }
                  }}
                />
              </div>
            </div>

            {/* Modal Footer Bar */}
            <div className={styles.imageViewerFooter}>
              <div className={styles.footerLeft}>
                <p className={styles.imageViewerDesc}>{selectedProject.description}</p>
              </div>
              <div className={styles.footerRight}>
                {(() => {
                  const modalDemoUrl = formatExternalUrl(
                    selectedProject.demoUrl || selectedProject.demoLink || selectedProject.liveUrl || selectedProject.link
                  );
                  const modalGithubUrl = formatExternalUrl(
                    selectedProject.githubUrl || selectedProject.githubLink || selectedProject.repoUrl
                  );

                  return (
                    <>
                      {modalDemoUrl ? (
                        <a
                          href={modalDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.modalActionBtn} ${styles.modalPrimaryBtn}`}
                        >
                          <span>Open Live Demo</span>
                          <FiExternalLink size={15} className={styles.btnArrow} />
                        </a>
                      ) : (
                        <div className={styles.modalPopoverWrapper}>
                          <button
                            type="button"
                            className={`${styles.modalActionBtn} ${styles.modalPrimaryBtn} ${styles.btnUnavailable}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActivePopover((prev) =>
                                prev?.id === `modal-${selectedProject.id}-demo`
                                  ? null
                                  : {
                                    id: `modal-${selectedProject.id}-demo`,
                                    title: "Live Demo Unavailable",
                                    text: "Live demo not yet available for this project (in development / internal system).",
                                  }
                              );
                            }}
                          >
                            <span>Live Demo</span>
                            <FiExternalLink size={15} className={styles.btnArrow} />
                          </button>
                          <AnimatePresence>
                            {activePopover?.id === `modal-${selectedProject.id}-demo` && (
                              <motion.div
                                className={`${styles.inlinePopover} ${styles.modalInlinePopover}`}
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                transition={{ duration: 0.16, ease: "easeOut" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className={`${styles.popoverArrow} ${styles.popoverArrowBottom}`} />
                                <div className={styles.popoverHeaderRow}>
                                  <span className={styles.popoverDot} />
                                  <strong>{activePopover.title}</strong>
                                  <button
                                    type="button"
                                    className={styles.popoverMiniClose}
                                    onClick={() => setActivePopover(null)}
                                    aria-label="Close"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <p className={styles.popoverText}>{activePopover.text}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {modalGithubUrl ? (
                        <a
                          href={modalGithubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.modalActionBtn} ${styles.modalSecondaryBtn}`}
                          style={{ marginLeft: "0.6rem" }}
                        >
                          <FaGithub size={15} />
                          <span>View GitHub</span>
                        </a>
                      ) : (
                        <div className={styles.modalPopoverWrapper} style={{ marginLeft: "0.6rem" }}>
                          <button
                            type="button"
                            className={`${styles.modalActionBtn} ${styles.modalSecondaryBtn} ${styles.btnUnavailableSecondary}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActivePopover((prev) =>
                                prev?.id === `modal-${selectedProject.id}-github`
                                  ? null
                                  : {
                                    id: `modal-${selectedProject.id}-github`,
                                    title: "Private Repository",
                                    text: "Source code is confidential or under client NDA. Available upon request.",
                                  }
                              );
                            }}
                          >
                            <FaGithub size={15} />
                            <span>GitHub</span>
                          </button>
                          <AnimatePresence>
                            {activePopover?.id === `modal-${selectedProject.id}-github` && (
                              <motion.div
                                className={`${styles.inlinePopover} ${styles.modalInlinePopover} ${styles.inlinePopoverRight}`}
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                transition={{ duration: 0.16, ease: "easeOut" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className={`${styles.popoverArrow} ${styles.popoverArrowRight} ${styles.popoverArrowBottom}`} />
                                <div className={styles.popoverHeaderRow}>
                                  <span className={`${styles.popoverDot} ${styles.popoverDotYellow}`} />
                                  <strong>{activePopover.title}</strong>
                                  <button
                                    type="button"
                                    className={styles.popoverMiniClose}
                                    onClick={() => setActivePopover(null)}
                                    aria-label="Close"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <p className={styles.popoverText}>{activePopover.text}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
