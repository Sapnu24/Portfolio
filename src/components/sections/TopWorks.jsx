import { useState } from "react";
import styles from "@/styles/Section.module.css";
import { WORK } from "@/data/work";
import { CylinderCarousel } from "@/components/vengeance/CylinderCarousel";
import VideoDialog from "@/components/fx/VideoDialog";
import BlurFade from "@/components/fx/BlurFade";

// Best short-form pieces, in the order they appear on the carousel.
const TOP_IDS = [
  "ugc-telehealth-v3",
  "ugc-foodcycler",
  "avatar-dam13",
  "ai-ugc-tryon-pink",
  "avatar-agency-agency_short_07_red-flags",
  "ugc-cleanliving",
  "avatar-dam03",
  "ai-ugc-tryon-maroon",
  "avatar-money_short_01_one-marketing-dollar",
  "avatar-overview_short_02_speak-your-language",
  "avatar-dam10",
];

export default function TopWorks() {
  const [open, setOpen] = useState(null);
  const items = TOP_IDS.map((id) => WORK.find((w) => w.id === id)).filter(Boolean);

  return (
    <section id="top-works" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>Top work</p>
          <h2 className={styles.title}>
            Short-form highlights. <span className={styles.soft}>Click one to watch.</span>
          </h2>
        </BlurFade>
      </div>
      <CylinderCarousel items={items} onSelect={setOpen} />
      <VideoDialog item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
