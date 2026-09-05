# Adding real artwork

The current build ships with simple placeholder line-art so every
interaction (hover, click, theme switch) works out of the box without
needing any images first. To get the painterly, Studio-Ghibli-ish
feeling described in the brief, you'll want to add real illustrations
— this app can't generate that art for you, but it's built to slot
real images in with zero code changes.

## 1. Background scene (biggest visual impact)

Drop two wide illustrated scenes here:

```
public/assets/scenes/day.jpg     <- daytime fairy-garden clearing
public/assets/scenes/night.jpg   <- the same clearing at night
```

Then edit `src/data/sceneConfig.js`:

```js
export const sceneBackgrounds = {
  light: "/assets/scenes/day.jpg",
  dark: "/assets/scenes/night.jpg",
};
```

**What to generate/commission:** a single wide landscape illustration
(1920px+ wide) of a forest clearing with soft painterly lighting,
depth (foreground grass/flowers, midground trees, background haze),
in the style described in the original brief — cottagecore, warm and
magical for the day version; the same composition re-lit for a
moonlit night version with bioluminescent accents. Keep the *center*
of the image relatively open/uncluttered, since the portfolio objects
and text sit on top of it.

## 2. Individual object art (the "tree frame" idea)

Each portfolio object (laptop, book, art tablet, sapling, pin) can
show a small illustration or GIF instead of the placeholder icon.
Drop files here:

```
public/assets/objects/laptop.png
public/assets/objects/book.gif
...
```

Then uncomment/add the matching `image:` line in
`src/data/portfolioConfig.js` for that section, e.g.:

```js
{
  id: "laptop",
  ...
  image: "/assets/objects/laptop.png",
}
```

It'll automatically render inside a small carved-looking frame (vines
in light mode, glowing lavender in dark mode) instead of the line
icon — square images around 300x300px work best. GIFs work exactly
the same way as static images.

## 3. Gallery / writing images

These already work today with no code changes — just add real image
URLs to your Supabase rows (`illustrations.image_url`,
`writings.images`) or to the placeholder objects in
`src/data/localContent.js` if you're not on Supabase yet. Upload the
actual files to Supabase Storage (a public bucket) and paste the
resulting URL in.

## Where to actually get this art

A few realistic paths, roughly cheapest to most bespoke:
- Generate it yourself with an AI image tool (Midjourney, etc.),
  prompting for "cottagecore fairy garden clearing, painterly,
  Studio Ghibli inspired lighting" and iterating until it matches
  your taste.
- Commission an illustrator (Fiverr, ArtStation, a local artist) —
  this is the way to get something truly one-of-a-kind and avoids any
  copyright ambiguity around AI-generated "in the style of" prompts.
- Draw or paint it yourself if that's a skill you have — the brief's
  whole premise is that this is *your* world.

Whichever you choose, once the files exist, dropping them into the
two folders above and adding the paths is genuinely all it takes —
nothing else in the app needs to change.
