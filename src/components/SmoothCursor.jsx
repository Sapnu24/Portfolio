import React, { useEffect, useRef, useState } from "react";

const SmoothCursor = ({
  size = 54,
  ease = 0.18,
  border = 2.5,
  borderColor = "#4f46e5",
  blendMode = "normal",
}) => {
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const currentScale = useRef(0);
  const targetScale = useRef(1);
  const isInitialized = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      setIsMobile(Boolean(mobile));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMouseMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!isInitialized.current) {
        isInitialized.current = true;
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
      }
    };

    const onMouseOver = (e) => {
      const el = e.target;
      if (
        el &&
        (el.closest("a, button, [role='button'], input, textarea, select, .cursor-hide, label") ||
          (el.matches && el.matches("a, button, [role='button'], input, textarea, select, .cursor-hide, label")))
      ) {
        targetScale.current = 0;
      } else {
        targetScale.current = 1;
      }
    };

    const onMouseLeaveDoc = () => {
      targetScale.current = 0;
    };

    const onMouseEnterDoc = () => {
      targetScale.current = 1;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDoc, { passive: true });
    document.addEventListener("mouseenter", onMouseEnterDoc, { passive: true });

    const tick = () => {
      // Smooth linear interpolation for coordinates and scale
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;
      currentScale.current += (targetScale.current - currentScale.current) * 0.22;

      if (dotRef.current) {
        const x = pos.current.x - size / 2;
        const y = pos.current.y - size / 2;
        const scaleVal = Math.max(0, currentScale.current);
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scaleVal})`;
        dotRef.current.style.opacity = scaleVal > 0.02 ? "1" : "0";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      document.removeEventListener("mouseenter", onMouseEnterDoc);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ease, size, isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        transform: `translate3d(-100px, -100px, 0) scale(0)`,
        opacity: 0,
        willChange: "transform, opacity",
        mixBlendMode: blendMode,
        border: `${border}px solid var(--primary-color, ${borderColor})`,
        boxShadow: "0 0 12px var(--accent-glow, rgba(6, 182, 212, 0.25))",
        zIndex: 9999,
        transition: "none", // Avoid CSS transition fighting JS requestAnimationFrame!
      }}
    />
  );
};

export default SmoothCursor;
