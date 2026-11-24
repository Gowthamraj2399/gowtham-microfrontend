import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCarSide, FaPlay } from "react-icons/fa";
import { careerStart, districts, profile } from "../data/content";
import { useGameStore } from "../state/useGameStore";
import { formatDuration } from "../utils/time";

// 3D world launch screen: the camera sweeps the city (CameraRig) while the
// name sits over it as real page text. Scroll, Enter or "Start tour" begins
// the tour; "Drive" goes straight to free roam. The rest of the HUD waits.
const TitleScreen = () => {
  const start = useGameStore((s) => s.start);
  const setRoam = useGameStore((s) => s.setRoam);
  const setMode = useGameStore((s) => s.setMode);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" && !useGameStore.getState().menuOpen) start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  const fade = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <motion.section
      aria-label="Title screen"
      className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-end md:justify-center"
      exit={{ opacity: 0, x: -40, transition: { duration: 0.45 } }}
    >
      {/* Static scrim for legibility: left on wide screens, bottom on phones. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-city-night via-city-night/70 to-transparent md:bg-gradient-to-r md:from-city-night/90 md:via-city-night/40 md:to-transparent"
      />

      <div className="relative px-6 pb-[max(2rem,env(safe-area-inset-bottom))] md:pb-0 md:pl-[7vw] max-w-3xl">
        <motion.div {...fade(0.1)} className="f-mono text-xs md:text-sm uppercase tracking-[0.35em] text-city-teal">
          ● Now playing
        </motion.div>
        <motion.h1
          {...fade(0.2)}
          className="f-display uppercase leading-[0.86] text-[22vw] md:text-[9.5vw] xl:text-[8.5rem] text-city-pink mt-2"
          style={{ textShadow: "0 0 32px rgba(255,61,127,0.45), 0.06em 0.06em 0 #0b0b1e" }}
        >
          {profile.name.split(" ").map((w) => (
            <span key={w} className="block">
              {w}
            </span>
          ))}
        </motion.h1>
        <motion.p {...fade(0.35)} className="mt-4 text-xl md:text-3xl font-semibold text-white">
          {profile.title}
        </motion.p>
        <motion.p {...fade(0.42)} className="mt-1 text-sm md:text-lg text-white/75">
          {profile.tagline}
        </motion.p>
        <motion.p {...fade(0.5)} className="mt-3 f-mono text-[11px] md:text-xs uppercase tracking-wider text-city-sun">
          {formatDuration(careerStart, null)} in the game · {profile.projectsDelivered} projects · {districts.length}{" "}
          districts to explore
        </motion.p>

        <motion.div {...fade(0.62)} className="mt-7 flex flex-wrap gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-city-pink text-city-night f-display uppercase text-lg md:text-xl px-6 py-3 flex items-center gap-3 shadow-[0_0_28px_rgba(255,61,127,0.5)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <FaPlay size={14} /> Start tour
          </button>
          <button
            type="button"
            onClick={() => setRoam(true)}
            className="rounded-xl border-2 border-city-teal text-city-teal bg-city-night/60 f-display uppercase text-lg md:text-xl px-6 py-3 flex items-center gap-3 hover:bg-city-teal hover:text-city-night"
          >
            <FaCarSide size={18} /> Drive
          </button>
        </motion.div>

        <motion.div
          {...fade(0.75)}
          className="mt-5 f-mono text-[10px] md:text-[11px] uppercase tracking-wider text-white/55 flex flex-wrap gap-x-4 gap-y-1"
        >
          <span className="v2-blink md:hidden">Swipe up to explore ▲</span>
          <span className="v2-blink hidden md:inline">Scroll or press Enter ▼</span>
          <button
            type="button"
            onClick={() => setMode("quick")}
            className="pointer-events-auto underline underline-offset-4 hover:text-white"
          >
            Prefer a simple page? Quick view
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TitleScreen;
