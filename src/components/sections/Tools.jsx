import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/Tools.module.css";
import { TOOL_GROUPS } from "@/data/tools";
import BlurFade from "@/components/fx/BlurFade";

function ToolDialog({ tool, onClose }) {
  useEffect(() => {
    if (!tool) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [tool, onClose]);

  return (
    <AnimatePresence>
      {tool && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={tool.name}
        >
          <motion.div
            className={styles.dialog}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              Close
            </button>
            <div className={styles.dialogHead}>
              <span className={styles.bigTile} style={{ background: tool.tile }}>
                <img src={tool.icon} alt="" />
              </span>
              <div>
                <h3>{tool.name}</h3>
                <p className={styles.kind}>{tool.kind}</p>
              </div>
            </div>

            <h4 className={styles.h4}>What it is</h4>
            <p className={styles.p}>{tool.what}</p>

            <h4 className={styles.h4}>What I use it for</h4>
            <p className={styles.p}>{tool.use}</p>

            <ul className={styles.bullets}>
              {tool.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Tools() {
  const [open, setOpen] = useState(null);

  return (
    <section id="tools" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>Tools</p>
          <h2 className={styles.title}>
            The <em>toolkit</em> behind the edits.
          </h2>
          <p className={styles.sub}>
            Editing software, AI tools and the workflow tools that tie them together. Click a tool to see what it is and
            what I use it for.
          </p>
        </BlurFade>

        {TOOL_GROUPS.map((g, gi) => (
          <BlurFade key={g.title} delay={gi * 0.05} className={styles.group}>
            <div className={styles.groupHead}>
              <h3>{g.title}</h3>
              <span>{g.blurb}</span>
            </div>
            <div className={styles.grid}>
              {g.tools.map((t) => (
                <button key={t.id} type="button" className={styles.tool} onClick={() => setOpen(t)}>
                  <span className={styles.tile} style={{ background: t.tile }}>
                    <img src={t.icon} alt="" loading="lazy" />
                  </span>
                  <span className={styles.toolText}>
                    <strong>{t.name}</strong>
                    <small>{t.kind}</small>
                  </span>
                </button>
              ))}
            </div>
          </BlurFade>
        ))}
      </div>

      <ToolDialog tool={open} onClose={() => setOpen(null)} />
    </section>
  );
}
