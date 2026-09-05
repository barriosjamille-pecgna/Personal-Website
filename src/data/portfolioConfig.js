// This file is the entire navigation architecture for the world.
// To add a new object/section later (camera -> photography, etc.),
// add one entry here and drop a matching Explorer component in
// src/components/explorers/. Nothing else needs to change.
//
// `position` is a percentage-based {x, y} placed within the World's
// clearing on desktop; on mobile these are ignored and objects stack
// in `order` sequence instead.

export const portfolioSections = [
  {
    id: "laptop",
    order: 1,
    title: "Admin & Technology",
    tagline: "An old machine, still humming under the moss.",
    objectType: "laptop",
    position: { x: 22, y: 62 },
    explorer: "LaptopExplorer",
  },
  {
    id: "writings",
    order: 2,
    title: "Writings",
    tagline: "Pages someone left open in the rain, mostly dry.",
    objectType: "book",
    position: { x: 62, y: 70 },
    explorer: "WritingExplorer",
  },
  {
    id: "illustrations",
    order: 3,
    title: "Illustrations",
    tagline: "A sketchbook, half-claimed by ivy.",
    objectType: "tablet",
    position: { x: 78, y: 40 },
    explorer: "IllustrationExplorer",
  },
  {
    id: "advocacy",
    order: 4,
    title: "Advocacy",
    tagline: "Something small, still growing.",
    objectType: "sapling",
    position: { x: 40, y: 30 },
    explorer: "AdvocacyExplorer",
  },
  {
    id: "psychology",
    order: 5,
    title: "Psychology & Profession",
    tagline: "A pin, kept long after the coat it belonged to.",
    objectType: "pin",
    position: { x: 12, y: 28 },
    explorer: "PsychologyExplorer",
  },
];

// Example future entries, left here as reference for how easy this is:
// {
//   id: "photography", order: 6, title: "Photography",
//   tagline: "A camera nobody wound back.", objectType: "camera",
//   position: { x: 55, y: 18 }, explorer: "PhotographyExplorer",
// },

export function getSectionById(id) {
  return portfolioSections.find((s) => s.id === id);
}
