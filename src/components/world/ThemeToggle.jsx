import { useTheme } from "../../theme/ThemeContext";
import "./themeToggle.css";

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      className="theme-toggle"
      data-interactive="true"
      onClick={toggleMode}
      aria-label={mode === "light" ? "Switch to enchanted night" : "Switch to fairy garden day"}
    >
      <span className="theme-toggle__glyph">{mode === "light" ? "☀" : "☾"}</span>
      <span className="theme-toggle__label">{mode === "light" ? "Dusk falls" : "Dawn breaks"}</span>
    </button>
  );
}
