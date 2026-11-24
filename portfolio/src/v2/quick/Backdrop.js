import React, { useEffect, useMemo, useState } from "react";

// Performance rule for this file (measured in Firefox): nothing full-screen
// may animate or change while scrolling. A moving/fading fixed layer made
// Firefox repaint the whole screen every frame (60–110ms/frame). So:
//   • SkyLayer scrolls *with* the page — a long static painting that goes
//     sunset → dusk → night. Time passes as you scroll, at zero cost.
//   • CityLayer is fixed and completely still. The sky sliding behind a still
//     skyline gives parallax for free.

// Deterministic pseudo-random so the art is the same on every load.
const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const skylineUrl = (seed, count, minH, maxH, fill, windowFill) => {
  const r = rng(seed);
  let x = 0;
  let shapes = "";
  for (let i = 0; i < count && x < 1000; i++) {
    const w = 18 + r() * 42;
    const h = minH + r() * (maxH - minH);
    shapes += `<rect x="${x.toFixed(1)}" y="${(300 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}"/>`;
    if (r() > 0.85) shapes += `<rect x="${(x + w / 2 - 1).toFixed(1)}" y="${(300 - h - 14).toFixed(1)}" width="2" height="14" fill="${fill}"/>`;
    for (let wy = 300 - h + 8; wy < 292; wy += 9) {
      for (let wx = x + 4; wx < x + w - 5; wx += 7) {
        if (r() > 0.72) shapes += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3" height="4" fill="${windowFill}"/>`;
      }
    }
    x += w + 1 + r() * 4;
  }
  return svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice">${shapes}</svg>`
  );
};

const starsUrl = (seed) => {
  const r = rng(seed);
  let dots = "";
  for (let i = 0; i < 70; i++) {
    const big = r() > 0.9;
    dots += `<circle cx="${(r() * 600).toFixed(1)}" cy="${(r() * 600).toFixed(1)}" r="${big ? 1.6 : 0.8}" fill="#fff" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`;
  }
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">${dots}</svg>`);
};

const SUN_BG =
  "repeating-linear-gradient(to bottom, transparent 0 58%, rgba(26,11,61,0.9) 58% 61%, transparent 61% 66%, rgba(26,11,61,0.9) 66% 70%, transparent 70% 76%, rgba(26,11,61,0.9) 76% 81%, transparent 81% 100%), linear-gradient(to bottom, #FFD23F, #FF3D7F)";

// Scrolls with the page, behind the city. The sunset block matches the hero's
// height; everything after it is dusk fading to a starry night.
export const SkyLayer = () => {
  const [heroH, setHeroH] = useState(0);
  const stars = useMemo(() => starsUrl(11), []);

  useEffect(() => {
    const hero = document.getElementById("district-hero");
    if (!hero) return undefined;
    const ro = new ResizeObserver(([e]) => setHeroH(Math.round(e.target.offsetHeight)));
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="relative"
        style={{
          height: heroH || "100vh",
          background:
            "linear-gradient(to bottom, #1a0b3d 0%, #5a24c0 35%, #c4307a 62%, #FF8A3D 80%, #b8406e 92%, #3b1460 100%)",
        }}
      >
        <div
          className="absolute left-1/2 bottom-[16vh] w-[60vmin] h-[60vmin] -ml-[30vmin] rounded-full"
          style={{ background: SUN_BG }}
        />
      </div>
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: heroH || "100vh",
          background: "linear-gradient(to bottom, #3b1460 0%, #261458 25%, #14124a 60%, #07071c 100%)",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: stars }} />
        {/* Fades the stars in. A plain gradient on top, not mask-image: a mask
            over this page-tall layer cost Firefox ~50ms per scroll frame. */}
        <div
          className="absolute inset-x-0 top-0 h-[120vh]"
          style={{ background: "linear-gradient(to bottom, #3b1460 0%, rgba(43,20,94,0.85) 35%, rgba(38,20,88,0) 100%)" }}
        />
      </div>
    </div>
  );
};

const still = { backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundSize: "cover" };

// Fixed and never changes. Sits between the sky and the content.
export const CityLayer = () => {
  const far = useMemo(() => skylineUrl(7, 60, 60, 190, "#2a1352", "rgba(255,210,63,0.35)"), []);
  const near = useMemo(() => skylineUrl(21, 50, 40, 150, "#0B0B1E", "rgba(46,230,214,0.55)"), []);
  return (
    <div aria-hidden="true" className="fixed inset-x-0 bottom-0 h-[45vh] z-[1] pointer-events-none">
      {/* City glow: the sunset at first, light pollution once it's night. */}
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{ background: "radial-gradient(60% 70% at 50% 100%, rgba(255,61,127,0.35), rgba(255,61,127,0) 70%)" }}
      />
      <div className="absolute inset-0 opacity-80" style={{ ...still, backgroundImage: far }} />
      <div className="absolute inset-x-0 bottom-0 h-[68%]" style={{ ...still, backgroundImage: near }} />
    </div>
  );
};
