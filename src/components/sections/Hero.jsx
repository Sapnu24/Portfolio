import styles from "@/styles/Hero.module.css";
import { SITE, WORK } from "@/data/work";
import BlurFade from "@/components/fx/BlurFade";
import Marquee from "@/components/fx/Marquee";
import NumberTicker from "@/components/fx/NumberTicker";
import { ShareSheet } from "@/components/vengeance/ShareSheet";

const SKILLS = [
  "Long-form & YouTube",
  "Short-form & Reels",
  "Ads & VSLs",
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
      <div className={styles.grid}>
        <div className={styles.copy}>
          <BlurFade immediate delay={0.05}>
            <p className={styles.status}>
              <span className={styles.dot} />
              Video Editing Services · Philippines · Remote
            </p>
          </BlurFade>

          <BlurFade immediate delay={0.12} as="h1" className={styles.name}>
            Sean Marion
            <br />
            <em>Velasco</em>
          </BlurFade>

          <BlurFade immediate delay={0.2}>
            <p className={styles.role}>{SITE.role}</p>
          </BlurFade>

          <BlurFade immediate delay={0.28}>
            <p className={styles.bio}>{SITE.bio}</p>
          </BlurFade>

          <BlurFade immediate delay={0.34}>
            <a
              href={SITE.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.badge}
              title="Verify on my Upwork profile"
            >
              <span className={styles.badgeDot} />
              Upwork Top Rated Plus
              <span className={styles.badgeSep}>/</span>
              Top 3% of freelancers
            </a>
          </BlurFade>

          <BlurFade immediate delay={0.4} className={styles.actions}>
            <a href="#work" className={styles.primary}>
              Watch my work <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className={styles.ghost}>
              Contact me
            </a>
            <ShareSheet url="https://smv-works.netlify.app/" title="Sean Marion Velasco: video editor portfolio" theme="light" />
            <span className={styles.links}>
              <a href={SITE.upwork} target="_blank" rel="noopener noreferrer">
                Upwork
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${SITE.email}`}>Email</a>
            </span>
          </BlurFade>
        </div>

        <BlurFade immediate delay={0.25} className={styles.media}>
          <div className={styles.frame}>
            <video
              src={featured.video}
              poster={featured.poster}
              controls
              playsInline
              preload="metadata"
              className={styles.video}
            />
          </div>
          <p className={styles.caption}>
            <span>Now playing</span> {featured.title.replace("AI avatar long form: ", "")}
          </p>

          <dl className={styles.stats}>
            <div>
              <dt>
                <NumberTicker value={6259} />
              </dt>
              <dd>Upwork hours</dd>
            </div>
            <div>
              <dt>
                <NumberTicker value={300} suffix="+" />
              </dt>
              <dd>Videos edited</dd>
            </div>
            <div>
              <dt>
                <NumberTicker value={5} decimals={1} />
              </dt>
              <dd>Client rating</dd>
            </div>
          </dl>
        </BlurFade>
      </div>

      <div className={styles.marqueeWrap}>
        <Marquee items={SKILLS} />
      </div>
    </section>
  );
}
