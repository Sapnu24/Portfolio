import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Projects.module.css";
import { FaClock, FaUsers, FaUser, FaGithub, FaCheckCircle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Sparkles, Maximize2, X } from "lucide-react";
import { getProjects, getCachedProjects, sortProjects } from "@/services/projectServices";
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
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(getCachedProjects);

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
        </motion.div>

        {/* 2-Column Projects Grid with Staggered Scroll Animation */}
        <motion.div
          className={styles.projectsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {displayedProjects.map((project) => {
            const isMaster = project.isMasterFeatured === true || project.isMasterFeatured === "true";

            return (
              <motion.div
                key={project.id || project.title}
                className={`${styles.projectCard} ${isMaster ? styles.masterCard : ""}`}
                variants={cardVariants}
                layout
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
                      src={project.image || "/img/projects/portfoliov1.png"}
                      alt={project.title}
                      className={styles.projectImage}
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        if (project.id === "kam-maalam-website" && e.target.src !== "/img/projects/KMUwebsite.png") {
                          e.target.src = "/img/projects/KMUwebsite.png";
                        } else if (project.id === "portfolio-website" && e.target.src !== "/img/projects/portfoliov1.png") {
                          e.target.src = "/img/projects/portfoliov1.png";
                        } else if (project.id === "acv-adoption" && e.target.src !== "/img/projects/acv.png") {
                          e.target.src = "/img/projects/acv.png";
                        } else if (!e.target.src.endsWith("/img/projects/portfoliov1.png")) {
                          e.target.src = "/img/projects/portfoliov1.png";
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
                            style={{
                              "--tech-color": badge.color,
                              color: badge.color,
                              backgroundColor: `${badge.color}15`,
                              borderColor: `${badge.color}35`,
                            }}
                            title={`${tech} (${badge.name})`}
                          >
                            {IconComponent && (
                              <IconComponent size={12} className={styles.tagIcon} style={{ color: badge.color }} />
                            )}
                            <span>{tech}</span>
                          </span>
                        );
                      }
                    )}
                  </div>

                  {/* Meta Stats: Duration & Team */}
                  <div className={styles.projectMeta}>
                    <div className={styles.metaItem}>
                      <FaClock size={13} className={styles.metaIcon} />
                      <span>{project.duration || "N/A"}</span>
                    </div>
                    <div className={styles.metaItem}>
                      {project.team === "Team" ? (
                        <FaUsers size={14} className={styles.metaIcon} />
                      ) : (
                        <FaUser size={13} className={styles.metaIcon} />
                      )}
                      <span>{project.team || "Solo"}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.projectLinks}>
                    {project.demoUrl && project.demoUrl !== "#" && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles.primary}`}
                      >
                        <FiExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles.secondary}`}
                      >
                        <FaGithub size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
                  src={selectedProject.image || "/img/projects/portfoliov1.png"}
                  alt={`${selectedProject.title} Desktop View`}
                  className={styles.imageViewerImage}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    if (!e.target.src.endsWith("/img/projects/portfoliov1.png")) {
                      e.target.src = "/img/projects/portfoliov1.png";
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
                {selectedProject.demoUrl && selectedProject.demoUrl !== "#" && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalActionBtn}
                  >
                    <FiExternalLink size={14} />
                    <span>Open Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
