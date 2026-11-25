import { useState } from "react";
import { motion } from "framer-motion";
import styles from "@/styles/Work.module.css";
import { WORK } from "@/data/work";
import BlurFade from "@/components/fx/BlurFade";
import VideoDialog from "@/components/fx/VideoDialog";

const CATEGORIES = Array.from(new Set(WORK.map((w) => w.category)));

function Card({ item, onOpen, index }) {
  return (
    <BlurFade delay={Math.min(index, 6) * 0.05} y={12}>
      <article className={styles.card}>
        <button
          type="button"
          className={`${styles.thumb} ${item.wide ? styles.thumbWide : styles.thumbTall}`}
          onClick={() => onOpen(item)}
          aria-label={`Play ${item.title}`}
        >
          <img src={item.poster} alt="" loading="lazy" />
          <span className={styles.play} aria-hidden="true" />
        </button>
        <div className={styles.body}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <p className={styles.role}>{item.role}</p>
          {item.note && <p className={styles.note}>{item.note}</p>}
        </div>
      </article>
    </BlurFade>
  );
}

export default function Work() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [open, setOpen] = useState(null);
  const items = WORK.filter((w) => w.category === cat);
  const tall = items.filter((w) => !w.wide);
  const wide = items.filter((w) => w.wide);

  return (
    <section id="work" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>Work</p>
          <h2 className={styles.title}>
            Videos I have <em>edited</em> and produced.
          </h2>
          <p className={styles.sub}>
            Long-form, short-form, ads, AI talking heads and motion graphics. Click a video to watch it. Each card says
            what I did.
          </p>
        </BlurFade>

        <div className={styles.tabs} role="tablist" aria-label="Video categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              className={`${styles.tab} ${cat === c ? styles.tabActive : ""}`}
              onClick={() => setCat(c)}
            >
              {cat === c && (
                <motion.span
                  layoutId="workTabPill"
                  className={styles.tabPill}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={styles.tabText}>{c}</span>
            </button>
          ))}
        </div>

        <div key={cat}>
          {tall.length > 0 && (
            <div className={styles.gridTall}>
              {tall.map((w, i) => (
                <Card key={w.id} item={w} index={i} onOpen={setOpen} />
              ))}
            </div>
          )}
          {wide.length > 0 && (
            <div className={styles.gridWide}>
              {wide.map((w, i) => (
                <Card key={w.id} item={w} index={i} onOpen={setOpen} />
              ))}
            </div>
          )}
        </div>
      </div>

      <VideoDialog item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
