// Adapted from Aceternity UI "Tracing Beam" (ui.aceternity.com).
// A thin line runs down the left edge of the page; a dark segment follows your scroll position, up and down.
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function TracingBeam({ children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => setHeight(ref.current?.offsetHeight || 0));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const spring = { stiffness: 500, damping: 90 };
  const head = useSpring(useTransform(scrollYProgress, [0, 1], [0, height]), spring);
  const tail = useSpring(useTransform(scrollYProgress, [0, 1], [-260, height - 260]), spring);
  const dotFill = useTransform(scrollYProgress, (v) => (v > 0 ? "var(--rv-text)" : "var(--rv-bg)"));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div className="tracing-beam-rail" aria-hidden="true">
        <div className="tracing-beam-dot">
          <motion.div style={{ width: 7, height: 7, borderRadius: 999, background: dotFill, border: "1px solid var(--rv-text)" }} />
        </div>
        {height > 0 && (
          <svg width="12" height={height} viewBox={`0 0 12 ${height}`} style={{ display: "block" }}>
            <path d={`M 6 0 V ${height}`} style={{ stroke: "var(--rv-text)" }} strokeOpacity="0.12" strokeWidth="1" fill="none" />
            <path d={`M 6 0 V ${height}`} stroke="url(#tracing-beam-gradient)" strokeWidth="2" fill="none" />
            <defs>
              <motion.linearGradient id="tracing-beam-gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={tail} y2={head}>
                <stop style={{ stopColor: "var(--rv-text)" }} stopOpacity="0" />
                <stop offset="0.75" style={{ stopColor: "var(--rv-text)" }} />
                <stop offset="1" style={{ stopColor: "var(--rv-text)" }} stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
