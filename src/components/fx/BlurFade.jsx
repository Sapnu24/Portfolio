import { motion } from "framer-motion";

/**
 * Fade-up (pattern from Magic UI blur-fade, without the blur): fades and lifts its children
 * the first time they scroll into view, or on mount when `immediate` is set (use it above the fold).
 */
export default function BlurFade({ children, delay = 0, y = 16, className, as = "div", immediate = false, ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" } })}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
