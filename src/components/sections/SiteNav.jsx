import { useEffect, useState } from "react";
import { SpotlightNavbar } from "@/components/vengeance/SpotlightNavbar";
import ThemeButton from "@/components/sections/ThemeButton";

const ITEMS = [
  { label: "Home", href: "#home", hideOnMobile: true },
  { label: "About", href: "#nextSection" },
  { label: "Work", href: "#work" },
  { label: "Tools", href: "#tools" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

// Top navigation: highlights the section that is on screen and scrolls smoothly on click.
export default function SiteNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = ITEMS.map((i) => document.querySelector(i.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const idx = ITEMS.findIndex((i) => i.href === `#${visible[0].target.id}`);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (item, idx) => {
    setActive(idx);
    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <SpotlightNavbar items={ITEMS} activeIndex={active} onItemClick={go} endSlot={<ThemeButton />} />;
}
