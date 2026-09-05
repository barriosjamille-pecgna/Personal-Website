import { getSectionById } from "../../data/portfolioConfig";
import LaptopExplorer from "./LaptopExplorer";
import WritingExplorer from "./WritingExplorer";
import IllustrationExplorer from "./IllustrationExplorer";
import AdvocacyExplorer from "./AdvocacyExplorer";
import PsychologyExplorer from "./PsychologyExplorer";

// Add new explorer components here as new sections are added to
// portfolioConfig.js. This is the only place that needs to know about
// every explorer that exists.
const EXPLORERS = {
  LaptopExplorer,
  WritingExplorer,
  IllustrationExplorer,
  AdvocacyExplorer,
  PsychologyExplorer,
};

export default function PortfolioExplorer({ sectionId, onClose }) {
  const section = getSectionById(sectionId);
  if (!section) return null;
  const Explorer = EXPLORERS[section.explorer];
  if (!Explorer) return null;
  return <Explorer section={section} onClose={onClose} />;
}
