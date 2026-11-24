import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { easing } from "maath";
import { Vector3 } from "three";
import { districts } from "../data/content";
import { useGameStore } from "../state/useGameStore";
import { SCALE, stops, worldTime } from "./layout";
import { drivable, plinth, spawnFor } from "./cityData";
import { bindKeyboard, input } from "./input";
import { glow } from "./parts";
import { canvasTexture } from "./textures";

// Arcade handling, in world units per second.
const MAX = 26;
const MAX_REVERSE = 9;
const ACCEL = 20;
const BRAKE = 38;
const DRAG = 7;
const free = drivable;
const STEP = 1 / 60; // physics sub-step, seconds

// Soft elliptical glow under the car (a slab of solid colour looked heavy).
const underglow = canvasTexture(128, 128, (ctx, w, h) => {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  g.addColorStop(0, "rgba(255,255,255,0.75)");
  g.addColorStop(0.55, "rgba(255,255,255,0.3)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
});

const Wheel = ({ position, wheelRef }) => (
  <group position={position} ref={wheelRef}>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.44, 0.44, 0.36, 18]} />
      <meshStandardMaterial color="#0b0b1e" roughness={0.6} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.22, 0.22, 0.38, 12]} />
      <meshStandardMaterial color="#c9c2ff" metalness={0.8} roughness={0.25} />
    </mesh>
  </group>
);

// Free-roam car with a chase camera. Drives on the island and the pier,
// collides with buildings, and reports which district it's in.
const Car = () => {
  const car = useRef();
  const wheels = [useRef(), useRef(), useRef(), useRef()];
  const sim = useRef(null);
  const look = useRef(new Vector3());
  const camGoal = useRef(new Vector3());
  const lastReport = useRef(0);
  const jump = useGameStore((s) => s.jump);

  const spawn = (id) => {
    const p = spawnFor(id);
    sim.current = { x: p.x, z: p.z, heading: p.heading, speed: 0, spin: 0 };
  };

  if (!sim.current) spawn(useGameStore.getState().active);

  useEffect(() => bindKeyboard(() => spawn(useGameStore.getState().active)), []);

  // Minimap / menu fast travel teleports the car. Ignore a jump that was
  // already in the store before free roam started.
  const firstJump = useRef(jump);
  useEffect(() => {
    if (jump && jump !== firstJump.current) spawn(jump.id);
  }, [jump]);

  useFrame((state, rawDt) => {
    // Real elapsed time (capped at 0.25 s after a stall), simulated in small
    // fixed steps: the car keeps true speed even on a slow phone, and
    // collisions stay reliable because no single step jumps far.
    const elapsed = Math.min(rawDt, 0.25);
    const dt = elapsed; // camera / visuals (exponential easing is stable at any step)
    const s = sim.current;
    const { menuOpen, sheet, phoneOpen } = useGameStore.getState();
    const paused = menuOpen || sheet || phoneOpen;

    // --- driving ---------------------------------------------------------
    const throttle = paused ? 0 : (input.up ? 1 : 0) - (input.down ? 1 : 0);
    // Keys give full lock; the touch joystick gives an analog amount (-1..1).
    const keySteer = (input.left ? 1 : 0) - (input.right ? 1 : 0);
    const steer = paused ? 0 : Math.max(-1, Math.min(1, keySteer + input.steerAxis));
    const top = input.boost ? MAX * 1.35 : MAX;

    for (let left = elapsed; left > 1e-4; left -= STEP) {
      const h = Math.min(STEP, left);
      if (throttle > 0) s.speed += (s.speed < 0 ? BRAKE : ACCEL) * h;
      else if (throttle < 0) s.speed -= (s.speed > 0 ? BRAKE : ACCEL * 0.6) * h;
      else s.speed -= Math.sign(s.speed) * Math.min(Math.abs(s.speed), DRAG * h);
      if (input.brake && !paused) s.speed -= Math.sign(s.speed) * Math.min(Math.abs(s.speed), BRAKE * 1.4 * h);
      s.speed = Math.max(-MAX_REVERSE, Math.min(top, s.speed));

      const grip = Math.min(1, Math.abs(s.speed) / 7) * Math.sign(s.speed || 1);
      s.heading += steer * 2.1 * grip * h;

      const nx = s.x + Math.sin(s.heading) * s.speed * h;
      const nz = s.z + Math.cos(s.heading) * s.speed * h;
      if (free(nx, nz)) {
        s.x = nx;
        s.z = nz;
      } else if (free(nx, s.z)) {
        s.x = nx;
        s.speed *= 0.8;
      } else if (free(s.x, nz)) {
        s.z = nz;
        s.speed *= 0.8;
      } else {
        s.speed *= -0.25; // bump
      }
      s.spin += (s.speed * h) / 0.44;
    }

    // --- model -------------------------------------------------------------
    car.current.position.set(s.x, 0, s.z);
    car.current.rotation.y = s.heading;
    wheels.forEach((w, i) => {
      if (!w.current) return;
      w.current.rotation.x = s.spin;
      if (i < 2) w.current.rotation.y = steer * 0.35;
    });

    // --- chase camera ------------------------------------------------------
    const fx = Math.sin(s.heading);
    const fz = Math.cos(s.heading);
    const back = s.speed < -1 ? -1 : 1; // look forward even while reversing slowly
    camGoal.current.set(s.x - fx * 13 * back, 6.5, s.z - fz * 13 * back);
    easing.damp3(state.camera.position, camGoal.current, 0.28, dt);
    easing.damp3(look.current, [s.x + fx * 5, 1.6, s.z + fz * 5], 0.15, dt);
    state.camera.lookAt(look.current);

    // --- report position & district ---------------------------------------
    let nearest = null;
    let best = Infinity;
    stops.forEach((st) => {
      const d = Math.hypot(st.x - s.x, st.z - s.z);
      if (d < best) {
        best = d;
        nearest = st;
      }
    });
    const store = useGameStore.getState();
    if (nearest && best < Math.max(plinth[nearest.id], 12) + 10 && store.active !== nearest.id) store.setActive(nearest.id);
    const idx = districts.findIndex((d) => d.id === store.active);
    worldTime.night += (idx / (districts.length - 1) - worldTime.night) * Math.min(1, dt * 1.5);

    lastReport.current += dt;
    if (lastReport.current > 0.12) {
      lastReport.current = 0;
      store.setCar({ mx: s.x / SCALE + 50, my: s.z / SCALE + 50, heading: s.heading });
    }
  });

  return (
    <group ref={car}>
      <RoundedBox args={[2.3, 0.75, 4.6]} radius={0.25} position={[0, 0.78, 0]} castShadow>
        <meshStandardMaterial color="#FF3D7F" metalness={0.55} roughness={0.28} envMapIntensity={1.2} />
      </RoundedBox>
      <RoundedBox args={[1.9, 0.62, 2.2]} radius={0.22} position={[0, 1.38, -0.35]} castShadow>
        <meshStandardMaterial color="#120f2e" metalness={0.9} roughness={0.08} envMapIntensity={1.5} />
      </RoundedBox>
      <mesh position={[0, 1.32, -2.15]} castShadow>
        <boxGeometry args={[2.2, 0.08, 0.5]} />
        <meshStandardMaterial color="#0b0b1e" />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.85, 2.31]}>
          <boxGeometry args={[0.5, 0.16, 0.04]} />
          <meshBasicMaterial color={glow("#fff4e6", 3)} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, -2.31]}>
        <boxGeometry args={[1.9, 0.12, 0.04]} />
        <meshBasicMaterial color={glow("#ff2050", 3)} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 7]} />
        <meshBasicMaterial
          map={underglow}
          color={glow("#2EE6D6", 1.4)}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <Wheel wheelRef={wheels[0]} position={[1.12, 0.44, 1.5]} />
      <Wheel wheelRef={wheels[1]} position={[-1.12, 0.44, 1.5]} />
      <Wheel wheelRef={wheels[2]} position={[1.12, 0.44, -1.5]} />
      <Wheel wheelRef={wheels[3]} position={[-1.12, 0.44, -1.5]} />
    </group>
  );
};

export default Car;
