import { useEffect, useState } from "react";
import { useTheme } from "../../theme/ThemeContext";

// Real character-by-character typing (not a CSS width trick), so it
// works correctly even when the heading wraps onto two lines on
// narrower screens. Respects prefers-reduced-motion by just showing
// the full text immediately.
export default function TypewriterHeading({ text, speed = 95, as: Tag = "h1", className }) {
  const { reducedMotion } = useTheme();
  const [shown, setShown] = useState(reducedMotion ? text : "");
  const [done, setDone] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, reducedMotion]);

  return (
    <Tag className={className}>
      <span aria-hidden="true">
        {shown}
        {!done && <span className="typewriter-cursor">▏</span>}
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
