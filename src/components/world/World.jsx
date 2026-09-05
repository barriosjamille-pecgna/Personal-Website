import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import { portfolioSections } from "../../data/portfolioConfig";
import PortfolioObject from "./PortfolioObject";
import CreatureLayer from "../creatures/CreatureLayer";
import ParticleField from "../particles/ParticleField";
import CustomCursor from "../cursor/CustomCursor";
import ThemeToggle from "./ThemeToggle";
import PortfolioExplorer from "../explorers/PortfolioExplorer";
import ProfileBadge from "./ProfileBadge";
import MessengerOwl from "./MessengerOwl";
import { sceneBackgrounds } from "../../data/sceneConfig";
import "./world.css";

const POSITIONS_KEY = "fairyworld-object-positions";

function loadSavedPositions() {
  try {
    const raw = localStorage.getItem(POSITIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function World() {
  const { theme, transitioning } = useTheme();
  const [openSectionId, setOpenSectionId] = useState(null);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;
  const sceneImage = sceneBackgrounds[theme.mode];
  const clearingRef = useRef(null);

  // Each object's position, seeded from portfolioConfig.js but overridable
  // by dragging — and remembered across visits via localStorage.
  const [positions, setPositions] = useState(() => {
    const saved = loadSavedPositions();
    const initial = {};
    portfolioSections.forEach((s) => {
      initial[s.id] = saved[s.id] || s.position;
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  }, [positions]);

  function handlePositionChange(id, pos) {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  }

  return (
    <div
      className={`world world--${theme.mode} ${sceneImage ? "has-scene-image" : ""}`}
      style={sceneImage ? { backgroundImage: `url(${sceneImage})` } : undefined}
    >
      <CustomCursor />
      <CreatureLayer />
      <ParticleField />
      {transitioning && <div className="theme-veil" />}

      {!sceneImage && <div className="world__sky" aria-hidden="true" />}

      <header className="world__intro">
        <ProfileBadge />
        <h1>Welcome to my world.</h1>
        <p className="world__intro-sub">
          Please, feel free to roam around and discover what this humble being has to offer.
        </p>
      </header>

      <ThemeToggle />
      <MessengerOwl />

      <main
        ref={clearingRef}
        className={`world__clearing ${isMobile ? "is-mobile" : ""}`}
        aria-label="Portfolio sections"
      >
        {isMobile ? (
          <div className="world__list">
            {portfolioSections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <PortfolioObject
                  key={section.id}
                  section={section}
                  isMobileList
                  onOpen={setOpenSectionId}
                />
              ))}
          </div>
        ) : (
          portfolioSections.map((section) => (
            <PortfolioObject
              key={section.id}
              section={section}
              style={positions[section.id]}
              onOpen={setOpenSectionId}
              onPositionChange={handlePositionChange}
              containerRef={clearingRef}
            />
          ))
        )}
      </main>

      <div className="world__ground" aria-hidden="true" />

      {openSectionId && (
        <PortfolioExplorer sectionId={openSectionId} onClose={() => setOpenSectionId(null)} />
      )}
    </div>
  );
}
