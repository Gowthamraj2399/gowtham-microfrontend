import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { Vector3 } from "three";
import { useGameStore } from "../state/useGameStore";
import { worldTime } from "./layout";

const HOLD = 0.22;

// Title screen: a slow sweep around the whole island with the sunset behind
// the city. The camera sits opposite the sun and swings ±~30°.
const CENTER = new Vector3(5, 0, 5);
const SUN_AZ = Math.atan2(-120, -700); // where Sky.js hangs the sun disc
const orbit = (time, tall, pos, look) => {
  const a = SUN_AZ + Math.PI + Math.sin(time * 0.05) * 0.4;
  const r = tall ? 300 : 175;
  pos.set(CENTER.x + Math.sin(a) * r, tall ? 90 : 42, CENTER.z + Math.cos(a) * r);
  // Wide screens: aim left of centre so the city sits right of the title text.
  // Phones: aim below it so the city sits above the text at the bottom.
  const fx = (CENTER.x - pos.x) / r;
  const fz = (CENTER.z - pos.z) / r;
  const side = tall ? 0 : 42;
  look.set(CENTER.x + fz * side, tall ? -30 : 10, CENTER.z - fx * side);
}; // share of each segment where the camera rests on a shot

// Ease within a segment with flat ends, so the camera lingers on each shot.
const hold = (u) => {
  const s = Math.min(1, Math.max(0, (u - HOLD) / (1 - 2 * HOLD)));
  return s * s * (3 - 2 * s);
};

// 3D "driver": scroll position of `scrollRef` (a plain scrolling div over the
// canvas) → point along the tour's shots (tour.js). Writes the active district
// to the store; obeys minimap/menu jump requests by scrolling that div.
const CameraRig = ({ scrollRef, tour }) => {
  const { shots, camCurve, lookCurve } = tour;
  const n = shots.length;
  const offset = useRef(0);
  const target = useRef(new Vector3());
  const look = useRef(shots[0].look.clone());
  const pos = useRef(new Vector3());
  const lastIndex = useRef(-1);
  const jump = useGameStore((s) => s.jump);
  const roam = useGameStore((s) => s.roam);
  const started = useGameStore((s) => s.started);

  // First shot of a district, as a 0–1 scroll offset.
  const offsetFor = (id) => Math.max(0, shots.findIndex((s) => s.id === id)) / Math.max(1, n - 1);

  const scrollTo = (id, behavior) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: offsetFor(id) * (el.scrollHeight - el.clientHeight), behavior });
  };

  // On start, after leaving free roam, and when the tour changes (rotating a
  // phone switches between the wide and the phone tour): go to the district
  // the player is in.
  useEffect(() => {
    if (roam) return undefined;
    const id = useGameStore.getState().active;
    const raf = requestAnimationFrame(() => scrollTo(id, "auto"));
    offset.current = offsetFor(id);
    lastIndex.current = Math.round(offset.current * (n - 1));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roam, tour]);

  useEffect(() => {
    if (jump && !useGameStore.getState().roam) scrollTo(jump.id, "smooth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump]);

  useFrame((state, dt) => {
    if (roam) return; // the car's chase camera is in charge
    const el = scrollRef.current;
    if (!started) {
      // Scrolling past the title starts the tour from wherever it got to.
      if (el && el.scrollTop > 4) useGameStore.getState().start();
      orbit(state.clock.elapsedTime, tour.tall, state.camera.position, look.current);
      state.camera.lookAt(look.current);
      worldTime.night = 0;
      return;
    }
    const max = el ? el.scrollHeight - el.clientHeight : 0;
    const goal = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    easing.damp(offset, "current", goal, 0.18, dt);

    const o = offset.current;
    const seg = o * (n - 1);
    const i = Math.min(n - 2, Math.floor(seg));
    const t = n > 1 ? (i + hold(seg - i)) / (n - 1) : 0;

    camCurve.getPoint(t, pos.current);
    lookCurve.getPoint(t, target.current);
    easing.damp3(state.camera.position, pos.current, 0.35, dt);
    easing.damp3(look.current, target.current, 0.35, dt);
    state.camera.lookAt(look.current);

    worldTime.night = o;

    const idx = Math.round(seg);
    if (idx !== lastIndex.current) {
      lastIndex.current = idx;
      useGameStore.getState().setActive(shots[idx].id);
    }
  });

  return null;
};

export default CameraRig;
