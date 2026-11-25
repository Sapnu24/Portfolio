import { useRef } from "react";
import styles from "@/styles/Fx.module.css";

/**
 * SpotlightCard (pattern from Aceternity "card spotlight" / React Bits "spotlight card"):
 * a soft light follows the cursor inside the card. Pure CSS variables, no re-renders.
 */
export default function SpotlightCard({ children, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag ref={ref} onMouseMove={onMove} className={`${styles.spotlight} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
