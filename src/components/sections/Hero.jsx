import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import {
  ArrowRight,
  Mail,
  Code2,
  Briefcase,
  Sparkles,
  Terminal,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { getHeroProfile, getCachedHeroProfile, DEFAULT_PROFILE } from "@/services/profileServices";
import { getProjectCount, getCachedProjectCount } from "@/services/projectServices";
import { getBannerSkills, getCachedBannerSkills, DEFAULT_BANNER_SKILLS } from "@/services/bannerSkillsServices";
import { getTechIcon } from "@/utils/techIcons";
import styles from "@/styles/Hero.module.css";

const getInitialHeroSkills = () => {
  const list = getCachedBannerSkills();
  const inHero = list.filter((s) => s.showInHero && s.isVisible !== false);
  if (inHero.length > 0) return inHero.slice(0, 12);
  return list.filter((s) => s.isVisible !== false).slice(0, 12);
};

export default function Hero() {
  const [profile, setProfile] = useState(getCachedHeroProfile);
  const [projectCount, setProjectCount] = useState(getCachedProjectCount);
  const [allBannerSkills, setAllBannerSkills] = useState(getCachedBannerSkills);
  const [heroSkills, setHeroSkills] = useState(getInitialHeroSkills);
  const [activeCodeTab, setActiveCodeTab] = useState("overview");

  useEffect(() => {
    async function loadHeroData() {
      try {
        const [profileData, count, skillsData] = await Promise.all([
          getHeroProfile(),
          getProjectCount(),
          getBannerSkills(),
        ]);
        if (profileData) setProfile(profileData);
        if (typeof count === "number") setProjectCount(count);
        if (Array.isArray(skillsData) && skillsData.length > 0) {
          setAllBannerSkills(skillsData);
          const inHero = skillsData.filter((s) => s.showInHero && s.isVisible !== false);
          const activeSkills = inHero.length > 0
            ? inHero.slice(0, 12)
            : skillsData.filter((s) => s.isVisible !== false).slice(0, 12);

          setHeroSkills((prev) => {
            const prevIds = prev.map((s) => s.id || s.name).join(",");
            const nextIds = activeSkills.map((s) => s.id || s.name).join(",");
            return prevIds === nextIds ? prev : activeSkills;
          });
        }
      } catch (err) {
        console.error("Error loading hero data:", err);
      }
    }
    loadHeroData();
  }, []);

  const displayExperience = profile.yearsExperience || "1+";
  const statExperience = String(profile.yearsExperience || "1+")
    .replace(/\s*(years?|yrs?|exp|experience)/gi, "")
    .trim() || "1+";
  // Safely display actual number of completed projects without the '+'
  const displayProjects = String(projectCount);

  // Compute remaining banner skills that are not already featured in hero
  const visibleBannerSkills = allBannerSkills.filter((s) => s.isVisible !== false);
  const heroSkillIds = new Set(heroSkills.map((s) => s.id || s.name));
  const remainingBannerSkillsCount = Math.max(
    0,
    visibleBannerSkills.filter((s) => !heroSkillIds.has(s.id || s.name)).length
  );

  // Dynamically group skills for the live architecture code window
  const displayedSkillNames = heroSkills.map((s) => s.name);

  return (
    <section id="home" className={styles.hero}>
      {/* Ambient background glow accents */}
      <div className={styles.ambientGlowPrimary} />
      <div className={styles.ambientGlowSecondary} />

      <div className={styles.heroContainer}>
        {/* ======================================================== */}
        {/* LEFT COLUMN: Authority, Identity, Narrative & CTAs      */}
        {/* ======================================================== */}
        <motion.div
          className={styles.leftColumn}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Live Availability & Location Pill */}
          <div className={styles.statusPill}>
            <span className={styles.pulseContainer}>
              <span className={styles.pulseRing} />
              <span className={styles.pulseDot} />
            </span>
            <span className={styles.statusText}>
              <span className={styles.statusTextLong}>Available for Upwork Contracts • Direct Client Delivery</span>
              <span className={styles.statusTextShort}>Upwork Top Rated</span>
            </span>
            <span className={styles.statusDivider}>•</span>
            <span className={styles.locationTag}>Global Remote</span>
          </div>

          {/* Heading Group */}
          <div className={styles.headingGroup}>
            <div className={styles.greetingRow}>
              <span className={styles.greetingPrefix}>
                <Sparkles size={15} className={styles.sparkleIcon} />
                {profile.greeting || "Hi, I'm"}
              </span>
            </div>

            <h1 className={styles.heroName}>
              <span className={styles.nameGradient}>
                {profile.name || "Sean Marion Velasco"}
              </span>
            </h1>

            <div className={styles.roleBadgeWrapper}>
              <h2 className={styles.roleTitle}>
                {profile.role || "Web Developer – Full Stack"}
              </h2>
              <span className={styles.roleSubBadge}>SMV</span>
            </div>
          </div>

          {/* Narrative Bio / Tagline */}
          <p className={styles.bioText}>
            {profile.bio ||
              "Dedicated freelance full-stack developer committed to crafting clean, reliable, and high-performance web applications that help businesses bring their digital vision to life."}
          </p>

          {/* Featured Technology Stack Pills */}
          <div className={styles.techPillsRow}>
            {heroSkills.map((skill) => (
              <span key={skill.id || skill.name} className={styles.techPill}>
                {getTechIcon(skill.iconKey || skill.name, 14)}
                <span>{skill.name}</span>
              </span>
            ))}
            {remainingBannerSkillsCount > 0 && (
              <a
                href="#skills"
                className={`${styles.techPill} ${styles.techPillMore}`}
                title={`${remainingBannerSkillsCount} more technologies in the banner carousel below`}
              >
                <span>+{remainingBannerSkillsCount}</span>
              </a>
            )}
          </div>

          {/* Action CTAs & Social Bar */}
          <div className={styles.ctaAndSocialWrapper}>
            <div className={styles.actionGroup}>
              <a href="#projects" className={styles.primaryBtn}>
                <span>Explore My Work</span>
                <span className={styles.projectCountBadge}>{displayProjects}</span>
                <ArrowRight size={17} className={styles.btnArrow} />
              </a>

              <div className={styles.secondaryActionRow}>
                <a
                  href={profile.upworkUrl || "https://www.upwork.com/freelancers/~01c5be6cda3726622f?mp_source=share"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryBtn}
                  title="Hire Sean Marion Velasco on Upwork"
                >
                  <Sparkles size={16} />
                  <span>Hire Me on Upwork</span>
                </a>

                <a href="#contact" className={styles.secondaryBtn}>
                  <Mail size={16} />
                  <span>Contact Me</span>
                </a>
              </div>
            </div>

            {/* Social Icons Bar */}
            <div className={styles.socialBar}>
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  title="GitHub"
                  className={styles.socialIcon}
                >
                  <FaGithub size={19} />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                  className={styles.socialIcon}
                >
                  <FaLinkedin size={18} />
                </a>
              )}
              {profile.upworkUrl && (
                <a
                  href={profile.upworkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Upwork Profile"
                  title="Upwork"
                  className={styles.socialIcon}
                >
                  <SiUpwork size={18} />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send Email"
                  title="Email Sean Marion Velasco"
                  className={styles.socialIcon}
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Interactive Glass Developer Deck & HUD    */}
        {/* ======================================================== */}
        <motion.div
          className={styles.rightColumn}
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glass Code Editor Deck */}
          <div className={styles.codeDeckCard}>
            {/* MacOS Window Top Header */}
            <div className={styles.deckHeader}>
              <div className={styles.windowControls}>
                <span className={`${styles.controlDot} ${styles.dotRed}`} />
                <span className={`${styles.controlDot} ${styles.dotYellow}`} />
                <span className={`${styles.controlDot} ${styles.dotGreen}`} />
              </div>

              <div className={styles.deckTabs}>
                <button
                  type="button"
                  className={`${styles.deckTab} ${activeCodeTab === "overview" ? styles.deckTabActive : ""
                    }`}
                  onClick={() => setActiveCodeTab("overview")}
                >
                  <Terminal size={13} />
                  <span className={styles.tabNameFull}>smv.config.js</span>
                  <span className={styles.tabNameShort}>smv.js</span>
                </button>
                <button
                  type="button"
                  className={`${styles.deckTab} ${activeCodeTab === "stack" ? styles.deckTabActive : ""
                    }`}
                  onClick={() => setActiveCodeTab("stack")}
                >
                  <Code2 size={13} />
                  <span className={styles.tabNameFull}>architecture.json</span>
                  <span className={styles.tabNameShort}>stack.json</span>
                </button>
              </div>
            </div>

            {/* Code Body Content */}
            <div className={styles.deckBody}>
              {activeCodeTab === "overview" ? (
                <pre className={styles.codeSnippet}>
                  <code>
                    <span className={styles.tokenKeyword}>const</span>{" "}
                    <span className={styles.tokenVariable}>developer</span>{" "}
                    <span className={styles.tokenOperator}>=</span> {"{"}
                    {"\n"}  <span className={styles.tokenProperty}>name</span>:{" "}
                    <span className={styles.tokenString}>
                      "{profile.name || "Sean Marion Velasco"}"
                    </span>,
                    {"\n"}  <span className={styles.tokenProperty}>role</span>:{" "}
                    <span className={styles.tokenString}>
                      "{profile.role || "Web Developer – Full Stack"}"
                    </span>,
                    {"\n"}  <span className={styles.tokenProperty}>specialization</span>: [
                    {"\n"}    <span className={styles.tokenString}>"Full-Stack Web Development"</span>,
                    {"\n"}    <span className={styles.tokenString}>"Client-Focused Solutions"</span>,
                    {"\n"}    <span className={styles.tokenString}>"Responsive Applications"</span>
                    {"\n"}  ],
                    {"\n"}  <span className={styles.tokenProperty}>experience</span>:{" "}
                    <span className={styles.tokenString}>"{displayExperience} in freelance & production"</span>,
                    {"\n"}  <span className={styles.tokenProperty}>completedProjects</span>:{" "}
                    <span className={styles.tokenNumber}>{projectCount}</span>,
                    {"\n"}  <span className={styles.tokenProperty}>upworkStatus</span>:{" "}
                    <span className={styles.tokenString}>"100% Job Success • Top Rated"</span>
                    {"\n"}{"}"};
                  </code>
                </pre>
              ) : (
                <pre className={styles.codeSnippet}>
                  <code>
                    {"{\n"}  <span className={styles.tokenProperty}>"leadDeveloper"</span>: <span className={styles.tokenString}>"Sean Marion Velasco"</span>,
                    {"\n"}  <span className={styles.tokenProperty}>"primaryFocus"</span>: <span className={styles.tokenString}>"Modern Full-Stack Web Development"</span>,
                    {"\n"}  <span className={styles.tokenProperty}>"clientApproach"</span>: <span className={styles.tokenString}>"High-Quality, Reliable Delivery"</span>,
                    {"\n"}  <span className={styles.tokenProperty}>"featuredTech"</span>: [
                    {displayedSkillNames.slice(0, 4).map((skillName, i) => (
                      <span key={i}>
                        {"\n"}    <span className={styles.tokenString}>"{skillName}"</span>{i < Math.min(displayedSkillNames.length, 4) - 1 ? "," : ""}
                      </span>
                    ))}
                    {"\n  ]"},
                    {"\n"}  <span className={styles.tokenProperty}>"standards"</span>: [
                    {"\n"}    <span className={styles.tokenString}>"Clean Architecture"</span>,
                    {"\n"}    <span className={styles.tokenString}>"Scalable Database Design"</span>,
                    {"\n"}    <span className={styles.tokenString}>"Rigorous QA & Testing"</span>
                    {"\n  ]"},
                    {"\n"}  <span className={styles.tokenProperty}>"jobSuccessRate"</span>: <span className={styles.tokenString}>"100%"</span>
                    {"\n}"}
                  </code>
                </pre>
              )}
            </div>

            {/* Deck Footer Live Status Bar */}
            <div className={styles.deckFooter}>
              <div className={styles.deckStatusLeft}>
                <CheckCircle2 size={13} color="#10b981" />
                <span className={styles.statusTextFull}>Verified Upwork Track Record • Top Rated</span>
                <span className={styles.statusTextShort}>Top Rated</span>
              </div>
              <div className={styles.deckStatusRight}>
                <span>UTF-8</span>
                <span>{activeCodeTab === "overview" ? "JavaScript / Config" : "JSON / Architecture"}</span>
              </div>
            </div>
          </div>

          {/* Floating HUD Stat Widgets */}
          <div className={styles.floatingStatsContainer}>
            <div className={styles.hudStatCard}>
              <div className={styles.hudTopRow}>
                <div className={styles.hudIconWrapper}>
                  <Briefcase size={16} />
                </div>
                <strong className={styles.hudNumber}>{displayProjects}+</strong>
              </div>
              <span className={styles.hudLabel}>Projects Completed</span>
            </div>

            <div className={styles.hudStatCard}>
              <div className={styles.hudTopRow}>
                <div className={styles.hudIconWrapper}>
                  <Code2 size={16} />
                </div>
                <strong className={styles.hudNumber}>{statExperience}</strong>
              </div>
              <span className={styles.hudLabel}>Years Experience</span>
            </div>

            <div className={styles.hudStatCard}>
              <div className={styles.hudTopRow}>
                <div className={styles.hudIconWrapper}>
                  <Zap size={16} />
                </div>
                <strong className={styles.hudNumber}>100%</strong>
              </div>
              <span className={styles.hudLabel}>Job Success Rate</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Animated Mouse Scroll Cue */}
      <a
        href="#about"
        className={styles.scrollIndicator}
        aria-label="Scroll to about section"
      >
        <div className={styles.mousePill}>
          <div className={styles.mouseWheel} />
        </div>
        <span className={styles.scrollText}>Scroll to explore</span>
      </a>
    </section>
  );
}
