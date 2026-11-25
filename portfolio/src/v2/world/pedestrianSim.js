import { insideIsland, rng, roadCurve } from "./layout";
import { onPier, solids } from "./cityData";

// Pedestrian simulation, kept free of React / rendering (Pedestrians.js draws it).
// Walkers stroll along both edges of the road and step aside from the car.

const SIDEWALK = 5.2; // from the road centre; street lights stand at 4.2
export const SAMPLES = 700; // sidewalk resolution per side
const DODGE_RADIUS = 6; // from the car or where it'll be in LOOKAHEAD seconds
const CLEAR = 3; // how far from the car's centre line a dodging walker stands
const LOOKAHEAD = 0.7;
const TAIL = 2.6; // car's half-length plus a little

const SHIRTS = ["#FF3D7F", "#2EE6D6", "#FFD23F", "#FF8A3D", "#9b6bff", "#f4ecff", "#3d6bff", "#ff5d5d"];
const SKIN = ["#f1c7a5", "#d9a07a", "#b97a55", "#8d5a3b", "#5e3a26"];
const PANTS = ["#141230", "#2a2560", "#3a3a4a", "#1d3557", "#4a2378"];

export const walkable = (x, z) =>
  (insideIsland(x, z) || onPier(x, z)) &&
  !solids.some((b) => Math.abs(x - b.x) < b.w / 2 + 0.6 && Math.abs(z - b.z) < b.d / 2 + 0.6);

// Sidewalk points either side of the road, with a flag for blocked spots
// (a building corner, the shore) where walkers turn back.
export const buildSidewalks = () => {
  const length = roadCurve.getLength();
  return [1, -1].map((side) => {
    const pts = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const p = roadCurve.getPointAt(t);
      const tan = roadCurve.getTangentAt(t);
      const x = p.x - tan.z * SIDEWALK * side;
      const z = p.z + tan.x * SIDEWALK * side;
      pts.push({ x, z, tx: tan.x, tz: tan.z, nx: -tan.z * side, nz: tan.x * side, ok: walkable(x, z) });
    }
    return { pts, length };
  });
};

export const spawnWalkers = (count, walks) => {
  const r = rng(4242);
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 20) {
    const side = r() < 0.5 ? 0 : 1;
    const u = r();
    if (!walks[side].pts[Math.round(u * SAMPLES)].ok) continue;
    out.push({
      side,
      u,
      dir: r() < 0.5 ? 1 : -1,
      speed: 1.1 + r() * 0.8, // units per second
      lane: (r() - 0.5) * 1.2, // spread across the sidewalk
      phase: r() * Math.PI * 2,
      size: 0.9 + r() * 0.22,
      wait: r() < 0.15 ? 2 + r() * 6 : 0, // some start standing around
      r,
      ox: 0, // current dodge offset
      oz: 0,
      dodgeSide: 0, // +1 / -1 while dodging, 0 otherwise
      shirt: SHIRTS[Math.floor(r() * SHIRTS.length)],
      skin: SKIN[Math.floor(r() * SKIN.length)],
      pants: PANTS[Math.floor(r() * PANTS.length)],
    });
  }
  return out;
};

// Advance one walker by dt. `car` is { x, z, vx, vz } (null when nobody drives).
// Returns where to draw it this frame.
export const stepWalker = (w, walks, dt, car) => {
  const walk = walks[w.side];

  // --- move along the sidewalk, turning back at blocked spots ----------
  let moving = false;
  if (w.wait > 0) w.wait -= dt;
  else {
    const nu = w.u + (w.dir * w.speed * dt) / walk.length;
    const k = Math.round(nu * SAMPLES);
    if (nu <= 0 || nu >= 1 || !walk.pts[k].ok) {
      w.dir = -w.dir;
      if (w.r() < 0.35) w.wait = 1 + w.r() * 3; // look around, then head back
    } else {
      w.u = nu;
      moving = true;
      if (w.r() < dt * 0.02) w.wait = 1.5 + w.r() * 4; // the odd pause
    }
  }

  const p = walk.pts[Math.round(w.u * SAMPLES)];
  let x = p.x + p.nx * w.lane;
  let z = p.z + p.nz * w.lane;

  // --- step aside from the car --------------------------------------------
  let gx = 0;
  let gz = 0;
  if (car) {
    // Nearest point on the stretch the car covers: from its tail to where
    // its centre will be in LOOKAHEAD seconds.
    const v = Math.hypot(car.vx, car.vz);
    const [bx, bz] = v > 0.5 ? [car.x - (car.vx / v) * TAIL, car.z - (car.vz / v) * TAIL] : [car.x, car.z];
    const px = car.x + car.vx * LOOKAHEAD - bx;
    const pz = car.z + car.vz * LOOKAHEAD - bz;
    const len2 = px * px + pz * pz;
    const t = len2 > 0 ? Math.max(0, Math.min(1, ((x - bx) * px + (z - bz) * pz) / len2)) : 0;
    const qx = bx + px * t;
    const qz = bz + pz * t;
    const d = Math.hypot(x - qx, z - qz);
    if (d < DODGE_RADIUS) {
      // Stand CLEAR units to the side of the car's path. A parked car: just
      // back away from it.
      let spot = null;
      if (v > 0.5) {
        const len = Math.sqrt(len2);
        const [ux, uz] = [-pz / len, px / len]; // perpendicular to the path
        const at = (k) => [qx + ux * CLEAR * k, qz + uz * CLEAR * k];
        // Pick a side once per dodge — the side the walker is on (counting
        // any step it already took), or the other if that one is blocked —
        // and keep it, so it doesn't dither in front of the car.
        if (!w.dodgeSide) {
          const here = (x + w.ox - qx) * ux + (z + w.oz - qz) * uz >= 0 ? 1 : -1;
          w.dodgeSide = [here, -here].find((k) => walkable(...at(k))) || here;
        }
        // Its own sidewalk spot already clear, on the side it went to? Then no
        // need to step aside. (Clear on the *other* side doesn't count: going
        // back would cross in front of the car.)
        const lat = ((x - qx) * ux + (z - qz) * uz) * w.dodgeSide;
        if (lat < CLEAR) spot = at(w.dodgeSide);
      } else {
        const [ax, az] = d > 0.3 ? [(x - qx) / d, (z - qz) / d] : [p.nx, p.nz];
        spot = [car.x + ax * (CLEAR + 1), car.z + az * (CLEAR + 1)];
      }
      if (spot) {
        gx = spot[0] - x;
        gz = spot[1] - z;
      }
    }
  }
  if (!gx && !gz) w.dodgeSide = 0;
  const ease = 1 - Math.exp(-dt * (gx || gz ? 12 : 2));
  w.ox += (gx - w.ox) * ease;
  w.oz += (gz - w.oz) * ease;
  x += w.ox;
  z += w.oz;
  const hurrying = Math.hypot(w.ox, w.oz) > 0.4;

  // --- gait -----------------------------------------------------------------
  if (moving || hurrying) w.phase += dt * w.speed * (hurrying ? 9 : 5.5);
  const swing = moving || hurrying ? Math.sin(w.phase) : 0;
  return { x, z, bob: Math.abs(swing) * 0.07, swing, heading: Math.atan2(p.tx * w.dir, p.tz * w.dir) };
};
