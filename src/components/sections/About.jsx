import { motion } from "framer-motion";
import styles from "@/styles/About.module.css";
import { Compass, Zap, ShieldCheck } from "lucide-react";

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
            <span>Video Editor & AI Video Production Lead</span>
          </div>
          <h2 className={styles.title}>
            Built for Output, <span className={styles.titleGradient}>Quality & Cost Control</span>
          </h2>
          <p className={styles.subtitle}>
            I am Sean Marion Velasco, a video editor from the Philippines. I edit long-form and short-form videos, ads and VSLs in Premiere Pro and CapCut, and I have worked on travel vlogs and patient-education content for eye care, optometry and ophthalmology practices. I also build AI video workflows and lead the editing team at Specialty Vision.
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
              <h4>Ads that convert</h4>
              <p>Hooks, word-synced captions, product callouts, offer cards and multiple versions per ad for testing.</p>
            </div>
          </motion.div>

          <motion.div className={styles.philosophyCard} variants={itemVariants} whileHover={{ y: -5 }}>
            <div className={styles.philosophyIconWrapper}>
              <Compass size={22} />
            </div>
            <div className={styles.philosophyContent}>
              <h4>Automated, gated pipelines</h4>
              <p>Script, generation, checks, edit, voice and delivery as one repeatable process, with approvals before credits are spent.</p>
            </div>
          </motion.div>

          <motion.div className={styles.philosophyCard} variants={itemVariants} whileHover={{ y: -5 }}>
            <div className={styles.philosophyIconWrapper}>
              <ShieldCheck size={22} />
            </div>
            <div className={styles.philosophyContent}>
              <h4>Quality and cost control</h4>
              <p>Per-clip checks, a credit ledger for every video, and a rule added for every failure.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
