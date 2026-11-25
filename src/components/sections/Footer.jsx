import styles from "@/styles/Footer.module.css";
import { SITE } from "@/data/work";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <div>
          <p className={styles.logo}>
            Sean Marion Velasco<span>.</span>
          </p>
          <p className={styles.tagline}>Video editing for YouTube, ads and healthcare practices, plus AI video production workflows.</p>
        </div>
        <nav className={styles.links} aria-label="Contact links">
          <a href={SITE.upwork} target="_blank" rel="noopener noreferrer">
            Upwork
          </a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${SITE.email}`}>Email</a>
        </nav>
      </div>
      <p className={styles.copy}>&copy; {new Date().getFullYear()} Sean Marion Velasco. All rights reserved.</p>
    </footer>
  );
}
