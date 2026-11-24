# Portfolio v2 — "Gowtham's City"

An interactive portfolio set in a small, stylized low-poly island city at sunset
(neon / synthwave / poster-art mood). The theme is **inspired by** open-world crime
games but is original: no Rockstar logos, Pricedown font, characters or maps.

v2 lives in `src/v2/` next to v1. v1 components stay untouched until we switch `/` over.

## Interaction model

- **Scroll flythrough + clickable minimap.** Scrolling moves the camera along a fixed
  route through the districts. Clicking the minimap jumps straight to one.
- **Free-roam driving** is a later, optional easter egg (phase 4).

## Districts

| Section      | District                                   | Game-UI touch                          |
|--------------|--------------------------------------------|----------------------------------------|
| Hero         | Aerial sunset shot, name in poster panels  | Loading screen with tips               |
| About        | Rooftop apartment                          | Character stats card                   |
| Technologies | Tech district, skills as billboards        | Skill bars / star levels               |
| Experience   | Downtown, a tower per company (by tenure)  | Jobs as missions, "Mission Passed"     |
| Projects     | Garage / workshop                          | Inspect view with specs                |
| Awards       | Hall-of-fame plaza                         | "Achievement Unlocked" toast           |
| Contact      | In-game phone                              | Phone UI with contacts                 |

## Architecture: one shared store

```
   World (3D, phase 2) ──┐                ┌── Minimap
                         ├─► game store ◄─┼── Mission / achievement toasts
   Quick view (2D)    ───┘   (zustand)    ├── Pause menu, Phone, progress counter
                                          │
                          content.js ─────┘   (all text lives here)
```

- **Store** (`state/useGameStore.js`): active district, visited districts, paused, sound,
  plus a jump request the active driver listens for.
- **Drivers** write to the store. The Quick view decides the active district from the
  panel on screen; the 3D camera (phase 2) decides it from its position on the route.
- **HUD** only reads the store, so it works the same with either driver.
- **Quick view** is also the fallback: no WebGL, reduced motion, weak device, or
  `?mode=quick`.

## Routing

- `portfolio/src/App.js`: lazy `/v2/*` route, so three.js never loads on `/`.
- `container/src/App.js`: `/v2/*` → `PortfolioLazy`.
- When v2 is done: `/` → v2, v1 moves to `/v1`.

## Look and feel

- Palette: navy `#0B0B1E` → violet `#6B2BD9` → pink `#FF3D7F` → orange `#FF8A3D`,
  teal `#2EE6D6` for HUD accents.
- Type: Anton (poster headings), JetBrains Mono (HUD).
- Tilted poster cards, thick borders, halftone texture.
- Tokens are added to the shared `tailwind.config.js` under a `city-` prefix.

## Phases

### Phase 1 — Foundation (no 3D)

```
src/v2/
  index.js              entry; picks World or Quick view
  data/content.js       all content
  state/useGameStore.js
  hud/                  Minimap, Progress, Toast, PauseMenu, Phone, LoadingScreen, Hud
  quick/                QuickView + one panel per district
```

Done when `/v2` shows every section, the minimap navigates, toasts fire on first visit,
the phone and resume download work, mobile looks right, `/` is unchanged, and both the
portfolio and container builds pass.

### Phase 2 — The 3D world

- Dependencies: `three`, `@react-three/fiber`, `@react-three/drei`.
- `world/Scene.js`: Canvas, sunset sky, fog, lights, capped pixel ratio.
- `world/City.js`: island, roads, district layout (Kenney CC0 low-poly kits + primitives).
- `world/districts/*`: towers sized by tenure, skill billboards, garage, trophy plaza, rooftop.
- `world/CameraRig.js`: drei `ScrollControls` + a curve through one waypoint per district;
  nearest waypoint → active district; minimap jumps scroll to that waypoint.
- `world/Hotspots.js`: in-scene labels that open detail cards.

### Phase 3 — Polish

`@react-three/postprocessing` bloom and color grading, full loading screen with tips,
toast animations, optional sound (muted by default).

### Phase 4 — Optional

Free-roam driving mode in the phase 2 city.

## Known issues (deferred until the phases are done)

- **Firefox scroll lag (Quick view).** Improved from ~112ms to ~24ms per frame
  (v1 is ~12ms), measured with puppeteer-core driving the installed Firefox, but
  still noticeably less smooth than v1 for the user. Fixed so far: no
  `backdrop-filter`, nothing full-screen animates on scroll, no `mask-image` on
  page-tall layers. Rules are commented in `quick/Backdrop.js` and `v2.css`.
  Next suspects: framer-motion `whileInView` reveals firing during scroll,
  the many `poster` shadows/halftones, image decode of large PNGs.

## Costs and risks

- three.js adds roughly 600KB+; only `/v2` pays for it.
- The portfolio's webpack config shares all its dependencies; harmless, since the
  container doesn't use three.js.
- Phase 2 (modelling and art direction) is where most of the time goes.
