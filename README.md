# Welcome to my world — a living portfolio

A cottagecore-fairy-world portfolio: a forest clearing, reclaimed by
nature, where each abandoned object opens a section of the portfolio.
Built with React + Vite, canvas-driven creatures, a full light/dark
(day/night) theme system, and a Supabase-ready content layer.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed localhost URL. No Supabase setup is required to run
this — every section falls back to local placeholder content in
`src/data/localContent.js` until you connect a database.

## What's actually working right now

- **Theme system** (`src/theme/`): full light "fairy garden" / dark
  "enchanted night" palettes, toggled by the sun/moon button (top
  right), with an animated dusk/dawn transition veil.
- **Custom cursor** (`src/components/cursor/`): ladybug in light mode,
  crystal in dark mode, with hover and click states. Disabled
  automatically on touch/coarse-pointer devices.
- **Creature engine** (`src/components/creatures/CreatureLayer.jsx`):
  one canvas, no per-creature DOM nodes. Butterflies + dragonflies in
  daylight; fireflies + blue wisps at night. Randomized wandering,
  cursor-avoidance, and click interactions (pixie dust bursts,
  firefly startle-dim, wisp dissolve/flee) all work today.
- **Portfolio objects** (`src/components/world/PortfolioObject.jsx`):
  laptop, book, art tablet, sapling, and psychology pin, each with a
  hover reaction — vines grow in daylight, mushrooms appear at night.
- **Navigation architecture** (`src/data/portfolioConfig.js`): a
  single array drives every object on the map. Add a new
  `{ id, title, objectType, position, explorer }` entry here (plus a
  matching icon in `PortfolioObject.jsx` and a component in
  `src/components/explorers/`) to add a whole new section — nothing
  else needs to change.
- **Laptop OS** (`LaptopExplorer.jsx` + `Folder.jsx`): a real,
  reusable, animated, color-customizable folder system with a file
  detail modal.
- **Writings, Illustrations, Advocacy, Psychology explorers**: working
  read views wired to the same content API, currently reading
  placeholder data.
- **Accessibility**: keyboard focus states, `prefers-reduced-motion`
  respected (creatures go static, particles disable, transitions
  shorten), semantic modal dialogs with Escape-to-close.
- **Mobile**: objects collapse into a tappable list instead of a
  scattered map, custom cursor and hover-only interactions are
  disabled, and creature/particle counts drop.

## Adding your real content

Two ways to do this, and you can switch from the first to the second
at any time without changing any component:

1. **Quick and local**: edit `src/data/localContent.js` directly.
   Good for getting real words and images in before Supabase exists.
2. **Supabase (recommended for the long run)**: create a Supabase
   project, run `supabase/schema.sql` in its SQL editor, then set
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see
   `.env.example`) locally and in Netlify's environment variable
   settings. `src/data/contentApi.js` will automatically start
   reading from your tables instead of the local file — no other code
   changes needed. Use the Storage tab to create a public
   `portfolio-images` bucket for illustration/writing images, and
   paste the resulting public URLs into your rows.

**Never put your Supabase service-role key anywhere in this repo or
in a `VITE_`-prefixed variable** — only the public anon key is safe to
ship to the browser (Row Level Security in `schema.sql` keeps writes
locked down).

## Deploying

This is a static Vite app — connect the repo to Netlify (or run
`netlify deploy`), build command `npm run build`, publish directory
`dist` (already set in `netlify.toml`). Add the two `VITE_SUPABASE_*`
env vars in Netlify's site settings once you're using Supabase.

## What's a placeholder, on purpose

- All portfolio copy (project descriptions, writings, illustrations,
  advocacy projects, credentials) is placeholder text — replace it in
  `localContent.js` or Supabase.
- Ambient sound is architected for but intentionally not wired up,
  since no audio assets were provided and autoplay should never be
  forced on a visitor.
- Only five portfolio objects are built (per the brief's five core
  sections). Future ones (camera, suitcase, telescope, microphone,
  flower) are one config entry + one icon + one explorer component
  away — see the commented example at the bottom of
  `portfolioConfig.js`.

## Architecture at a glance

```
World
├── ThemeProvider / ThemeToggle      (theme/, world/ThemeToggle.jsx)
├── CustomCursor                     (components/cursor/)
├── CreatureLayer (canvas)           (components/creatures/)
├── ParticleField (ambient CSS)      (components/particles/)
├── PortfolioObject × N              (data-driven from portfolioConfig.js)
└── PortfolioExplorer (router)
    ├── LaptopExplorer  → Folder → file Modal
    ├── WritingExplorer
    ├── IllustrationExplorer
    ├── AdvocacyExplorer
    └── PsychologyExplorer
```

All content flows through `src/data/contentApi.js`, which is the only
file that knows whether it's talking to Supabase or local JSON.
