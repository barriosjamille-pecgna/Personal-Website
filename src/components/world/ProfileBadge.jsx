import { useState } from "react";
import "./profileBadge.css";

const LEAVES = [
  { top: "2%", left: "48%", delay: "0s", duration: "4.5s", rotate: "-10deg" },
  { top: "18%", left: "84%", delay: "1.1s", duration: "5.2s", rotate: "35deg" },
  { top: "62%", left: "92%", delay: "2.3s", duration: "4.8s", rotate: "70deg" },
  { top: "88%", left: "58%", delay: "0.6s", duration: "5.6s", rotate: "150deg" },
  { top: "80%", left: "10%", delay: "1.8s", duration: "4.9s", rotate: "-150deg" },
  { top: "40%", left: "0%", delay: "3s", duration: "5.1s", rotate: "-70deg" },
  { top: "10%", left: "14%", delay: "2.6s", duration: "4.6s", rotate: "-35deg" },
];

const SPARKLE_COLORS = ["var(--color-gold)", "var(--color-lavender)", "var(--color-crystal)", "var(--color-dusty-pink)"];
const SPARKLE_COUNT = 14;

function makeSparkles() {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle = (i / SPARKLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 55 + Math.random() * 55;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      delay: Math.random() * 140,
      size: 6 + Math.random() * 8,
      color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    };
  });
}

export default function ProfileBadge() {
  const [pulseKey, setPulseKey] = useState(0);
  const [sparkles, setSparkles] = useState([]);

  function handleClick() {
    setPulseKey((k) => k + 1);
    setSparkles(makeSparkles());
    window.setTimeout(() => setSparkles([]), 1000);
  }

  return (
    <button
      type="button"
      className="profile-badge"
      data-interactive="true"
      aria-label="A little portrait, tucked into the branches"
      onClick={handleClick}
    >
      <span className="profile-badge__leaves" aria-hidden="true">
        {LEAVES.map((leaf, i) => (
          <span
            key={i}
            className="profile-badge__leaf"
            style={{
              top: leaf.top,
              left: leaf.left,
              animationDelay: leaf.delay,
              animationDuration: leaf.duration,
              "--leaf-rotate": leaf.rotate,
            }}
          />
        ))}
      </span>
      {pulseKey > 0 && (
        <span key={pulseKey} className="profile-badge__glow-wrap" aria-hidden="true">
          <span className="profile-badge__glow" />
          <span className="profile-badge__glow profile-badge__glow--b" />
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="profile-badge__sparkle"
              style={{
                "--sx": `${s.x}px`,
                "--sy": `${s.y}px`,
                animationDelay: `${s.delay}ms`,
                fontSize: `${s.size}px`,
                color: s.color,
              }}
            >
              ✦
            </span>
          ))}
        </span>
      )}
      <img src="/assets/profile/profile.gif" alt="" className="profile-badge__img" />
    </button>
  );
}
