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

  // Split into 4 balanced rows for rich multi-directional infinite marquee
  const rowCount = 4;
  const rows = [[], [], [], []];
  displaySkills.forEach((skill, index) => {
    rows[index % rowCount].push(skill);
  });

  // Track style classes for alternating directions and varied pacing
  const trackClasses = [
    styles.trackLeft1,
    styles.trackRight1,
    styles.trackLeft2,
    styles.trackRight2,
  ];

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
            A curated collection of modern web technologies, frameworks, and engineering tools powering high-performance client applications.
          </p>
        </div>

        {/* 4-Row Multi-Directional Infinite Marquee System */}
        <div className={styles.marqueeContainer}>
          <div className={styles.fadeOverlayLeft} />
          <div className={styles.fadeOverlayRight} />

          {rows.map((rowItems, rowIndex) => {
            if (!rowItems.length) return null;
            // Duplicate 3x for continuous seamless loop
            const duplicated = [...rowItems, ...rowItems, ...rowItems];
            const trackClass = trackClasses[rowIndex % trackClasses.length];

            return (
              <div key={`marquee-row-${rowIndex}`} className={styles.marqueeRow}>
                <div className={`${styles.marqueeTrack} ${trackClass}`}>
                  {duplicated.map((skill, index) => (
                    <div
                      key={`row${rowIndex}-${skill.id || skill.name}-${index}`}
                      className={styles.skillBadge}
                    >
                      <span className={styles.skillIconWrapper}>{renderIcon(skill)}</span>
                      <span className={styles.skillName}>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsBanner;
