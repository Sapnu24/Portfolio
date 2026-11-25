import styles from "@/styles/Fx.module.css";

/**
 * Marquee (pattern from Magic UI / Animata / Motion Primitives "infinite slider"):
 * a seamless horizontal loop that pauses on hover and fades at the edges.
 */
export default function Marquee({ items, speed = 38 }) {
  const row = (key) => (
    <ul className={styles.marqueeRow} aria-hidden={key === "b"} key={key}>
      {items.map((t) => (
        <li key={t + key} className={styles.marqueeItem}>
          {t}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={styles.marquee} style={{ "--marquee-speed": `${speed}s` }}>
      <div className={styles.marqueeTrack}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
