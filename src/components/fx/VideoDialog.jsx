import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/Fx.module.css";

/**
 * VideoDialog (pattern from Magic UI "hero video dialog"): click a poster, watch the
 * video at its real aspect ratio over a dimmed page. Esc or a click outside closes it.
 */
export default function VideoDialog({ item, onClose }) {
  useEffect(() => {
    if (!item) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className={styles.dialogBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            className={styles.dialogBody}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className={styles.dialogVideo}
              src={item.video}
              poster={item.poster}
              controls
              autoPlay
              playsInline
            />
            <div className={styles.dialogMeta}>
              <strong>{item.title}</strong>
              <span>{item.role}</span>
            </div>
            <button type="button" className={styles.dialogClose} onClick={onClose} aria-label="Close video">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
