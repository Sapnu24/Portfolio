import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import styles from "@/styles/Footer.module.css";
import { getHeroProfile, getCachedHeroProfile } from "@/services/profileServices";

export default function Footer() {
  const [profile, setProfile] = useState(getCachedHeroProfile);

  useEffect(() => {
    async function loadFooterProfile() {
      try {
        const data = await getHeroProfile();
        if (data) setProfile(data);
      } catch {
        // fallback
      }
    }
    loadFooterProfile();
  }, []);

  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.footerContainer}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left Section */}
        <div className={styles.brand}>
          <h2 className={styles.logo}>
            SMV<span className={styles.logoDot}>.</span>
          </h2>
          <p className={styles.tagline}>
            Bespoke full-stack web engineering, scalable cloud systems, and modern digital experiences delivered for global clients.
          </p>
        </div>

        {/* Professional Client Channels */}
        <div className={styles.social}>
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              title="GitHub"
              className={styles.socialBtn}
            >
              <FaGithub size={18} />
            </a>
          )}
          {/* {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
              className={styles.socialBtn}
            >
              <FaLinkedin size={18} />
            </a>
          )} */}
          {profile.upworkUrl && (
            <a
              href={profile.upworkUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Upwork Profile"
              title="Hire on Upwork"
              className={styles.socialBtn}
            >
              <SiUpwork size={17} />
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Send Email"
              title="Email Sean Marion Velasco"
              className={styles.socialBtn}
            >
              <Mail size={17} />
            </a>
          )}
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Sean Marion Velasco (SMV). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
