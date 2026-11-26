import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Light / dark switch that sits at the end of the top navbar. Inline styles so Bootstrap's button reset can't override it.
export default function ThemeButton() {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      style={{
        display: "grid",
        placeItems: "center",
        width: 30,
        height: 30,
        margin: 0,
        padding: 0,
        borderRadius: 999,
        border: "1px solid var(--rv-line)",
        background: "var(--rv-surface)",
        color: "var(--rv-text)",
        cursor: "pointer",
      }}
    >
      {isDark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
    </button>
  );
}
