// Adapted from Vengeance UI "Cylinder Carousel" (MIT, © Ashutoshx7): https://www.vengenceui.com/components/cylinder-carousel
// Changes: cards are buttons (click to play), 9:16 posters, rotation pauses on hover.
import React from "react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string;
  poster: string;
  title: string;
}

interface CylinderCarouselProps {
  items: CarouselItem[];
  onSelect?: (item: CarouselItem) => void;
  animationDuration?: number;
  cardWidth?: number;
  className?: string;
}

export function CylinderCarousel({ items, onSelect, animationDuration = 46, cardWidth = 190, className }: CylinderCarouselProps) {
  const vars = {
    "--n": items.length,
    "--w": `${cardWidth}px`,
    "--ba": "calc(1turn / var(--n))",
    "--anim-dur": `${animationDuration}s`,
  } as React.CSSProperties;

  return (
    <div
      className={cn("cyl-wrap w-full grid place-items-center overflow-hidden", className)}
      style={{
        perspective: "35em",
        minHeight: Math.round((cardWidth * 16) / 9) + 120,
        maskImage: "linear-gradient(90deg, transparent, #000 18% 82%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 18% 82%, transparent)",
      }}
    >
      <style>{`
        @keyframes cyl-ry { to { transform: rotateY(1turn); } }
        .cyl-ring { animation: cyl-ry var(--anim-dur) linear infinite; }
        .cyl-wrap:hover .cyl-ring { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .cyl-ring { animation-duration: 180s; } }
      `}</style>
      <div className="cyl-ring grid place-items-center [transform-style:preserve-3d]" style={vars}>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect?.(it)}
            aria-label={`Play ${it.title}`}
            title={it.title}
            className="[grid-area:1/1] [backface-visibility:hidden] overflow-hidden rounded-2xl border border-[var(--rv-line)] bg-black p-0 cursor-pointer"
            style={
              {
                width: "var(--w)",
                aspectRatio: "9/16",
                "--i": i,
                transform:
                  "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
              } as React.CSSProperties
            }
          >
            <img src={it.poster} alt="" loading="lazy" className="block h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default CylinderCarousel;
