import { motion } from "framer-motion";
import styles from "@/styles/About.module.css";
import { Sparkles, Compass, Zap, ShieldCheck } from "lucide-react";

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
            <span>Web Developer – Full Stack</span>
          </div>
          <h2 className={styles.title}>
            Engineered for Performance, <span className={styles.titleGradient}>Scalability & Precision</span>
          </h2>
          <p className={styles.subtitle}>
            I am Sean Marion Velasco, a freelance Full-Stack Web Developer. I build clean, high-performance web applications and reliable digital systems for clients on Upwork and worldwide.
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
      </div>
    </section>
  );
};

export default About;
