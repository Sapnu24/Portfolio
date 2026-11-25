// Adapted from Vengeance UI "Cursor Card" (MIT, © Ashutoshx7): https://www.vengenceui.com/components/cursor-card
// Changes: inline <span> instead of a link, black-and-white highlight, light theme only.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CursorCardProps {
  children: React.ReactNode;
  image: string;
  description: string;
  className?: string;
}

export function CursorCard({ children, image, description, className }: CursorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 25, stiffness: 300 });
  const springY = useSpring(y, { damping: 25, stiffness: 300 });

  useEffect(() => setMounted(true), []);

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX - 120);
    y.set(e.clientY + 20);
  };

  return (
    <>
      <span
        className={cn(
          "relative -mx-1 inline cursor-default rounded px-1 font-semibold text-neutral-900 underline decoration-neutral-300 decoration-2 underline-offset-4 transition-colors hover:bg-neutral-200/70",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </span>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ x: springX, y: springY }}
                className="pointer-events-none fixed left-0 top-0 z-[2000] w-[240px] rounded-xl border border-neutral-200 bg-white p-3 shadow-2xl"
              >
                <img src={image} alt="" className="mb-3 block h-auto w-full rounded-md object-cover" />
                <p className="m-0 text-sm leading-relaxed text-neutral-600">{description}</p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export default CursorCard;
