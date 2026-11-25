import styles from "@/styles/Section.module.css";
import { FaqAccordion } from "@/components/vengeance/FaqAccordion";
import BlurFade from "@/components/fx/BlurFade";
import { SITE } from "@/data/work";

const ITEMS = [
  {
    question: "How much do you charge?",
    answer: "My rate is $12 per hour. For bigger or ongoing work, we can adjust it depending on the workload.",
  },
  {
    question: "What kinds of videos do you edit?",
    answer:
      "Long-form YouTube videos, short-form (Reels, TikTok, Shorts), ads and UGC, VSLs, travel vlogs, and patient-education videos for eye care, optometry and ophthalmology practices. I also produce AI talking-head videos and motion graphics.",
  },
  {
    question: "Which software do you use?",
    answer:
      "Premiere Pro and CapCut for hand edits. Claude Code and HyperFrames for motion graphics and fast variations. Google Flow and ElevenLabs for AI video and voice. The Tools section explains each one.",
  },
  {
    question: "Do you use AI for everything?",
    answer:
      "No. I use AI where it saves time, like generating clips, voices and captions, and for checking work. I review every video myself before it goes out.",
  },
  {
    question: "How do we work together?",
    answer:
      "You send a brief or raw footage. I send a first cut, you give notes, I revise, and you get the final export in the formats you need. We agree on revisions and timeline before I start.",
  },
  {
    question: "Where are you based?",
    answer: "Magalang, Philippines (GMT+8). I work remotely and we can agree on overlap hours with your team.",
  },
  {
    question: "How do I hire you?",
    answer: (
      <>
        Message me on{" "}
        <a href={SITE.upwork} target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-900 underline">
          Upwork
        </a>{" "}
        or email{" "}
        <a href={`mailto:${SITE.email}`} className="font-semibold text-neutral-900 underline">
          {SITE.email}
        </a>
        .
      </>
    ),
  },
];

export default function Faq() {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>FAQ</p>
          <h2 className={styles.title}>
            Questions, answered. <span className={styles.soft}>Rate, process and tools.</span>
          </h2>
        </BlurFade>
        <BlurFade delay={0.08} className={styles.narrow}>
          <FaqAccordion items={ITEMS} />
        </BlurFade>
      </div>
    </section>
  );
}
