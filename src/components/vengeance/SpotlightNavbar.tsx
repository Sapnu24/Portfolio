// Adapted from Vengeance UI "Spotlight Navbar" (MIT, © Ashutoshx7): https://www.vengenceui.com/components/spotlight-navbar
// Changes: active item is controlled by the page (scroll position), fixed at the top, light theme only, plain <style>.
import React, { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  hideOnMobile?: boolean;
}

interface SpotlightNavbarProps {
  items: NavItem[];
  activeIndex: number;
  onItemClick?: (item: NavItem, index: number) => void;
  className?: string;
  endSlot?: React.ReactNode;
}

export function SpotlightNavbar({ items, activeIndex, onItemClick, className, endSlot }: SpotlightNavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [hovering, setHovering] = useState(false);
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  const centerOf = (index: number) => {
    const nav = navRef.current;
    const el = nav?.querySelector(`[data-index="${index}"]`);
    if (!nav || !el) return null;
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return r.left - n.left + r.width / 2;
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX - nav.getBoundingClientRect().left;
      setHovering(true);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };
    const onLeave = () => {
      setHovering(false);
      const target = centerOf(activeIndex);
      if (target == null) return;
      animate(spotlightX.current, target, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          spotlightX.current = v;
          nav.style.setProperty("--spotlight-x", `${v}px`);
        },
      });
    };
    nav.addEventListener("mousemove", onMove);
    nav.addEventListener("mouseleave", onLeave);
    return () => {
      nav.removeEventListener("mousemove", onMove);
      nav.removeEventListener("mouseleave", onLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    const nav = navRef.current;
    const target = centerOf(activeIndex);
    if (!nav || target == null) return;
    const controls = animate(ambienceX.current, target, {
      type: "spring",
      stiffness: 200,
      damping: 20,
      onUpdate: (v) => {
        ambienceX.current = v;
        nav.style.setProperty("--ambience-x", `${v}px`);
      },
    });
    return () => controls.stop();
  }, [activeIndex]);

  return (
    <div className={cn("pointer-events-none fixed inset-x-0 top-4 z-[1000] flex justify-center px-3", className)}>
      <nav
        ref={navRef}
        aria-label="Main"
        className="pointer-events-auto relative h-11 overflow-hidden rounded-full border border-[var(--rv-line)] bg-[var(--rv-nav-bg)] shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur-md"
        style={{ ["--spotlight-color" as string]: "rgba(var(--rv-beam),0.08)", ["--ambience-color" as string]: "rgba(var(--rv-beam),0.85)" }}
      >
        <ul className="relative z-[10] m-0 flex h-full list-none items-center gap-0 p-0 px-1.5">
          {items.map((item, idx) => (
            <li key={item.href} className={cn("relative flex h-full items-center justify-center", item.hideOnMobile && "max-[460px]:hidden")}>
              <a
                href={item.href}
                data-index={idx}
                onClick={(e) => {
                  e.preventDefault();
                  onItemClick?.(item, idx);
                }}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium no-underline transition-colors duration-200 max-[400px]:px-2.5 max-[400px]:text-[13px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                  activeIndex === idx ? "text-[var(--rv-text)]" : "text-[var(--rv-muted)] hover:text-[var(--rv-text)]"
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
          {endSlot && <li className="relative flex h-full items-center justify-center pl-1 pr-0.5">{endSlot}</li>}
        </ul>

        {/* Spotlight that follows the mouse */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-[1] h-full w-full transition-opacity duration-300"
          style={{
            opacity: hovering ? 1 : 0,
            background: "radial-gradient(120px circle at var(--spotlight-x) 100%, var(--spotlight-color) 0%, transparent 50%)",
          }}
        />
        {/* Line under the active item */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[2px] w-full"
          style={{ background: "radial-gradient(60px circle at var(--ambience-x) 0%, var(--ambience-color) 0%, transparent 100%)" }}
        />
      </nav>
    </div>
  );
}

export default SpotlightNavbar;
