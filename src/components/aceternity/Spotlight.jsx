// Adapted from Aceternity UI "Spotlight" (ui.aceternity.com).
// On a white page the light becomes a very soft grey shadow beam that sweeps in once on load.
import { motion } from "framer-motion";

export default function Spotlight({ style }) {
  return (
    <motion.svg
      aria-hidden="true"
      initial={{ opacity: 0, x: "-72%", y: "-62%", scale: 0.5 }}
      animate={{ opacity: 1, x: "-50%", y: "-40%", scale: 1 }}
      transition={{ duration: 2, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      viewBox="0 0 3787 2842"
      fill="none"
      style={{
        position: "absolute",
        top: "-8rem",
        left: "8%",
        width: "138%",
        height: "169%",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
    >
      <g filter="url(#spotlight-blur)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          style={{ fill: "var(--rv-text)" }}
          fillOpacity="0.05"
        />
      </g>
      <defs>
        <filter
          id="spotlight-blur"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </motion.svg>
  );
}
