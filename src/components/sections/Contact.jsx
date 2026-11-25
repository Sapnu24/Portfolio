import styles from "@/styles/Contact.module.css";
import { SITE } from "@/data/work";
import BlurFade from "@/components/fx/BlurFade";
import { ShareSheet } from "@/components/vengeance/ShareSheet";

const SERVICES = [
  "Long-form YouTube editing",
  "Short-form: Reels, TikTok, Shorts",
  "Ads, UGC and VSLs",
  "Eye care and healthcare education videos",
  "Travel vlogs",
  "AI talking heads and AI video workflows",
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

        <BlurFade delay={0.14} className={styles.buttons}>
          <a className={styles.primary} href={SITE.upwork} target="_blank" rel="noopener noreferrer">
            Hire me on Upwork <span aria-hidden="true">→</span>
          </a>
          <a className={styles.ghost} href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className={styles.ghost} href={`mailto:${SITE.email}`}>
            Email me
          </a>
          <ShareSheet url="https://smv-works.netlify.app/" title="Sean Marion Velasco: video editor portfolio" theme="light" />
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
