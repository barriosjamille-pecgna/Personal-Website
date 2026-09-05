import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { themes, applyThemeToDocument } from "./themes";

const ThemeContext = createContext(null);

const STORAGE_KEY = "fairyworld-theme";

function getInitialMode() {
  const saved = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);
  const [transitioning, setTransitioning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    applyThemeToDocument(themes[mode]);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    // Trigger a brief "dusk/dawn" transition overlay, then flip the mode.
    setTransitioning(true);
    const delay = reducedMotion ? 0 : 550;
    window.setTimeout(() => {
      setMode((m) => (m === "light" ? "dark" : "light"));
      window.setTimeout(() => setTransitioning(false), reducedMotion ? 0 : 650);
    }, delay);
  }, [reducedMotion]);

  const value = useMemo(
    () => ({
      mode,
      theme: themes[mode],
      toggleMode,
      transitioning,
      reducedMotion,
    }),
    [mode, toggleMode, transitioning, reducedMotion]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
