import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Timeline.module.css";
import { FaBriefcase, FaGraduationCap, FaLaptopCode, FaAward, FaCalendarAlt, FaBuilding } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { getTimelineItems, getCachedTimelineItems, DEFAULT_TIMELINE } from "@/services/timelineServices";
import { getTechBadgeData } from "@/utils/techIcons";

const timelineIconMap = {
  briefcase: <FaBriefcase />,
  graduation: <FaGraduationCap />,
  laptop: <FaLaptopCode />,
  award: <FaAward />,
};

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

const timelineItemVariants = {
  hidden: { opacity: 0, x: -25 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CareerRoadmap() {
  const [timeline, setTimeline] = useState(getCachedTimelineItems);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await getTimelineItems();
        if (data && data.length > 0) {
          setTimeline(data);
        }
      } catch (err) {
        console.error("Error loading timeline items:", err);
      }
    }
    loadTimeline();
  }, []);

  return (
    <section id="career" className={styles.roadmapSection}>
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
            <span>Freelance Delivery & Milestones</span>
          </div>
          <h2 className={styles.title}>
            Freelance Engineering & <span className={styles.titleGradient}>Client Milestones</span>
          </h2>
          <p className={styles.subtitle}>
            A track record of bespoke web architectures, international client deliverables, and high-impact freelance milestones.
          </p>
        </motion.div>

        {/* Timeline Spine & Nodes with Scroll Reveal */}
        <div className={styles.timeline}>
          {timeline.map((item, index) => {
            const iconType = (item.iconType || "briefcase").toLowerCase();
            const iconElement = timelineIconMap[iconType] || <FaBriefcase />;
            const tagsArray = Array.isArray(item.tags) ? item.tags : [];

            return (
              <motion.div
                className={styles.timelineItem}
                key={item.id || index}
                variants={timelineItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Node Icon on Timeline Spine */}
                <div className={styles.timelineIconWrapper}>
                  <div className={styles.timelineIcon}>
                    {iconElement}
                  </div>
                </div>

                {/* Milestone Card */}
                <motion.div
                  className={styles.timelineCard}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.roleInfo}>
                      <h3 className={styles.roleTitle}>{item.role}</h3>
                      <div className={styles.companyWrapper}>
                        <FaBuilding size={13} className={styles.companyIcon} />
                        <span className={styles.companyName}>{item.company}</span>
                      </div>
                    </div>

                    <div className={styles.periodBadge}>
                      <FaCalendarAlt size={11} className={styles.calendarIcon} />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  <p className={styles.description}>{item.description}</p>

                  {tagsArray.length > 0 && (
                    <div className={styles.tagsWrapper}>
                      {tagsArray.map((tag, i) => {
                        const badge = getTechBadgeData(tag);
                        const IconComp = badge.icon;
                        return (
                          <span
                            className={styles.tagPill}
                            key={i}
                            title={`${tag} (${badge.name})`}
                          >
                            {IconComp && <IconComp size={11} className={styles.tagIcon} />}
                            <span>{tag}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
