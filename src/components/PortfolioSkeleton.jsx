import { useEffect, useState } from "react";
import styles from "@/styles/PortfolioSkeleton.module.css";

export default function PortfolioSkeleton({ isVisible = true }) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => setMounted(false), 550);
      return () => clearTimeout(timer);
    } else {
      setMounted(true);
    }
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.skeletonOverlay} ${!isVisible ? styles.fadeOut : ""}`}
      aria-busy="true"
      aria-label="Loading portfolio content"
    >
      <div className={styles.skeletonContentWrap}>
      {/* 1. NAVBAR SKELETON */}
      <header className={styles.navWrapper}>
        <div className={styles.navDock}>
          <div className={`${styles.navLogo} ${styles.shimmer}`} />
          
          {/* Desktop Navigation Links */}
          <div className={styles.navLinks}>
            <div className={`${styles.navLinkPill} ${styles.shimmer}`} />
            <div className={`${styles.navLinkPill} ${styles.shimmer}`} />
            <div className={`${styles.navLinkPill} ${styles.shimmer}`} />
            <div className={`${styles.navLinkPill} ${styles.shimmer}`} />
            <div className={`${styles.navLinkPill} ${styles.shimmer}`} />
          </div>

          {/* Desktop CTA */}
          <div className={`${styles.navCta} ${styles.shimmer}`} />

          {/* Mobile Menu Icon */}
          <div className={`${styles.mobileMenuToggle} ${styles.shimmer}`} />
        </div>
      </header>

      {/* 2. HERO SKELETON */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* Left Column */}
          <div className={styles.heroLeft}>
            {/* Live Availability Beacon Pill */}
            <div className={`${styles.statusPill} ${styles.shimmer}`} />

            {/* Greeting Tag */}
            <div className={`${styles.greetingPill} ${styles.shimmer}`} />

            {/* Heading Lines */}
            <div className={`${styles.titleLine1} ${styles.shimmer}`} />
            <div className={`${styles.titleLine2} ${styles.shimmer}`} />

            {/* Role Badge */}
            <div className={`${styles.rolePill} ${styles.shimmer}`} />

            {/* Bio Paragraph Lines */}
            <div className={styles.bioParagraph}>
              <div className={`${styles.bioLine} ${styles.shimmer}`} style={{ width: "98%" }} />
              <div className={`${styles.bioLine} ${styles.shimmer}`} style={{ width: "90%" }} />
              <div className={`${styles.bioLine} ${styles.shimmer}`} style={{ width: "75%" }} />
            </div>

            {/* Tech Stack Pills Row */}
            <div className={styles.techPillsRow}>
              <div className={`${styles.techPill} ${styles.shimmer}`} style={{ width: "85px" }} />
              <div className={`${styles.techPill} ${styles.shimmer}`} style={{ width: "95px" }} />
              <div className={`${styles.techPill} ${styles.shimmer}`} style={{ width: "90px" }} />
              <div className={`${styles.techPill} ${styles.shimmer}`} style={{ width: "110px" }} />
              <div className={`${styles.techPill} ${styles.shimmer}`} style={{ width: "75px" }} />
              <div className={`${styles.techPill} ${styles.shimmer}`} style={{ width: "85px" }} />
            </div>

            {/* CTA Action Buttons */}
            <div className={styles.actionButtons}>
              <div className={`${styles.btnPrimary} ${styles.shimmer}`} />
              <div className={`${styles.btnSecondary} ${styles.shimmer}`} />
              <div className={`${styles.btnResume} ${styles.shimmer}`} />
            </div>

            {/* Social Icons */}
            <div className={styles.socialRow}>
              <div className={`${styles.socialDot} ${styles.shimmer}`} />
              <div className={`${styles.socialDot} ${styles.shimmer}`} />
              <div className={`${styles.socialDot} ${styles.shimmer}`} />
            </div>
          </div>

          {/* Right Column: Code Deck Frame */}
          <div className={styles.heroRight}>
            <div className={styles.codeDeck}>
              {/* Window Controls & Tabs */}
              <div className={styles.deckHeader}>
                <div className={styles.windowDots}>
                  <div className={`${styles.windowDot} ${styles.shimmer}`} />
                  <div className={`${styles.windowDot} ${styles.shimmer}`} />
                  <div className={`${styles.windowDot} ${styles.shimmer}`} />
                </div>
                <div className={styles.deckTabs}>
                  <div className={`${styles.deckTab} ${styles.shimmer}`} />
                  <div className={`${styles.deckTab} ${styles.shimmer}`} />
                </div>
              </div>

              {/* Shimmering Code Lines */}
              <div className={styles.codeBody}>
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "45%" }} />
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "80%" }} />
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "65%" }} />
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "90%" }} />
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "70%" }} />
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "85%" }} />
                <div className={`${styles.codeLine} ${styles.shimmer}`} style={{ width: "40%" }} />
              </div>

              {/* Floating Stat HUD Cards */}
              <div className={styles.floatingHudRow}>
                <div className={`${styles.hudCard} ${styles.shimmer}`} />
                <div className={`${styles.hudCard} ${styles.shimmer}`} />
                <div className={`${styles.hudCard} ${styles.shimmer}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SKILLS BANNER SKELETON */}
      <div className={styles.skillsBannerSection}>
        <div className={`${styles.sectionEyebrow} ${styles.shimmer}`} />
        <div className={`${styles.sectionTitle} ${styles.shimmer}`} />
        <div className={styles.marqueeRow}>
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
          <div className={`${styles.marqueeCard} ${styles.shimmer}`} />
        </div>
      </div>

      {/* 4. PROJECTS SKELETON */}
      <section className={styles.projectsSection}>
        <div className={styles.sectionHeaderCenter}>
          <div className={`${styles.sectionEyebrow} ${styles.shimmer}`} />
          <div className={`${styles.sectionTitle} ${styles.shimmer}`} />
          <div className={`${styles.sectionSubtitle} ${styles.shimmer}`} />
        </div>

        <div className={styles.projectsGrid}>
          {/* Card 1 */}
          <div className={styles.projectCard}>
            <div className={`${styles.projectImagePlaceholder} ${styles.shimmer}`} />
            <div className={styles.projectCardHeader}>
              <div className={`${styles.projectCardTitle} ${styles.shimmer}`} />
              <div className={`${styles.projectCardStatus} ${styles.shimmer}`} />
            </div>
            <div className={styles.projectTagsRow}>
              <div className={`${styles.projectTag} ${styles.shimmer}`} />
              <div className={`${styles.projectTag} ${styles.shimmer}`} />
              <div className={`${styles.projectTag} ${styles.shimmer}`} />
            </div>
            <div className={styles.projectBtnRow}>
              <div className={`${styles.projectBtn} ${styles.shimmer}`} />
              <div className={`${styles.projectBtn} ${styles.shimmer}`} />
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.projectCard}>
            <div className={`${styles.projectImagePlaceholder} ${styles.shimmer}`} />
            <div className={styles.projectCardHeader}>
              <div className={`${styles.projectCardTitle} ${styles.shimmer}`} />
              <div className={`${styles.projectCardStatus} ${styles.shimmer}`} />
            </div>
            <div className={styles.projectTagsRow}>
              <div className={`${styles.projectTag} ${styles.shimmer}`} />
              <div className={`${styles.projectTag} ${styles.shimmer}`} />
              <div className={`${styles.projectTag} ${styles.shimmer}`} />
            </div>
            <div className={styles.projectBtnRow}>
              <div className={`${styles.projectBtn} ${styles.shimmer}`} />
              <div className={`${styles.projectBtn} ${styles.shimmer}`} />
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
