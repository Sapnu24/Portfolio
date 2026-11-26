// Adapted from Aceternity UI "Background Beams With Collision" (ui.aceternity.com).
// Black-and-white version: thin dark beams fall, hit the floor of the section and burst into small particles.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BEAMS = [
  { x: "6%", duration: 7, delay: 2, h: 56 },
  { x: "14%", duration: 4, delay: 4, h: 40 },
  { x: "24%", duration: 9, delay: 0, h: 64 },
  { x: "35%", duration: 6, delay: 3, h: 36 },
  { x: "47%", duration: 11, delay: 1, h: 80 },
  { x: "58%", duration: 5, delay: 6, h: 48 },
  { x: "68%", duration: 8, delay: 2.5, h: 72 },
  { x: "79%", duration: 6, delay: 5, h: 40 },
  { x: "88%", duration: 10, delay: 1.5, h: 96 },
  { x: "95%", duration: 7, delay: 3.5, h: 52 },
];

export default function BackgroundBeamsWithCollision() {
  const parentRef = useRef(null);
  const floorRef = useRef(null);

  return (
    <div
      ref={parentRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
    >
      {BEAMS.map((b) => (
        <Beam key={b.x} beam={b} parentRef={parentRef} floorRef={floorRef} />
      ))}
      <div
        ref={floorRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(var(--rv-beam),0.12), transparent)",
        }}
      />
    </div>
  );
}

function Beam({ beam, parentRef, floorRef }) {
  const beamRef = useRef(null);
  const [hit, setHit] = useState(null); // { x, y } of the last collision
  const [cycle, setCycle] = useState(0); // remounts the beam after a collision
  const [range, setRange] = useState(900);

  useEffect(() => {
    const measure = () => parentRef.current && setRange(parentRef.current.offsetHeight + 120);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [parentRef]);

  useEffect(() => {
    let raf;
    let done = false;
    const check = () => {
      const el = beamRef.current;
      const floor = floorRef.current;
      const parent = parentRef.current;
      if (el && floor && parent && !done) {
        const b = el.getBoundingClientRect();
        const f = floor.getBoundingClientRect();
        if (b.bottom >= f.top) {
          const p = parent.getBoundingClientRect();
          done = true;
          setHit({ x: b.left - p.left + b.width / 2, y: f.top - p.top });
          setTimeout(() => {
            setHit(null);
            setCycle((c) => c + 1);
          }, 1400);
          return;
        }
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [cycle, floorRef, parentRef]);

  return (
    <>
      <motion.div
        key={cycle}
        ref={beamRef}
        initial={{ y: -200 }}
        animate={{ y: range }}
        transition={{
          duration: beam.duration,
          delay: cycle === 0 ? beam.delay : 0.4,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: beam.x,
          width: 1,
          height: beam.h,
          borderRadius: 999,
          background: "linear-gradient(to bottom, rgba(var(--rv-beam),0), rgba(var(--rv-beam),0.55))",
        }}
      />
      <AnimatePresence>{hit && <Explosion key={`${cycle}-hit`} x={hit.x} y={hit.y} />}</AnimatePresence>
    </>
  );
}

function Explosion({ x, y }) {
  const sparks = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    dx: Math.floor(Math.random() * 80 - 40),
    dy: Math.floor(Math.random() * -50 - 10),
  }));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          left: -40,
          top: -1,
          width: 80,
          height: 2,
          borderRadius: 999,
          background: "linear-gradient(to right, transparent, rgba(var(--rv-beam),0.45), transparent)",
          filter: "blur(1px)",
        }}
      />
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: s.dx, y: s.dy, opacity: 0 }}
          transition={{ duration: Math.random() * 1.2 + 0.4, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: 999,
            background: "rgba(var(--rv-beam),0.6)",
          }}
        />
      ))}
    </div>
  );
}
