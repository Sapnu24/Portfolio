import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Certifications.module.css";
import { FaClock, FaAward, FaCheckCircle, FaUniversity } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Sparkles } from "lucide-react";
import { getCertifications, getCachedCertifications, DEFAULT_CERTIFICATIONS } from "@/services/certificationServices";
import { getTechBadgeData } from "@/utils/techIcons";

const headerVariants = {
  hidden: { opacity: 0, y: 28 },
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

const certCardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
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

const Certifications = () => {
  const [certifications, setCertifications] = useState(getCachedCertifications);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCertifications() {
      try {
        const data = await getCertifications();
        if (data && data.length > 0) {
          setCertifications(data);
        }
      } catch (err) {
        console.warn("Failed to load certifications:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCertifications();
  }, []);

  return (
    <section id="certifications" className={styles.certificationsSection}>
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
            <span>Verified Qualifications</span>
          </div>
          <h2 className={styles.title}>
            Verified <span className={styles.titleGradient}>Certifications & Skills</span>
          </h2>
          <p className={styles.subtitle}>
            Technical accreditations, verified course completions, and certified proficiencies backing our full-stack engineering team.
          </p>
        </motion.div>

        {/* Certifications Grid with Staggered Scroll Reveal */}
        <motion.div
          className={styles.certificationsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              className={styles.certCard}
              variants={certCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
            >
              <div className={styles.certCardHeader}>
                <div className={styles.certIconWrapper}>
                  <FaAward size={22} />
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    cert.status === "Completed" ? styles.statusCompleted : styles.statusProgress
                  }`}
                >
                  <FaCheckCircle size={10} />
                  {cert.status || "Completed"}
                </span>
              </div>

              <div className={styles.certBody}>
                <h3 className={styles.certTitle}>{cert.title}</h3>
                <p className={styles.certDescription}>{cert.description}</p>

                {/* Skills Badges with Dynamic Tech Stack Branding */}
                {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                  <div className={styles.certSkills}>
                    {cert.skills.map((skill, index) => {
                      const badge = getTechBadgeData(skill);
                      const IconComp = badge.icon;
                      return (
                        <span
                          key={index}
                          className={styles.tag}
                          title={`${skill} (${badge.name})`}
                        >
                          {IconComp && (
                            <IconComp size={11} className={styles.tagIcon} />
                          )}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Meta Strip */}
                <div className={styles.certMeta}>
                  <span className={styles.metaItem}>
                    <FaUniversity size={13} className={styles.metaIcon} />
                    <span>{cert.issuer}</span>
                  </span>
                  <span className={styles.metaItem}>
                    <FaClock size={12} className={styles.metaIcon} />
                    <span>{cert.duration}</span>
                  </span>
                </div>

                {/* Action Link */}
                {cert.verificationUrl && (
                  <div className={styles.certLinks}>
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyBtn}
                    >
                      <FiExternalLink size={15} />
                      <span>Verify Credential</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
