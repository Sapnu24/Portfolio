// Adapted from Aceternity UI "Sticky Banner" (ui.aceternity.com), black and white.
// Stays pinned to the top of the page; the visitor can close it for the rest of their visit.
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SITE } from "@/data/work";

const KEY = "smv_banner_closed";
const BANNER_H = 44;

export default function StickyBanner() {
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) !== "1";
    } catch {
      return true;
    }
  });

  // The navbar and hero read --banner-h so they move down while the banner is showing.
  useEffect(() => {
    document.documentElement.style.setProperty("--banner-h", open ? `${BANNER_H}px` : "0px");
  }, [open]);

  if (!open) return null;

  const href = SITE.booking || `mailto:${SITE.email}?subject=${encodeURIComponent("30-minute discovery call")}`;

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <div className="sticky-banner" role="region" aria-label="Book a discovery call">
      <p>
        <span className="sticky-banner-long">Free 30-minute discovery call: let&apos;s talk about your videos and plan the edits.</span>
        <span className="sticky-banner-short">Free 30-min discovery call</span>
      </p>
      <a className="sticky-banner-cta" href={href} target={SITE.booking ? "_blank" : undefined} rel="noopener noreferrer">
        Book a call <span aria-hidden="true">→</span>
      </a>
      <button type="button" className="sticky-banner-close" onClick={close} aria-label="Close banner">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
