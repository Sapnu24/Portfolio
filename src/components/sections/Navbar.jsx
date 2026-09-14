import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import styles from "@/styles/Navbar.module.css";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  FaHome,
  FaUserAlt,
  FaBriefcase,
  FaProjectDiagram,
  FaEnvelope,
} from "react-icons/fa";
import { Send } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const navLinks = [
    { href: "#home", id: "home", label: "Home", icon: <FaHome /> },
    { href: "#nextSection", id: "nextSection", label: "About", icon: <FaUserAlt /> },
    /* Uncomment when first client is closed:
    { href: "#career", id: "career", label: "Milestones", icon: <FaBriefcase /> },
    */
    { href: "#projects", id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
    { href: "#contact", id: "contact", label: "Contact", icon: <FaEnvelope /> },
  ];

  useEffect(() => {
    let ticking = false;
    let isScrolledState = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrolled = window.scrollY > 40;
          if (currentScrolled !== isScrolledState) {
            isScrolledState = currentScrolled;
            setScrolled(currentScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // High-performance IntersectionObserver for active section tracking without layout thrashing
    const sectionIds = [
      "home",
      "nextSection",
      // "career", /* Uncomment when first client is closed */
      "projects",
      "contact",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`${styles.navbarWrapper} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        {/* Scroll Progress Indicator */}
        <motion.div className={styles.scrollProgressBar} style={{ scaleX }} />

        {/* Brand Logo */}
        <a href="#home" className={styles.logo} aria-label="Sean Marion Velasco (SMV) Home">
          <span className={styles.logoText}>
            SMV<span className={styles.logoDot}>.</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className={styles.desktopMenu}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`${styles.menuLink} ${isActive ? styles.activeLink : ""}`}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span>{link.fullLabel || link.label}</span>
                {isActive && <span className={styles.activePillDot} />}
              </a>
            );
          })}
        </div>

        {/* Desktop Header Quick CTA & Theme Toggle */}
        <div className={styles.navAction}>
          <ThemeToggle />
          <a href="#contact" className={styles.navCtaBtn}>
            <span>Let's Talk</span>
            <Send size={14} className={styles.navCtaIcon} />
          </a>
        </div>
      </nav>

      {/* Mobile Floating Bottom Dock Island */}
      <nav className={styles.mobileNavDock} aria-label="Mobile Navigation">
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`${styles.mobileDockItem} ${isActive ? styles.activeMobileItem : ""}`}
              aria-label={link.fullLabel || link.label}
              title={link.fullLabel || link.label}
            >
              <span className={styles.mobileDockIcon}>{link.icon}</span>
              {isActive && <span className={styles.mobileActiveDot} />}
            </a>
          );
        })}
        <div className={styles.mobileDockDivider} />
        <ThemeToggle compact dropUp />
      </nav>
    </header>
  );
}
