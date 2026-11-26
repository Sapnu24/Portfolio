import styles from "@/styles/About.module.css";
import BlurFade from "@/components/fx/BlurFade";
import SpotlightCard from "@/components/fx/SpotlightCard";
import { CursorCard } from "@/components/vengeance/CursorCard";

const EDITS = [
  "Long-Form YouTube",
  "Short-Form: Reels, TikTok, Shorts",
  "Ads, UGC and VSLs",
  "Travel Vlogs",
  "Eye Care, Optometry and Ophthalmology Education",
  "AI Talking Heads and Motion Graphics",
];

const PATH = [
  ["Feb 2025", "Assistant Video Editor"],
  ["Aug 2025", "Junior Video Editor"],
  ["Feb 2026", "Senior Video Editor"],
];

export default function About() {
  return (
    <section id="nextSection" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>About</p>
          <h2 className={styles.title}>
            I edit videos, and I build the <em>workflows</em> behind them.
          </h2>
          <p className={styles.lead}>
            I am Sean Marion Velasco, a video editor from the Philippines. I edit{" "}
            <CursorCard image="/work/hover-youtube.jpg" description="Long-form YouTube re-edit: pacing, captions and b-roll for a talking-head channel.">
              long-form YouTube
            </CursorCard>{" "}
            and{" "}
            <CursorCard image="/work/avatar-agency-agency_short_07_red-flags.jpg" description="Short-form cut from a finished long form, with kinetic type and motion graphics.">
              short-form
            </CursorCard>{" "}
            videos,{" "}
            <CursorCard image="/work/ugc-telehealth-v3.jpg" description="UGC ad with hook variations, animated price cards and a how-it-works list.">
              ads and VSLs
            </CursorCard>{" "}
            in Premiere Pro and CapCut. I have worked on{" "}
            <CursorCard image="/work/hover-travel.jpg" description="Travel vlog edit: drone footage, animated maps and titles.">
              travel vlogs
            </CursorCard>{" "}
            and{" "}
            <CursorCard image="/work/hover-eyecare.jpg" description="Patient-education VSL for an optometry practice: captions, chapters and graphics.">
              patient-education videos
            </CursorCard>{" "}
            for eye care, optometry and ophthalmology practices. I also build{" "}
            <CursorCard image="/work/lf-avner-practice-guide.jpg" description="AI talking-head video made with my pipeline: generated clips, voice, checks and edit.">
              AI video workflows
            </CursorCard>{" "}
            for my edits.
          </p>
        </BlurFade>

        <div className={styles.bento}>
          <BlurFade delay={0.05} className={`${styles.cell} ${styles.wide}`}>
            <SpotlightCard className={styles.card}>
              <h3 className={styles.cardTitle}>What I edit</h3>
              <ul className={styles.list}>
                {EDITS.map((e, i) => (
                  <li key={e}>
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    {e}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </BlurFade>

          <BlurFade delay={0.1} className={styles.cell}>
            <SpotlightCard className={styles.card}>
              <h3 className={styles.cardTitle}>Specialty Vision</h3>
              <ol className={styles.path}>
                {PATH.map(([when, what]) => (
                  <li key={when}>
                    <span>{when}</span>
                    {what}
                  </li>
                ))}
              </ol>
              <p className={styles.note}>
                Healthcare marketing agency: patient education, practice ads, testimonials and short-form for eye care clinics.
              </p>
            </SpotlightCard>
          </BlurFade>

          <BlurFade delay={0.15} className={styles.cell}>
            <SpotlightCard className={styles.card}>
              <h3 className={styles.cardTitle}>Upwork</h3>
              <p className={styles.big}>Top Rated Plus</p>
              <p className={styles.note}>Top 3% of freelancers. 6,259 hours, $30K+ earned, 5.0 client rating.</p>
            </SpotlightCard>
          </BlurFade>

          <BlurFade delay={0.2} className={styles.cell}>
            <SpotlightCard className={styles.card}>
              <h3 className={styles.cardTitle}>Tools</h3>
              <dl className={styles.tools}>
                <div>
                  <dt>Edit by hand</dt>
                  <dd>Premiere Pro, CapCut</dd>
                </div>
                <div>
                  <dt>Edit with code</dt>
                  <dd>Claude Code, HyperFrames</dd>
                </div>
                <div>
                  <dt>Generate</dt>
                  <dd>Google Flow, ElevenLabs</dd>
                </div>
              </dl>
            </SpotlightCard>
          </BlurFade>

          <BlurFade delay={0.25} className={`${styles.cell} ${styles.wide}`}>
            <SpotlightCard className={styles.card}>
              <h3 className={styles.cardTitle}>Background</h3>
              <p className={styles.note}>
                BS in Information Technology, Pampanga State Agricultural University (2020 to 2024). Earlier work in IT
                support, which is why I build my own tools. English and Tagalog, fluent. Based in Magalang, Pampanga.
              </p>
            </SpotlightCard>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
