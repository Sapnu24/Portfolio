import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import styles from "@/styles/SkillsBanner.module.css";
import { getBannerSkills, getCachedBannerSkills, DEFAULT_BANNER_SKILLS } from "@/services/bannerSkillsServices";
import { getTechIcon } from "@/utils/techIcons";

const SkillsBanner = () => {
  const [skillList, setSkillList] = useState(getCachedBannerSkills);

  useEffect(() => {
    async function loadBannerSkills() {
      try {
        const data = await getBannerSkills();
        if (data && data.length > 0) {
          setSkillList(data);
        }
      } catch (err) {
        console.error("Error loading banner skills:", err);
      }
    }
    loadBannerSkills();
  }, []);

  const visibleSkills = skillList.filter((s) => s.isVisible !== false);
  const displaySkills = visibleSkills.length > 0 ? visibleSkills : DEFAULT_BANNER_SKILLS;

  // Split into 2 rows for bi-directional infinite marquee
  const midPoint = Math.ceil(displaySkills.length / 2);
  const firstRow = displaySkills.slice(0, midPoint);
  const secondRow = displaySkills.slice(midPoint);

  // Duplicate for smooth seamless loop
  const rowOneDuplicates = [...firstRow, ...firstRow, ...firstRow];
  const rowTwoDuplicates = [...secondRow, ...secondRow, ...secondRow];

  const renderIcon = (skill) => {
    if (skill.iconUrl) {
      return (
        <img
          src={skill.iconUrl}
          alt={skill.name}
          style={{ width: "17px", height: "17px", objectFit: "contain" }}
        />
      );
    }
    return getTechIcon(skill.iconKey || skill.name, 17);
  };

  return (
    <section className={styles.skillsSection} id="skills">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrowBadge}>
            <Sparkles size={14} />
            <span>Tech Stack & Tools</span>
          </div>
          <h2 className={styles.title}>
            Professional <span className={styles.titleGradient}>Skill Sets</span>
          </h2>
          <p className={styles.subtitle}>
            A curated collection of modern web technologies, frameworks, and engineering tools powering our team's production applications.
          </p>
        </div>

        {/* Dual-Row Bi-Directional Infinite Marquee */}
        <div className={styles.marqueeContainer}>
          <div className={styles.fadeOverlayLeft} />
          <div className={styles.fadeOverlayRight} />

          {/* Row 1: Leftward Glide */}
          <div className={styles.marqueeRow}>
            <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
              {rowOneDuplicates.map((skill, index) => (
                <div key={`row1-${skill.id || skill.name}-${index}`} className={styles.skillBadge}>
                  <span className={styles.skillIconWrapper}>{renderIcon(skill)}</span>
                  <span className={styles.skillName}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Rightward Glide */}
          <div className={styles.marqueeRow}>
            <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
              {rowTwoDuplicates.map((skill, index) => (
                <div key={`row2-${skill.id || skill.name}-${index}`} className={styles.skillBadge}>
                  <span className={styles.skillIconWrapper}>{renderIcon(skill)}</span>
                  <span className={styles.skillName}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsBanner;
