import { useState } from "react";
import styles from "@/styles/Work.module.css";
import { WORK, CASE_STUDY, TOOLS } from "@/data/work";

const CATEGORIES = Array.from(new Set(WORK.map((w) => w.category)));

export default function Work() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const items = WORK.filter((w) => w.category === cat);
  const tall = items.filter((w) => !w.wide);
  const wide = items.filter((w) => w.wide);
  return (
    <section id="work" className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Video work</span>
        <h2 className={styles.title}>Videos I have edited and produced</h2>
        <p className={styles.sub}>
          Long-form, short-form, ads, AI talking heads and motion graphics. Each card says what I did.
        </p>
        <div className={styles.tabs}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.tab} ${cat === c ? styles.tabActive : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {tall.length > 0 && (
          <div className={styles.gridTall}>
          {tall.map((w) => (
            <article key={w.id} className={styles.card}>
              <div className={`${styles.media} ${w.wide ? styles.mediaWide : styles.mediaTall}`}>
                <video
                  className={styles.video}
                  src={w.video}
                  poster={w.poster}
                  controls
                  preload="none"
                  playsInline
                />
              </div>
              <div className={styles.body}>
                <div className={styles.cat}>{w.category}</div>
                <h3 className={styles.cardTitle}>{w.title}</h3>
                <p className={styles.role}>{w.role}</p>
                {w.note && <p className={styles.note}>{w.note}</p>}
              </div>
            </article>
          ))}
          </div>
        )}
        {wide.length > 0 && (
          <div className={styles.gridWide}>
          {wide.map((w) => (
            <article key={w.id} className={styles.card}>
              <div className={`${styles.media} ${w.wide ? styles.mediaWide : styles.mediaTall}`}>
                <video
                  className={styles.video}
                  src={w.video}
                  poster={w.poster}
                  controls
                  preload="none"
                  playsInline
                />
              </div>
              <div className={styles.body}>
                <div className={styles.cat}>{w.category}</div>
                <h3 className={styles.cardTitle}>{w.title}</h3>
                <p className={styles.role}>{w.role}</p>
                {w.note && <p className={styles.note}>{w.note}</p>}
              </div>
            </article>
          ))}
          </div>
        )}

        <div className={styles.cs}>
          <h3 className={styles.csTitle}>{CASE_STUDY.title}</h3>
          <p className={styles.csIntro}>{CASE_STUDY.intro}</p>
          <ol className={styles.steps}>
            {CASE_STUDY.steps.map(([h, t]) => (
              <li key={h} className={styles.step}>
                <b>{h}</b>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <div className={styles.tools}>
            <span className={styles.toolsLabel}>Tools I use</span>
            {TOOLS.map((t) => (
              <span key={t} className={styles.tool}>{t}</span>
            ))}
          </div>
          <p className={styles.owned}>{CASE_STUDY.owned}</p>
          <p className={styles.lessons}>{CASE_STUDY.lessons}</p>
        </div>
      </div>
    </section>
  );
}
