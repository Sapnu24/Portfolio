import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Light / dark switch that sits in the top-right corner. Inline styles so Bootstrap's button reset can't override it.
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
        width: 36,
        height: 36,
        margin: 0,
        padding: 0,
        borderRadius: 999,
        border: "1px solid var(--rv-line)",
        background: "var(--rv-surface)",
        color: "var(--rv-text)",
        cursor: "pointer",
      }}
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
