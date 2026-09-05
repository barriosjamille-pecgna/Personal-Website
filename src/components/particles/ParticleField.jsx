import { useMemo } from "react";
import { useTheme } from "../../theme/ThemeContext";
import "./particleField.css";

// Ambient background dust — pure CSS keyframes, no JS animation loop.
// Cheap regardless of count since transform/opacity are composited.
export default function ParticleField() {
  const { reducedMotion } = useTheme();
  const count = reducedMotion ? 0 : (window.matchMedia("(max-width: 720px)").matches ? 8 : 18);

  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
        size: 2 + Math.random() * 3,
      })),
    [count]
  );

  if (!motes.length) return null;

  return (
    <div className="particle-field" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="particle-mote"
          style={{
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            width: m.size,
            height: m.size,
          }}
        />
      ))}
    </div>
  );
}
