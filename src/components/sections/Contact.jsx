import styles from "@/styles/Contact.module.css";
import { SITE } from "@/data/work";
import BlurFade from "@/components/fx/BlurFade";
import { ShareSheet } from "@/components/vengeance/ShareSheet";
import DockRow from "@/components/aceternity/DockRow";

const SERVICES = [
  "Long-Form YouTube Editing",
  "Short-Form: Reels, TikTok, Shorts",
  "Ads, UGC and VSLs",
  "Eye Care and Healthcare Education Videos",
  "Travel Vlogs",
  "AI Talking Heads and AI Video Workflows",
];

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>Contact</p>
          <h2 className={styles.title}>
            Let&apos;s work <em>together</em>.
          </h2>
          <p className={styles.sub}>
            Open to video editing projects and roles. Email me with what you are making, or hire me on Upwork.
          </p>
        </BlurFade>

        <BlurFade delay={0.08}>
          <a className={styles.email} href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </BlurFade>

        <BlurFade delay={0.14}>
          <DockRow className={styles.buttons}>
          <a className="sketch-btn sketch-btn--solid" href={SITE.upwork} target="_blank" rel="noopener noreferrer">
            Hire me on Upwork <span aria-hidden="true">→</span>
          </a>
          <a className="sketch-btn" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="sketch-btn" href={`mailto:${SITE.email}`}>
            Email me
          </a>
          <ShareSheet url="https://smv-works.netlify.app/" title="Sean Marion Velasco: video editor portfolio" theme="auto" />
          </DockRow>
        </BlurFade>

        <BlurFade delay={0.2} className={styles.services}>
          <h3>Video editing services</h3>
          <ul>
            {SERVICES.map((s, i) => (
              <li key={s}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ul>
        </BlurFade>
      </div>
    </section>
  );
}
