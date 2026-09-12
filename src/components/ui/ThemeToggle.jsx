import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import styles from "@/styles/ThemeToggle.module.css";

export default function ThemeToggle({ compact = false, className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`${styles.toggleContainer} ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`${styles.toggleBtn} ${compact ? styles.compact : ""}`}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "dark" : "light"}
            className={styles.iconWrapper}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {isDark ? (
              <Sun size={compact ? 17 : 19} className={styles.sunIcon} strokeWidth={2.2} />
            ) : (
              <Moon size={compact ? 17 : 19} className={styles.moonIcon} strokeWidth={2.2} />
            )}
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
}
