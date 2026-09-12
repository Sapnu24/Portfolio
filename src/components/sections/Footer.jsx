import { Facebook, Instagram, Telegram } from "react-bootstrap-icons";
import { FaGithub, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "@/styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.footerContainer}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left Section */}
        <div className={styles.brand}>
          <h2 className={styles.logo}>
            SMV<span className={styles.logoDot}>.</span>
          </h2>
          <p className={styles.tagline}>
            Bespoke full-stack web engineering, scalable cloud systems, and modern digital experiences delivered for global clients.
          </p>
        </div>

        {/* Quick Navigation / Socials */}
        <div className={styles.social}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className={styles.socialBtn}
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://t.me/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            title="Telegram"
            className={styles.socialBtn}
          >
            <Telegram size={18} />
          </a>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Sean Marion Velasco (SMV). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
