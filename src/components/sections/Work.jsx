import { useState } from "react";
import styles from "@/styles/Work.module.css";
import { WORK, CASE_STUDY } from "@/data/work";

const CATEGORIES = ["All", ...Array.from(new Set(WORK.map((w) => w.category)))];

export default function Work() {
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? WORK : WORK.filter((w) => w.category === cat);
  return (
    <section id="work" className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Video work</span>
        <h2 className={styles.title}>DTC ads, UGC and AI video</h2>
        <p className={styles.sub}>
          Samples of ads and videos I edited or produced. Each card says what I did.
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
        <div className={styles.grid}>
          {items.map((w) => (
            <article key={w.id} className={styles.card}>
              <div className={styles.media}>
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
          <div className={styles.results}>
            {CASE_STUDY.results.map(([n, l]) => (
              <div key={l} className={styles.res}>
                <strong>{n}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <p className={styles.owned}>{CASE_STUDY.owned}</p>
          <p className={styles.lessons}>{CASE_STUDY.lessons}</p>
        </div>
      </div>
    </section>
  );
}
