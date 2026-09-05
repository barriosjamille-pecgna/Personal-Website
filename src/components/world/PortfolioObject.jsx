import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import "./portfolioObject.css";

const ICONS = {
  laptop: LaptopIcon,
  book: BookIcon,
  tablet: TabletIcon,
  sapling: SaplingIcon,
  pin: PinIcon,
};

export default function PortfolioObject({ section, style, onOpen, isMobileList }) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[section.objectType] || LaptopIcon;
  const overgrowth = theme.objects.overgrowth; // 'vines' | 'mushrooms'

  return (
    <button
      className={`portfolio-object ${isMobileList ? "is-list" : "is-scattered"} ${hovered ? "is-hovered" : ""}`}
      style={isMobileList ? undefined : { left: `${style.x}%`, top: `${style.y}%` }}
      data-interactive="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => onOpen(section.id)}
      aria-label={`Open ${section.title}`}
    >
      <span className="portfolio-object__icon">
        {section.image ? (
          <ImageFrame src={section.image} alt={section.title} hovered={hovered} overgrowth={overgrowth} />
        ) : (
          <Icon overgrowth={overgrowth} hovered={hovered} />
        )}
      </span>
      <span className="portfolio-object__label">
        <strong>{section.title}</strong>
        <em>{section.tagline}</em>
      </span>
    </button>
  );
}

/* Wraps a real object illustration in a soft glow instead of a hard
   frame — these are cut-out objects (transparent background), not
   photos, so we ground them into the scene with light/shadow rather
   than cropping them into a box. Overgrowth (vines/mushrooms) still
   reacts to hover on top, same as the placeholder icons. */
function ImageFrame({ src, alt, hovered, overgrowth }) {
  return (
    <span className={`image-frame image-frame--${overgrowth} ${hovered ? "is-hovered" : ""}`}>
      <span className="image-frame__glow" aria-hidden="true" />
      <img src={src} alt={alt} loading="lazy" className="image-frame__art" />
      <svg viewBox="0 0 54 64" className="image-frame__overgrowth-svg" aria-hidden="true">
        <Overgrowth overgrowth={overgrowth} hovered={hovered} variant={5} />
      </svg>
    </span>
  );
}

/* ---------------- SVG object glyphs ---------------- */
/* Each icon draws its base object plus an overgrowth layer (vines or
   mushrooms) that becomes more visible on hover, per the brief's
   "nature reacts to hovering" requirement. */

function Overgrowth({ overgrowth, hovered, variant = 0 }) {
  if (overgrowth === "mushrooms") {
    return (
      <g className={`overgrowth mushrooms ${hovered ? "active" : ""}`}>
        <ellipse cx={10 + variant} cy="58" rx="5" ry="3" className="mushroom-cap" />
        <rect x={9 + variant} y="58" width="2" height="4" className="mushroom-stem" />
        <ellipse cx={44 - variant} cy="60" rx="4" ry="2.4" className="mushroom-cap glow" />
        <rect x={43 - variant} y="60" width="1.6" height="3" className="mushroom-stem" />
      </g>
    );
  }
  return (
    <g className={`overgrowth vines ${hovered ? "active" : ""}`}>
      <path d="M4 60 C 10 48, 6 40, 14 30" className="vine-line" />
      <path d="M50 60 C 44 50, 48 42, 40 32" className="vine-line vine-line--b" />
      <circle cx="14" cy="30" r="2.4" className="vine-leaf" />
      <circle cx="40" cy="32" r="2.2" className="vine-leaf" />
    </g>
  );
}

function LaptopIcon({ overgrowth, hovered }) {
  return (
    <svg viewBox="0 0 54 64" width="54" height="64">
      <rect x="6" y="24" width="42" height="26" rx="2" className="obj-fill obj-fill--bark" />
      <rect x="9" y="27" width="36" height="18" rx="1" className="obj-fill obj-fill--glow" />
      <rect x="2" y="50" width="50" height="5" rx="1.5" className="obj-fill obj-fill--bark-deep" />
      <Overgrowth overgrowth={overgrowth} hovered={hovered} />
    </svg>
  );
}

function BookIcon({ overgrowth, hovered }) {
  return (
    <svg viewBox="0 0 54 64" width="54" height="64">
      <path d="M8 20 Q27 12 46 20 L46 52 Q27 44 8 52 Z" className="obj-fill obj-fill--parchment" />
      <line x1="27" y1="16" x2="27" y2="48" className="obj-line" />
      <line x1="34" y1="8" x2="44" y2="46" className="obj-line obj-line--pen" />
      <Overgrowth overgrowth={overgrowth} hovered={hovered} variant={4} />
    </svg>
  );
}

function TabletIcon({ overgrowth, hovered }) {
  return (
    <svg viewBox="0 0 54 64" width="54" height="64">
      <rect x="10" y="12" width="34" height="44" rx="4" className="obj-fill obj-fill--bark" />
      <rect x="14" y="16" width="26" height="34" rx="1" className="obj-fill obj-fill--glow" />
      <path d="M18 40 L26 30 L32 36 L38 26" className="obj-line obj-line--sketch" fill="none" />
      <Overgrowth overgrowth={overgrowth} hovered={hovered} variant={2} />
    </svg>
  );
}

function SaplingIcon({ overgrowth, hovered }) {
  return (
    <svg viewBox="0 0 54 64" width="54" height="64">
      <rect x="24" y="34" width="6" height="24" className="obj-fill obj-fill--bark-deep" />
      <path className={`sapling-leaf ${hovered ? "active" : ""}`} d="M27 34 C 10 30, 6 14, 20 8 C 22 22, 24 28, 27 34 Z" />
      <path className={`sapling-leaf sapling-leaf--b ${hovered ? "active" : ""}`} d="M27 34 C 44 30, 48 14, 34 8 C 32 22, 30 28, 27 34 Z" />
      <Overgrowth overgrowth={overgrowth} hovered={hovered} variant={6} />
    </svg>
  );
}

function PinIcon({ overgrowth, hovered }) {
  return (
    <svg viewBox="0 0 54 64" width="54" height="64">
      <circle cx="27" cy="30" r="16" className="obj-fill obj-fill--bark" />
      <circle cx="27" cy="30" r="11" className="obj-fill obj-fill--glow" />
      <path d="M20 30 a7 7 0 1 1 5 6.5" className="obj-line obj-line--psy" fill="none" />
      <Overgrowth overgrowth={overgrowth} hovered={hovered} variant={3} />
    </svg>
  );
}
