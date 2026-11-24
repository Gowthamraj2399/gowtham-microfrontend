import { CatmullRomCurve3, Shape, Vector3 } from "three";
import { districts, missions } from "../data/content";
import { ISLAND } from "../data/map";
import { monthsBetween } from "../utils/time";

// Map space (0–100, from content.js / map.js) → world units on the XZ plane.
export const SCALE = 2.4;
export const toWorld = (mx, my) => [(mx - 50) * SCALE, (my - 50) * SCALE];

// Per-district camera framing, relative to the district centre:
// `cam` is where the camera sits, `look` where it points. `clear` keeps
// filler buildings out of the district's footprint; `plinth` is the radius of
// the round lot the district sits on (0 = none).
const framing = {
  hero: { cam: [0, 20, 60], look: [0, 12, 0], clear: 24, plinth: 19 },
  about: { cam: [16, 34, 34], look: [0, 25, 0], clear: 16, plinth: 13 },
  skills: { cam: [0, 10, 30], look: [0, 7, -2], clear: 22, plinth: 18 },
  missions: { cam: [0, 26, 64], look: [0, 20, 0], clear: 40, plinth: 28 },
  garage: { cam: [0, 9, 30], look: [0, 4.5, 0], clear: 24, plinth: 20 },
  awards: { cam: [9, 9, 24], look: [0, 5, 0], clear: 16, plinth: 12 },
  phone: { cam: [14, 10, 28], look: [30, 7, 0], clear: 16, plinth: 0 },
};

export const plinth = Object.fromEntries(Object.entries(framing).map(([id, f]) => [id, f.plinth]));

export const stops = districts.map((d) => {
  const [x, z] = toWorld(d.map.x, d.map.y);
  const f = framing[d.id];
  return {
    id: d.id,
    x,
    z,
    clear: f.clear,
    cam: new Vector3(x + f.cam[0], f.cam[1], z + f.cam[2]),
    look: new Vector3(x + f.look[0], f.look[1], z + f.look[2]),
  };
});

export const stopById = Object.fromEntries(stops.map((s) => [s.id, s]));

// Downtown: a tower per company (oldest on the left), height by time spent there.
export const downtownTowers = [...missions].reverse().map((m, i) => ({
  mission: m,
  x: (i - 1.5) * 12,
  h: 16 + monthsBetween(m.startDate, m.endDate) * 0.9,
  w: 9,
}));

export const cameraCurve = new CatmullRomCurve3(stops.map((s) => s.cam), false, "centripetal");
export const lookCurve = new CatmullRomCurve3(stops.map((s) => s.look), false, "centripetal");

// Road past every district in route order (the dashed route on the minimap).
// It runs just in front of each district's lot, on the side the tour camera
// looks from, so it never cuts through a district's buildings.
// Each district contributes two points, either side of its front, ordered in
// the direction of travel, so the road runs *along* the front of the lot and
// then on to the next district instead of cutting across it.
const fronts = stops.map((s, i) => {
  const dx = s.cam.x - s.x;
  const dz = s.cam.z - s.z;
  const len = Math.hypot(dx, dz) || 1;
  const [ux, uz] = [dx / len, dz / len]; // towards the camera
  const [px, pz] = [-uz, ux]; // along the front
  const off = Math.max(plinth[s.id], 8) + 5;
  const half = Math.max(plinth[s.id], 8) * 0.9 + 3;
  const fx = s.x + ux * off;
  const fz = s.z + uz * off;
  const a = new Vector3(fx - px * half, 0.06, fz - pz * half);
  const b = new Vector3(fx + px * half, 0.06, fz + pz * half);
  const prev = stops[Math.max(0, i - 1)];
  const next = stops[Math.min(stops.length - 1, i + 1)];
  const [tx, tz] = [next.x - prev.x, next.z - prev.z]; // overall direction of travel here
  return a.x * tx + a.z * tz <= b.x * tx + b.z * tz ? [a, b] : [b, a];
});

// Rough radius of each district's buildings. Where the stretch between two
// districts would pass too close to either, a detour point goes in beside it.
const keepOut = { hero: 15, about: 11, skills: 14, missions: 24, garage: 18, awards: 4, phone: 4 };

const roadEntry = []; // index of each district's first road point
export const roadPoints = [];
fronts.forEach(([a, b], i) => {
  roadEntry.push(roadPoints.length);
  roadPoints.push(a, b);
  if (i === fronts.length - 1) return;
  const to = fronts[i + 1][0];
  const [sx, sz] = [to.x - b.x, to.z - b.z];
  const len2 = sx * sx + sz * sz || 1;
  [stops[i], stops[i + 1]]
    .map((s) => {
      const t = Math.min(1, Math.max(0, ((s.x - b.x) * sx + (s.z - b.z) * sz) / len2));
      const [cx, cz] = [b.x + sx * t, b.z + sz * t];
      return { s, t, cx, cz, d: Math.hypot(cx - s.x, cz - s.z) };
    })
    .filter(({ s, d }) => d < keepOut[s.id] + 5)
    .sort((p, q) => p.t - q.t)
    .forEach(({ s, cx, cz, d }) => {
      const [nx, nz] = d > 0.01 ? [(cx - s.x) / d, (cz - s.z) / d] : [-sz / Math.sqrt(len2), sx / Math.sqrt(len2)];
      const r = keepOut[s.id] + 8;
      roadPoints.push(new Vector3(s.x + nx * r, 0.06, s.z + nz * r));
    });
});
export const roadCurve = new CatmullRomCurve3(roadPoints, false, "centripetal");

// Curve parameter of the middle of district i's stretch of road.
export const roadParamFor = (i) => (roadEntry[i] + 0.5) / (roadPoints.length - 1);

// Island as a three Shape in (x, -z) so that after rotating it flat, +z matches world z.
export const islandShape = (() => {
  const shape = new Shape();
  const p = (mx, my) => {
    const [x, z] = toWorld(mx, my);
    return [x, -z];
  };
  ISLAND.forEach(([cmd, ...n]) => {
    if (cmd === "M") shape.moveTo(...p(n[0], n[1]));
    else shape.bezierCurveTo(...p(n[0], n[1]), ...p(n[2], n[3]), ...p(n[4], n[5]));
  });
  return shape;
})();

const outline = islandShape.getPoints(24).map((v) => [v.x, -v.y]); // back to world (x, z)

export const insideIsland = (x, z) => {
  let inside = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const [xi, zi] = outline[i];
    const [xj, zj] = outline[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
};

// Deterministic pseudo-random so the city is the same on every load.
export const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// Shared, non-React state written by the camera rig every frame and read by
// the sky: 0 = sunset (start), 1 = night (end of the route).
export const worldTime = { night: 0 };
