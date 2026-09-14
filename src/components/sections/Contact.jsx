import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, MessageSquare, ExternalLink, Briefcase } from "lucide-react";
import { FaGithub, FaLinkedin, FaPaperPlane } from "react-icons/fa";
import { SiUpwork } from "react-icons/si";
import styles from "@/styles/Contact.module.css";
import { getHeroProfile, getCachedHeroProfile, DEFAULT_PROFILE } from "@/services/profileServices";

const headerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(getCachedHeroProfile);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "Full-Stack Web Application",
    message: "",
  });

  useEffect(() => {
    async function loadContactProfile() {
      try {
        const data = await getHeroProfile();
        if (data) setProfile(data);
      } catch (err) {
        console.error("Error loading contact profile:", err);
      }
    }
    loadContactProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate clean local submission for UI/preview mode without touching personal email
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Section Header with Scroll Reveal */}
        <motion.div
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className={styles.eyebrowBadge}>
            <Sparkles size={14} />
            <span>Initiate Project / Contract</span>
          </div>
          <h2 className={styles.title}>
            Let's Build Something <span className={styles.titleGradient}>Remarkable Together</span>
          </h2>
          <p className={styles.subtitle}>
            Hire Sean Marion Velasco directly on Upwork or send a project inquiry. Let's discuss your requirements and build something exceptional.
          </p>
        </motion.div>

        <div className={styles.contactContainer}>
          {/* Form Column with Scroll Entrance */}
          <motion.div
            className={styles.contactFormCard}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.formHeader}>
              <div className={styles.formIconWrapper}>
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className={styles.formTitle}>Send Me a Message</h3>
                <p className={styles.formSubtitle}>I typically respond within 24 hours with scoping, milestones, and timeline.</p>
              </div>
            </div>

            {submitted ? (
              <div className={styles.successMsg}>
                <CheckCircle2 size={24} className={styles.successIcon} />
                <div>
                  <h4>Inquiry Received Successfully!</h4>
                  <p>Thank you for reaching out to Sean Marion Velasco. I will review your project brief and connect with you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Your Name / Company</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe / TechCorp Inc."
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Business Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="e.g. john@techcorp.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="serviceType" className={styles.label}>Project Scope / Service Required</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={styles.input}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Full-Stack Web Application">Full-Stack Web Application (React + Laravel / Node)</option>
                    <option value="Frontend Architecture & UI/UX">Frontend Architecture & Responsive UI/UX</option>
                    <option value="Backend REST APIs & Database Design">Backend REST APIs & Database Optimization</option>
                    <option value="Dedicated Upwork Agile Sprints">Dedicated Upwork Agile Sprints (Hourly / Milestone)</option>
                    <option value="Other Technical Inquiry">Other Technical Inquiry</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Project Details & Requirements</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Describe your goals, tech preferences, timeline, or Upwork contract scope..."
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.submitBtn}
                >
                  <span>{submitting ? "Sending Inquiry..." : "Send Project Inquiry"}</span>
                  <FaPaperPlane size={14} className={styles.btnIcon} />
                </button>
              </form>
            )}
          </motion.div>

          {/* Info & Channels Column with Scroll Entrance */}
          <motion.div
            className={styles.infoColumn}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Upwork Direct Card */}
            <div className={styles.infoCard} style={{ border: "1px solid rgba(16, 185, 129, 0.35)", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(154, 0, 2, 0.04))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <Briefcase size={20} color="#10b981" />
                <h3 className={styles.infoCardTitle} style={{ margin: 0 }}>Hire Me on Upwork</h3>
              </div>
              <p className={styles.socialText}>
                Work directly with Sean Marion Velasco with full Upwork escrow protection and transparent milestone delivery.
              </p>
              <a
                href={profile.upworkUrl || "https://www.upwork.com/freelancers/~01c5be6cda3726622f?mp_source=share"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.submitBtn}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  textDecoration: "none",
                  padding: "0.65rem 1.25rem",
                  width: "100%",
                }}
              >
                <span>View My Upwork Profile</span>
                <ExternalLink size={15} />
              </a>
            </div>

            {/* Direct Contact Card */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Direct Channels</h3>

              <div className={styles.infoList}>
                <a
                  href={`mailto:${profile.email || "seanmarionvelasco.work@gmail.com"}`}
                  className={styles.infoItem}
                >
                  <div className={styles.infoIconWrapper}>
                    <Mail size={18} />
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>
                      {profile.email || "seanmarionvelasco.work@gmail.com"}
                    </span>
                  </div>
                </a>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <MapPin size={18} />
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Availability</span>
                    <span className={styles.infoValue}>
                      Global Remote Delivery (24/7 Coverage)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Client Channels */}
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Professional Client Channels</h3>
              <p className={styles.socialText}>Direct links to my verified freelance profiles and public code repositories:</p>

              <div className={styles.socialIcons}>
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
                    title="Upwork"
                    className={styles.socialBtn}
                  >
                    <SiUpwork size={17} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
