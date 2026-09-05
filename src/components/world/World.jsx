import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import { portfolioSections } from "../../data/portfolioConfig";
import PortfolioObject from "./PortfolioObject";
import CreatureLayer from "../creatures/CreatureLayer";
import ParticleField from "../particles/ParticleField";
import CustomCursor from "../cursor/CustomCursor";
import ThemeToggle from "./ThemeToggle";
import PortfolioExplorer from "../explorers/PortfolioExplorer";
import "./world.css";

export default function World() {
  const { theme, transitioning } = useTheme();
  const [openSectionId, setOpenSectionId] = useState(null);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;

  return (
    <div className={`world world--${theme.mode}`}>
      <CustomCursor />
      <CreatureLayer />
      <ParticleField />
      {transitioning && <div className="theme-veil" />}

      <div className="world__sky" aria-hidden="true" />

      <header className="world__intro">
        <h1>Welcome to my world.</h1>
        <p className="world__intro-sub">
          Please, feel free to roam around and discover what this humble being has to offer.
        </p>
        <p className="world__intro-hint">Nothing here is quite where you expect it to be. Take your time.</p>
      </header>

      <ThemeToggle />

      <main className={`world__clearing ${isMobile ? "is-mobile" : ""}`} aria-label="Portfolio sections">
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
              style={section.position}
              onOpen={setOpenSectionId}
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
