import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import { Mail, Briefcase, Zap, Star, Award } from "lucide-react";
import Button from "@/components/ui/Button";
import styles from "@/styles/Hero.module.css";
import { SITE, WORK } from "@/data/work";

const PILLS = [
  "Long-form & YouTube",
  "Short-form & Reels",
  "DTC & UGC Ads",
  "VSLs",
  "Travel vlogs",
  "Eye care education",
  "Premiere Pro",
  "CapCut",
  "AI video workflows",
  "Google Flow",
  "ElevenLabs",
  "Claude Code",
  "HyperFrames",
];

const featured = WORK.find((w) => w.id === "lf-avner-practice-guide") || WORK[0];

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.ambientGlowPrimary} />
      <div className={styles.ambientGlowSecondary} />

      <div className={styles.heroContainer}>
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.statusPill}>
            <span className={styles.pulseContainer}>
              <span className={styles.pulseRing} />
              <span className={styles.pulseDot} />
            </span>
            <span className={styles.statusText}>
              <span className={styles.statusTextLong}>Open to video editing and AI production roles • Remote</span>
              <span className={styles.statusTextShort}>Open to work</span>
            </span>
            <span className={styles.statusDivider}>•</span>
            <span className={styles.locationTag}>Philippines</span>
          </div>

          <div className={styles.headingGroup}>
            <div className={styles.greetingRow}>
              <span className={styles.greetingPrefix}>
                Hi, I'm
              </span>
            </div>
            <h1 className={styles.heroName}>
              <span className={styles.nameGradient}>{SITE.name}</span>
            </h1>
            <div className={styles.roleBadgeWrapper}>
              <h2 className={styles.roleTitle}>{SITE.role}</h2>
              <span className={styles.roleSubBadge}>SMV</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", fontWeight: 600, opacity: 0.75 }}>
              + Part-time Web Developer (my own tools and side projects)
            </p>
            <a
              href={SITE.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.upworkBadge}
              title="Verify on my Upwork profile"
            >
              <Award size={16} />
              <span>Upwork Top Rated Plus</span>
              <span className={styles.upworkBadgeDivider}>•</span>
              <span>Top 3% of freelancers</span>
            </a>
          </div>

          <p className={styles.bioText}>{SITE.bio}</p>

          <div className={styles.techPillsRow}>
            {PILLS.map((p) => (
              <span key={p} className={styles.techPill}>
                <span>{p}</span>
              </span>
            ))}
          </div>

          <div className={styles.ctaAndSocialWrapper}>
            <div className={styles.actionGroup}>
              <Button variant="primary" size="md" shape="pill" href="#work" showArrow>
                Watch My Work
              </Button>
              <div className={styles.secondaryActionRow}>
                <a
                  href={SITE.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryBtn}
                  title="Sean Marion Velasco on Upwork"
                >
                  <SiUpwork size={16} />
                  <span>Upwork Profile</span>
                </a>
                <a href="#contact" className={styles.secondaryBtn}>
                  <Mail size={16} />
                  <span>Contact Me</span>
                </a>
              </div>
            </div>
            <div className={styles.socialBar}>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className={styles.socialIcon}>
                <FaLinkedin size={19} />
              </a>
              <a href={SITE.upwork} target="_blank" rel="noopener noreferrer" aria-label="Upwork" title="Upwork" className={styles.socialIcon}>
                <SiUpwork size={18} />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Send Email" title="Email" className={styles.socialIcon}>
                <Mail size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.rightColumn}
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.codeDeckCard}>
            <div className={styles.deckHeader}>
              <div className={styles.windowControls}>
                <span className={`${styles.controlDot} ${styles.dotRed}`} />
                <span className={`${styles.controlDot} ${styles.dotYellow}`} />
                <span className={`${styles.controlDot} ${styles.dotGreen}`} />
              </div>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>{featured.title}</span>
            </div>
            <div className={styles.deckBody} style={{ padding: 0, background: "#000" }}>
              <video
                src={featured.video}
                poster={featured.poster}
                controls
                playsInline
                preload="metadata"
                style={{ width: "100%", display: "block" }}
              />
            </div>
            <div className={styles.deckFooter}>
              <div className={styles.deckStatusLeft}>
                <span>AI avatar video: generated, voiced and edited with my pipeline</span>
              </div>
            </div>
          </div>

          <div className={styles.floatingStatsContainer}>
            <div className={styles.hudStatCard}>
              <div className={styles.hudTopRow}>
                <div className={styles.hudIconWrapper}><Briefcase size={16} /></div>
                <strong className={styles.hudNumber}>6,259</strong>
              </div>
              <span className={styles.hudLabel}>Upwork Hours</span>
            </div>
            <div className={styles.hudStatCard}>
              <div className={styles.hudTopRow}>
                <div className={styles.hudIconWrapper}><Zap size={16} /></div>
                <strong className={styles.hudNumber}>300+</strong>
              </div>
              <span className={styles.hudLabel}>Videos Edited</span>
            </div>
            <div className={styles.hudStatCard}>
              <div className={styles.hudTopRow}>
                <div className={styles.hudIconWrapper}><Star size={16} /></div>
                <strong className={styles.hudNumber}>5.0</strong>
              </div>
              <span className={styles.hudLabel}>Client Rating</span>
            </div>
          </div>
        </motion.div>
      </div>

      <a href="#nextSection" className={styles.scrollIndicator} aria-label="Scroll to about section">
        <div className={styles.mousePill}>
          <div className={styles.mouseWheel} />
        </div>
        <span className={styles.scrollText}>Scroll to explore</span>
      </a>
    </section>
  );
}
