import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/About.module.css";
import {
  FaCode,
  FaPaintBrush,
  FaServer,
  FaUsers,
  FaLaptopCode,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa";
import { Sparkles, Compass, Zap, ShieldCheck } from "lucide-react";
import { getSkillCategories, getCachedSkillCategories, DEFAULT_SKILL_CATEGORIES } from "@/services/skillServices";
import { getTechBadgeData } from "@/utils/techIcons";

const iconMap = {
  code: <FaCode size={24} />,
  brush: <FaPaintBrush size={24} />,
  server: <FaServer size={24} />,
  users: <FaUsers size={24} />,
  laptop: <FaLaptopCode size={24} />,
  cogs: <FaCogs size={24} />,
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

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
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

const About = () => {
  const [categories, setCategories] = useState(getCachedSkillCategories);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await getSkillCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Error loading skill categories:", err);
      }
    }
    loadSkills();
  }, []);

  return (
    <section id="nextSection" className={styles.aboutSection}>
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
            <span>Full-Stack Developer & Software Engineer</span>
          </div>
          <h2 className={styles.title}>
            Engineered for Performance, <span className={styles.titleGradient}>Scalability & Precision</span>
          </h2>
          <p className={styles.subtitle}>
            I am Sean Marion Velasco, a Full-Stack Developer and Software Engineer. I architect and build robust web applications, high-performance APIs, and scalable digital systems for clients on Upwork and worldwide.
          </p>
        </motion.div>

        {/* Philosophy & Highlights Banner with Staggered Scroll Reveal */}
        <motion.div
          className={styles.philosophyGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className={styles.philosophyCard} variants={itemVariants} whileHover={{ y: -5 }}>
            <div className={styles.philosophyIconWrapper}>
              <Zap size={22} />
            </div>
            <div className={styles.philosophyContent}>
              <h4>High-Performance Webapps</h4>
              <p>Building lightning-fast, reactive web interfaces with React JS, TypeScript, modern CSS architecture, and optimized bundle sizes.</p>
            </div>
          </motion.div>

          <motion.div className={styles.philosophyCard} variants={itemVariants} whileHover={{ y: -5 }}>
            <div className={styles.philosophyIconWrapper}>
              <Compass size={22} />
            </div>
            <div className={styles.philosophyContent}>
              <h4>Scalable Backend Architecture</h4>
              <p>Designing secure REST APIs, microservices, and database systems with Laravel PHP, Node.js, and MySQL for reliable enterprise data flow.</p>
            </div>
          </motion.div>

          <motion.div className={styles.philosophyCard} variants={itemVariants} whileHover={{ y: -5 }}>
            <div className={styles.philosophyIconWrapper}>
              <ShieldCheck size={22} />
            </div>
            <div className={styles.philosophyContent}>
              <h4>Clean Code & Client Delivery</h4>
              <p>Applying best practices in version control (Git), modular component systems, continuous testing, and proactive milestone delivery.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Categorized Expertise Matrix */}
        <motion.div
          className={styles.expertiseHeader}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <h3>Core Technical Disciplines</h3>
          <p>Key technologies and engineering disciplines utilized to build high-performance web applications</p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {categories.map((category) => {
            const iconKey = (category.icon || "code").toLowerCase();
            const iconElement = iconMap[iconKey] || <FaCode size={24} />;
            const skillsArray = Array.isArray(category.skills)
              ? category.skills
              : typeof category.skills === "string"
                ? category.skills.split(",").map((s) => s.trim()).filter(Boolean)
                : [];

            return (
              <motion.div
                key={category.id}
                className={styles.card}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.iconWrapper}>{iconElement}</div>
                  <h3 className={styles.cardTitle}>{category.title}</h3>
                </div>

                <div className={styles.skillsTagList}>
                  {skillsArray.map((skill, index) => {
                    const badge = getTechBadgeData(skill);
                    const IconComp = badge.icon;
                    return (
                      <span
                        key={index}
                        className={styles.skillTag}
                        style={{
                          borderColor: `${badge.color}35`,
                        }}
                      >
                        {IconComp ? (
                          <IconComp size={12} style={{ color: badge.color }} />
                        ) : (
                          <FaCheckCircle size={11} className={styles.tagCheck} />
                        )}
                        <span>{skill}</span>
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
