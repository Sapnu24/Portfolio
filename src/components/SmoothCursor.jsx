import React, { useEffect, useRef, useState } from "react";

const SmoothCursor = ({
  size = 60,
  ease = 0.15,
  border = 3,
  borderColor = "#4f46e5",
  blendMode = "normal",
}) => {
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: pos.current.x, y: pos.current.y });
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false); // track mobile

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // skip cursor logic on mobile

    const SELECTORS_TO_HIDE = "a, button, [role='button'], input, textarea, select, .cursor-hide";

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const hideTargets = document.querySelectorAll(SELECTORS_TO_HIDE);
    const enterHide = () => setScale(0);
    const leaveHide = () => setScale(1);

    hideTargets.forEach((el) => {
      el.addEventListener("mouseenter", enterHide);
      el.addEventListener("mouseleave", leaveHide);
    });

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;

      if (dotRef.current) {
        const x = pos.current.x - size / 2;
        const y = pos.current.y - size / 2;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      hideTargets.forEach((el) => {
        el.removeEventListener("mouseenter", enterHide);
        el.removeEventListener("mouseleave", leaveHide);
      });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ease, size, scale, isMobile]);

  // Do not render on mobile
  if (isMobile) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        pointerEvents: "none",
        transform: `translate3d(${pos.current.x - size / 2}px, ${pos.current.y - size / 2}px, 0) scale(${scale})`,
        transition: "transform 0.25s ease-out",
        mixBlendMode: blendMode,
        border: `${border}px solid var(--primary-color, ${borderColor})`,
        boxShadow: "0 0 12px var(--accent-glow, rgba(6, 182, 212, 0.25))",
      }}
    />
  );
};

export default SmoothCursor;
