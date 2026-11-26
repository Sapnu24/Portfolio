import styles from "@/styles/Section.module.css";
import { SITE } from "@/data/work";
import BlurFade from "@/components/fx/BlurFade";

// Google Calendar appointment schedule embedded in the page, so visitors pick a slot without leaving the site.
export default function BookCall() {
  const embed = `${SITE.booking}${SITE.booking.includes("?") ? "&" : "?"}gv=true`;

  return (
    <section id="book" className={styles.section}>
      <div className={styles.container}>
        <BlurFade>
          <p className={styles.label}>Book a call</p>
          <h2 className={styles.title} style={{ marginBottom: "1rem" }}>
            Free 30-minute discovery call. <span className={styles.soft}>Pick a time that works for you.</span>
          </h2>
          <p style={{ margin: "0 0 2rem", maxWidth: "40rem", lineHeight: 1.7, color: "var(--rv-body)" }}>
            We talk about your videos, your goals and what you need edited, then plan the next steps. Times show in your
            own timezone and the Google Meet link is sent after you book.
          </p>
        </BlurFade>

        <div
          style={{
            border: "1px solid var(--rv-text)",
            borderRadius: 12,
            overflow: "hidden",
            background: "#ffffff",
            boxShadow: "4px 4px 0 0 var(--rv-text), var(--rv-btn-shadow)",
          }}
        >
          <iframe
            src={embed}
            title="Book a 30-minute discovery call with Sean"
            loading="lazy"
            style={{ display: "block", width: "100%", height: 640, border: 0 }}
          />
        </div>
        <p style={{ margin: "1rem 0 0", fontSize: "0.85rem", color: "var(--rv-muted)" }}>
          Calendar not loading?{" "}
          <a href={SITE.booking} target="_blank" rel="noopener noreferrer" style={{ color: "var(--rv-text)" }}>
            Open the booking page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
