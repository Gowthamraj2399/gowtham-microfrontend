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

**Status: switched.** `/` serves v2 and the original site lives at `/v1`
(both lazy chunks). `/v2/*` redirects to `/` (keeping `?mode=`), in both the
portfolio router and the container. The "Classic site" links point to `/v1`.

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

**Status: built.** How it ended up (differences from the plan above):

- **Scrolling:** a plain scrolling `div` over the canvas (`World.js`), read every
  frame by `CameraRig.js`. drei's `ScrollControls` never attached its scroll
  listener with fiber 9.8 / drei 10.7, so it isn't used.
- **Camera:** rests at each district (flat ends on each segment), and pulls back
  on portrait screens so every district fits on phones.
- **Art:** all procedural, no model files. Filler buildings are one instanced
  mesh, kept clear of districts, the road, the camera's flight path and each
  shot's line of sight. Windows come from a shader in world units
  (`windowMaterial` in `textures.js`), so every building has same-size windows.
- **Text in 3D:** drawn to canvases with the page's web fonts (no font files).
- **Details:** a `LocationCard` in the HUD per district, opening a `DetailSheet`
  that renders the Quick view panels in "sheet" mode (`PanelContext`).
- **Watchdog:** drei `PerformanceMonitor` drops DPR to 1, then switches to the
  Quick view with a toast if it stays slow.
- **Bundle:** three/fiber/drei/maath are excluded from Module Federation sharing
  (`config/sharedDeps.js`); shared modules aren't tree-shaken. 3D code is
  ~1.1MB min / ~300KB gzip, loaded only on `/v2` in 3D mode.

### Phase 3 — Polish

`@react-three/postprocessing` bloom and color grading, full loading screen with tips,
toast animations, optional sound (muted by default).

**Status: built, as a redesign.** The phase 2 look (blurry texture windows, murky
low-contrast scene, a dark boxed-in garage, letterboxed logos) was replaced:

- **Buildings** (`materials.js` → `buildingMaterial`): windows, the colour
  gradient and lit windows are all computed in the shader from world position.
  Crisp at any distance, fade out far away, no textures.
- **Lighting:** a low warm sun with soft shadows; the shadow camera follows the
  view so one 2048 map covers the screen. Reflections come from a drei
  `Environment` built of `Lightformer`s (no HDR download).
- **Post:** bloom only on things brighter than 1.0 (neon trims, signs, street
  lights, lit windows), vignette, ACES tone mapping (the composer turns the
  renderer's own tone mapping off, so it's added back as the last effect).
- **City:** clean round plinths with neon rings under each district, a proper
  road ribbon (asphalt, edge lines, dashed centre) that runs *along* each
  district's front with automatic detours around buildings, neon roof trims on
  about a third of the fillers.
- **Districts:** logos on white cards sized to the logo, labels on the facades,
  an open Garage showroom under a neon arch, a lit pedestal trophy.
- **Watchdog:** under ~45 fps → quality 1 (1× pixels, no shadows); only under
  ~24 fps for three checks in a row → Quick view.
- Not done: sound (left out; nothing to mute), a real loading-progress bar.

### Phase 4 — Optional

Free-roam driving mode in the phase 2 city.

**Status: built.** Car button in the status bar (or Esc menu → Free roam).

- `world/Car.js`: arcade handling, collisions against every building, street
  light and district structure (`cityData.js → solids`), drivable on the island
  and the pier. Chase camera. Reports the district it's in and its position
  (the minimap arrow follows the car).
- Keys: W A S D / arrows, Space brake, Shift boost, R reset. Phones get an
  on-screen pad (`hud/RoamControls.js`). Fast travel teleports the car.
- `cityData.js` is the single source of geometry facts, shared by what is
  drawn and what the car collides with. `spawnFor()` always finds a drivable
  spot on the road beside a district.

## Known issues (deferred until the phases are done)

- **Firefox scroll lag (Quick view).** Improved from ~112ms to ~24ms per frame
  (v1 is ~12ms), measured with puppeteer-core driving the installed Firefox, but
  still noticeably less smooth than v1 for the user. Fixed so far: no
  `backdrop-filter`, nothing full-screen animates on scroll, no `mask-image` on
  page-tall layers. Rules are commented in `quick/Backdrop.js` and `v2.css`.
  Next suspects: framer-motion `whileInView` reveals firing during scroll,
  the many `poster` shadows/halftones, image decode of large PNGs.

## Costs and risks

- The 3D code (three, fiber, drei, postprocessing) is ~1.1MB minified; only
  `/v2` in 3D mode downloads it. These packages are excluded from Module
  Federation sharing (`config/sharedDeps.js`) so they get tree-shaken.
- The 3D world in Firefox hasn't been measured yet; the watchdog is the safety net.
