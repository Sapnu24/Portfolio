// Magnify effect adapted from Aceternity UI "Floating Dock" (ui.aceternity.com).
// Keeps the site's own buttons: each one grows and lifts a little as the mouse gets close.
import { Children, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function DockRow({ children, className, style }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={className}
      style={style}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {Children.map(children, (child) =>
        // Plain text groups (like the small link list) stay still.
        child && child.type !== "span" ? <DockItem mouseX={mouseX}>{child}</DockItem> : child
      )}
    </div>
  );
}

function DockItem({ mouseX, children }) {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : Infinity;
  });
  const spring = { mass: 0.1, stiffness: 160, damping: 12 };
  const scale = useSpring(useTransform(distance, [-160, 0, 160], [1, 1.12, 1]), spring);
  const y = useSpring(useTransform(distance, [-160, 0, 160], [0, -4, 0]), spring);

  return (
    <motion.div ref={ref} style={{ scale, y, transformOrigin: "50% 100%", display: "inline-flex" }}>
      {children}
    </motion.div>
  );
}
