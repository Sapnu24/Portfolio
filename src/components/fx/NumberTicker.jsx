import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

/**
 * NumberTicker (pattern from Magic UI / Animate UI "counting number"):
 * counts up once when it scrolls into view.
 */
export default function NumberTicker({ value, decimals = 0, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent =
          v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, suffix, duration]);

  return (
    <span ref={ref}>
      {(0).toLocaleString("en-US", { minimumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
