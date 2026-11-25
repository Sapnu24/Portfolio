import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "smv_portfolio_theme";

function getSystemTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function ThemeProvider({ children }) {
  // The site is black-and-white light only: ignore saved or OS dark preferences.
  const [theme, setThemeState] = useState("light");

  const [hasManualPreference, setHasManualPreference] = useState(true);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    setHasManualPreference(true);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage errors in restricted browsing
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // Real-time listener for OS preference changes when user has no manual override
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia || hasManualPreference) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleOSChange = (e) => {
      setThemeState(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleOSChange);
    return () => mediaQuery.removeEventListener("change", handleOSChange);
  }, [hasManualPreference]);

  // Synchronize DOM attributes and CSS classes with theme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;

    if (theme === "dark") {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      body.classList.add("dark-theme");
      body.classList.remove("light-theme");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      body.classList.add("light-theme");
      body.classList.remove("dark-theme");
    }
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme,
        // Backward-compatibility aliases
        resolvedTheme: theme,
        themeMode: hasManualPreference ? theme : "system",
        setThemeMode: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
