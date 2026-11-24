import { Vector3 } from "three";
import { awards } from "../data/content";
import { cameraCurve, downtownTowers, insideIsland, plinth, rng, roadCurve, roadParamFor, stopById, stops } from "./layout";

// One place for the city's geometry facts, shared by what is drawn (City.js,
// districts) and what the car collides with in free roam (Car.js).

// ---- District dimensions -------------------------------------------------

// Downtown towers are defined in layout.js (the phone tour frames them too).
export { downtownTowers };

// Plinth radius per district lives in layout.js (it also places the road).
export { plinth };

// Solid footprints (world x/z centre, width, depth) the car can't drive through.
const at = (id, dx, dz, w, d) => ({ x: stopById[id].x + dx, z: stopById[id].z + dz, w, d });
export const districtSolids = [
  at("hero", 0, 0, 28, 10),
  at("about", 0, 0, 16, 14),
  ...downtownTowers.map((t) => at("missions", t.x, 0, t.w, t.w)),
  at("garage", 0, -6.5, 34, 1.2),
  at("garage", -16, 0, 1.4, 1.4),
  at("garage", 16, 0, 1.4, 1.4),
  at("awards", 0, 0, 4.5 + (awards.length - 1) * 7, 4.5), // row of pedestals, 7 apart
  at("phone", 34, 0, 7, 3),
];

// ---- Filler buildings ----------------------------------------------------

// Distance in XZ from (x, z) to the segment look-at → camera of a stop,
// optionally extended past the camera by `reach` (1 = up to the camera).
const toSightline = (s, x, z, reach = 1) => {
  const bx = s.look.x;
  const bz = s.look.z;
  const ax = bx + (s.cam.x - bx) * reach;
  const az = bz + (s.cam.z - bz) * reach;
  const len2 = (bx - ax) ** 2 + (bz - az) ** 2 || 1;
  const t = Math.min(1, Math.max(0, ((x - ax) * (bx - ax) + (z - az) * (bz - az)) / len2));
  return Math.hypot(x - (ax + t * (bx - ax)), z - (az + t * (bz - az)));
};

const route = roadCurve.getSpacedPoints(160);
const flight = cameraCurve.getSpacedPoints(200);

export const fillerBuildings = (() => {
  const r = rng(42);
  const downtown = stopById.missions;
  const list = [];
  for (let tries = 0; list.length < 150 && tries < 6000; tries++) {
    const x = -120 + r() * 240;
    const z = -120 + r() * 240;
    if (![[0, 0], [7, 0], [-7, 0], [0, 7], [0, -7]].every(([dx, dz]) => insideIsland(x + dx, z + dz))) continue;
    if (stops.some((s) => Math.hypot(s.x - x, s.z - z) < Math.max(s.clear, plinth[s.id] + 5))) continue;
    if (route.some((p) => Math.hypot(p.x - x, p.z - z) < 8)) continue;
    if (flight.some((p) => Math.hypot(p.x - x, p.z - z) < 10)) continue;
    if (stops.some((s) => toSightline(s, x, z) < 9)) continue;
    // ...and a wider corridor out to where the camera sits on narrower screens
    // (CameraRig pulls back up to 2.2×), so nothing pokes into the frame edges.
    if (stops.some((s) => toSightline(s, x, z, 2.2) < 16)) continue;
    if (list.some((b) => Math.hypot(b.x - x, b.z - z) < 8)) continue;
    const nearDowntown = Math.hypot(x - downtown.x, z - downtown.z) < 60;
    list.push({
      x,
      z,
      w: 4.5 + r() * 3.5,
      d: 4.5 + r() * 3.5,
      h: nearDowntown ? 10 + r() * 12 : 5 + r() * 14,
      tint: r(),
      trim: r() < 0.35 ? Math.floor(r() * 3) : -1, // neon roof trim colour index, or none
    });
  }
  return list;
})();

// ---- Street lights -------------------------------------------------------

export const streetLights = (() => {
  const out = [];
  const n = 80;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = roadCurve.getPointAt(t);
    if (stops.some((s) => Math.hypot(s.x - p.x, s.z - p.z) < Math.max(s.clear, plinth[s.id] + 3))) continue;
    const tan = roadCurve.getTangentAt(t);
    const side = i % 2 ? 1 : -1;
    const x = p.x - tan.z * 4.2 * side;
    const z = p.z + tan.x * 4.2 * side;
    if (flight.some((f) => f.y < 14 && Math.hypot(f.x - x, f.z - z) < 11)) continue;
    out.push({ x, z, teal: i % 4 < 2 });
  }
  return out;
})();

// ---- Free roam -------------------------------------------------------------

export const solids = [
  ...fillerBuildings.map((b) => ({ x: b.x, z: b.z, w: b.w, d: b.d })),
  ...districtSolids,
  ...streetLights.map((l) => ({ x: l.x, z: l.z, w: 0.5, d: 0.5 })),
];

// The pier is drivable even though it's over water.
const pier = { x: stopById.phone.x + 24, z: stopById.phone.z, w: 24, d: 5 };
export const onPier = (x, z) => Math.abs(x - pier.x) < pier.w / 2 && Math.abs(z - pier.z) < pier.d / 2;
export const pierRect = pier;

export const CAR_RADIUS = 1.5;

// Can the car stand at (x, z)? On the island or the pier, and not inside anything.
export const drivable = (x, z) =>
  (insideIsland(x, z) || onPier(x, z)) &&
  !solids.some((b) => Math.abs(x - b.x) < b.w / 2 + CAR_RADIUS && Math.abs(z - b.z) < b.d / 2 + CAR_RADIUS);

// Where the car appears for each district: on the road beside it, facing along
// the road. If that exact spot isn't drivable, search outward along the road.
export const spawnFor = (id) => {
  const i = Math.max(0, stops.findIndex((s) => s.id === id));
  const t0 = roadParamFor(i);
  for (let step = 0; step <= 40; step++) {
    const t = Math.min(1, Math.max(0, t0 + (step % 2 ? 1 : -1) * Math.ceil(step / 2) * 0.004));
    const p = roadCurve.getPoint(t);
    if (!drivable(p.x, p.z)) continue;
    const ahead = roadCurve.getPoint(Math.min(1, t + 0.01));
    const behind = roadCurve.getPoint(Math.max(0, t - 0.01));
    const dir = new Vector3().subVectors(ahead, behind).normalize();
    return { x: p.x, z: p.z, heading: Math.atan2(dir.x, dir.z) };
  }
  const s = stops[i];
  return { x: s.x, z: s.z + plinth[s.id] + 6, heading: Math.PI };
};
