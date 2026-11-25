import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Object3D, Vector3 } from "three";
import { useGameStore } from "../state/useGameStore";
import CameraRig from "./CameraRig";
import Car from "./Car";
import City from "./City";
import Pedestrians from "./Pedestrians";
import Districts from "./districts";
import Sky from "./Sky";
import { buildTour } from "./tour";
import { useFontsReady } from "./textures";

// Quality levels, stepped down by the watchdog:
//   2 = 1.5× pixels, soft shadows, bloom      1 = 1× pixels, bloom, no shadows
//   then → Quick view, with a toast saying why.
// Under ~45 fps it drops to quality 1; only if it then stays truly choppy
// (under ~24 fps for three checks in a row) does it give up on 3D.
const useWatchdog = () => {
  const [quality, setQuality] = useState(2);
  const strikes = useRef(0);
  const onDecline = ({ fps }) => {
    if (document.visibilityState !== "visible") return; // hidden tabs report ~0 fps
    if (quality > 1) setQuality(1);
    if (fps >= 24) return;
    strikes.current += 1;
    if (strikes.current >= 3) {
      const { setMode, pushToast } = useGameStore.getState();
      setMode("quick");
      pushToast({ kind: "district", title: "Quick view", subtitle: "Switched for smoother scrolling on this device" });
    }
  };
  const onIncline = () => {
    strikes.current = 0;
  };
  return { quality, onDecline, onIncline };
};

// Low warm sun from the sunset side. The shadow camera follows what the main
// camera is looking at, so one 2048 map covers whatever is on screen.
const SUN_DIR = new Vector3(-0.45, 0.5, -0.74).normalize();
const SunLight = ({ shadows }) => {
  const light = useRef();
  const target = useMemo(() => new Object3D(), []);
  const forward = useMemo(() => new Vector3(), []);
  useFrame(({ camera }) => {
    if (!light.current) return;
    camera.getWorldDirection(forward);
    const cx = camera.position.x + forward.x * 35;
    const cz = camera.position.z + forward.z * 35;
    target.position.set(cx, 0, cz);
    target.updateMatrixWorld();
    light.current.position.set(cx + SUN_DIR.x * 150, SUN_DIR.y * 150, cz + SUN_DIR.z * 150);
  });
  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={light}
        target={target}
        color="#ffb889"
        intensity={2.6}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={10}
        shadow-camera-far={400}
      />
    </>
  );
};

// Reflections for glossy surfaces, built from light shapes in the scene —
// no HDR file to download.
const Reflections = () => (
  <Environment resolution={256} frames={1}>
    <color attach="background" args={["#2a1552"]} />
    <Lightformer form="rect" intensity={3} color="#FF8A3D" position={[-10, 2, -20]} scale={[40, 6, 1]} />
    <Lightformer form="rect" intensity={2} color="#FF3D7F" position={[20, 6, 0]} rotation-y={-Math.PI / 2} scale={[30, 4, 1]} />
    <Lightformer form="rect" intensity={1.5} color="#2EE6D6" position={[-20, 6, 10]} rotation-y={Math.PI / 2} scale={[30, 3, 1]} />
    <Lightformer form="circle" intensity={1.2} color="#9b6bff" position={[0, 30, 0]} rotation-x={Math.PI / 2} scale={20} />
  </Environment>
);

// Screen aspect ratio, rounded so tiny resizes don't rebuild the tour.
const readAspect = () => Math.round((window.innerWidth / Math.max(1, window.innerHeight)) * 50) / 50;
const useAspect = () => {
  const [aspect, setAspect] = useState(readAspect);
  useEffect(() => {
    const onResize = () => setAspect(readAspect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return aspect;
};

const World = () => {
  const fontsReady = useFontsReady();
  const { quality, onDecline, onIncline } = useWatchdog();
  const roam = useGameStore((s) => s.roam);
  const scrollRef = useRef(null);
  const aspect = useAspect();
  // Camera shots for this screen shape (tour.js): one per district on wide
  // screens, closer split shots on phones.
  const tour = useMemo(() => buildTour(aspect), [aspect]);

  useEffect(() => {
    if (!roam) scrollRef.current?.focus({ preventScroll: true });
  }, [roam]);

  return (
    <div className="fixed inset-0 bg-city-night">
      <Canvas
        className="!absolute inset-0"
        shadows={quality > 1}
        dpr={[1, quality > 1 ? 1.5 : 1]}
        camera={{ fov: 50, near: 0.5, far: 2600, position: tour.shots[0].cam.toArray() }}
        gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      >
        <PerformanceMonitor bounds={() => [45, 58]} onDecline={onDecline} onIncline={onIncline} />
        <fog attach="fog" args={["#4a2378", 150, 600]} />
        <hemisphereLight args={["#b59aff", "#2a1850", 0.65]} />
        <ambientLight intensity={0.15} />
        <SunLight shadows={quality > 1} />
        <Sky />
        <Reflections />
        <CameraRig scrollRef={scrollRef} tour={tour} />
        <City />
        {/* Fewer walkers on the low-quality level and on phones. */}
        <Pedestrians count={quality > 1 && !tour.tall ? 110 : 60} />
        <Suspense fallback={null}>{fontsReady && <Districts />}</Suspense>
        {roam && <Car />}
        <EffectComposer multisampling={quality > 1 ? 4 : 0}>
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.25} intensity={0.85} radius={0.7} />
          <Vignette offset={0.32} darkness={0.5} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
      {/* Native scrolling (wheel, touch, keys) over the canvas; the camera
          rig reads its position every frame. One screen of scroll per shot.
          Hidden in free roam, where the keyboard / touch pad drives instead. */}
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="3D city. Scroll to travel between districts."
        className={`v2-world-scroll absolute inset-0 overflow-y-auto overflow-x-hidden outline-none ${roam ? "hidden" : ""}`}
      >
        <div style={{ height: `${tour.shots.length * 100}%` }} />
      </div>
    </div>
  );
};

export default World;
