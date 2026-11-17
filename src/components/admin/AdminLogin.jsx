import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebaseClient";
import styles from "@/styles/AdminLogin.module.css";

function getFriendlyErrorMessage(err) {
  const code = err.code || "";
  const message = err.message || "";

  if (
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password" ||
    code === "auth/invalid-login-credentials"
  ) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (code === "auth/user-not-found") {
    return "No admin account found with this email. Make sure you added this user in Firebase Console → Authentication → Users.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many failed attempts. Access is temporarily paused for security. Please wait a minute and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Network connection error. Please check your internet connection and try again.";
  }
  if (code === "auth/user-disabled") {
    return "This admin account has been disabled in Firebase.";
  }

  // Fallback for custom or other errors
  return message.replace(/^Firebase:\s*/i, "").replace(/\(auth\/[^)]+\)\.?/i, "").trim() ||
    "Invalid email or password. Please try again.";
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@seanvelasco.dev");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("portfolioAdminSession", "active");
        navigate("/admin/dashboard");
        return;
      } catch (err) {
        console.error("Firebase auth error:", err);
        setError(getFriendlyErrorMessage(err));
        setIsSubmitting(false);
        return;
      }
    }

    // Fallback: Local demo session if Firebase Auth is not configured yet
    setTimeout(() => {
      localStorage.setItem("portfolioAdminSession", "active");
      setIsSubmitting(false);
      navigate("/admin/dashboard");
    }, 500);
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <section className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <span className={styles.loginIcon}>
            <LockKeyhole size={26} />
          </span>
          <div>
            <span className={styles.eyebrow}>Portfolio Admin</span>
            <h1>Sign in to manage your site</h1>
          </div>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label>
            Email address
            <span className={styles.inputWithIcon}>
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label>
            Password
            <span className={styles.inputWithIcon}>
              <LockKeyhole size={17} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          {error && (
            <div
              className={styles.errorText}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>{error}</span>
            </div>
          )}

          <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
            <LockKeyhole size={18} />
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className={styles.loginHint}>
          {isFirebaseConfigured
            ? "Protected with Firebase Authentication."
            : "Firebase Auth not yet configured. Local developer preview mode is active."}
        </p>
        <a className={styles.backLink} href="/">
          Back to portfolio
        </a>
      </section>
    </main>
  );
}