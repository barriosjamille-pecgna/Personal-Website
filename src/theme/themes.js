// Central theme definitions. Every color/atmosphere value the app uses
// lives here — components should never hardcode a hex value or branch
// on `mode === 'dark'` directly. They read from useTheme() instead.

export const themes = {
  light: {
    mode: "light",
    colors: {
      bgBase: "#F3ECE0",       // warm cream / parchment
      bgDeep: "#E7DCC7",       // deeper parchment for layered depth
      moss: "#7C9070",
      mossDark: "#5C6E52",
      sage: "#B7C4A8",
      lavender: "#C9BEDD",
      dustyPink: "#D9AFAE",
      bark: "#6B5541",
      gold: "#C9A24B",
      crystal: "#8FBBC9",
      ink: "#3A3227",          // primary text
      inkSoft: "#5C5344",
      parchmentLine: "#D8C9AE",
    },
    environment: {
      skyTop: "#EFE6D3",
      skyBottom: "#DDCFB0",
      vignette: "rgba(90, 70, 40, 0.10)",
      glowColor: "rgba(201, 162, 75, 0.35)",
    },
    creatures: {
      primary: "flutter",     // butterflies
      secondary: "dragonfly",
      butterflyPalette: ["#C9A24B", "#C9BEDD", "#D9AFAE", "#8FBBC9"],
      dragonflyPalette: ["#7C9070", "#8FBBC9"],
      trailGlow: "rgba(201, 162, 75, 0.5)",
    },
    objects: {
      overgrowth: "vines",       // vines vs mushrooms
      accentGlow: "rgba(143, 187, 201, 0.35)",
    },
    cursor: {
      kind: "ladybug",
    },
  },

  dark: {
    mode: "dark",
    colors: {
      bgBase: "#151C22",       // deep forest / midnight blue
      bgDeep: "#0D1216",
      moss: "#2F4A3B",
      mossDark: "#1D2E25",
      sage: "#3B5245",
      lavender: "#5B4E7A",
      dustyPink: "#6E4A5A",
      bark: "#33261D",
      gold: "#7FD7E0",         // moonlit cyan replaces gold
      crystal: "#8FE1EA",
      ink: "#E7EFEA",          // primary text (light on dark)
      inkSoft: "#B7C7C0",
      parchmentLine: "#2A3A34",
    },
    environment: {
      skyTop: "#101823",
      skyBottom: "#1B2A2E",
      vignette: "rgba(0, 0, 0, 0.35)",
      glowColor: "rgba(127, 215, 224, 0.35)",
    },
    creatures: {
      primary: "firefly",
      secondary: "wisp",
      butterflyPalette: ["#FFE9A8", "#FFF3C9", "#F4E1FF"],
      dragonflyPalette: ["#8FE1EA", "#B9A6FF"],
      trailGlow: "rgba(127, 215, 224, 0.55)",
    },
    objects: {
      overgrowth: "mushrooms",
      accentGlow: "rgba(185, 166, 255, 0.4)",
    },
    cursor: {
      kind: "crystal",
    },
  },
};

export function applyThemeToDocument(theme) {
  const root = document.documentElement;
  const flat = {
    ...Object.fromEntries(Object.entries(theme.colors).map(([k, v]) => [`--color-${camelToKebab(k)}`, v])),
    ...Object.fromEntries(Object.entries(theme.environment).map(([k, v]) => [`--env-${camelToKebab(k)}`, v])),
  };
  Object.entries(flat).forEach(([prop, val]) => root.style.setProperty(prop, val));
  root.setAttribute("data-theme", theme.mode);
}

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
