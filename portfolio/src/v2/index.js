import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./v2.css";
import Hud from "./hud/Hud";
import LoadingScreen from "./hud/LoadingScreen";
import TitleScreen from "./hud/TitleScreen";
import QuickView from "./quick/QuickView";
import { useGameStore } from "./state/useGameStore";

// three.js lives in this chunk, so it only downloads in "world" mode.
const World = lazy(() => import("./world/World"));

const LOADER_KEY = "v2-loader-seen";

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

// Which "driver" runs: the 3D world, or the 2D Quick view as the fallback.
export const pickMode = () => {
  const forced = new URLSearchParams(window.location.search).get("mode");
  if (forced === "quick" || forced === "world") return forced;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "quick";
  if (!hasWebGL()) return "quick";
  if ((navigator.hardwareConcurrency || 8) < 4 || navigator.connection?.saveData) return "quick";
  return "world";
};

const HomeV2 = () => {
  const mode = useGameStore((s) => s.mode);
  const started = useGameStore((s) => s.started);
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(LOADER_KEY);
    } catch {
      return false;
    }
  });

  const finishLoading = useCallback(() => {
    try {
      sessionStorage.setItem(LOADER_KEY, "1");
    } catch {
      /* private mode */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.title = "Gowtham Raj — Portfolio";
    window.scrollTo(0, 0);
    useGameStore.getState().setMode(pickMode());
  }, []);

  return (
    <div className="v2-root min-h-screen overflow-x-hidden" data-mode={mode || ""}>
      {mode === "quick" && <QuickView />}
      {mode === "world" && (
        <Suspense fallback={<div className="fixed inset-0 bg-city-night" />}>
          <World />
        </Suspense>
      )}
      {mode && <Hud />}
      {/* After the loader, so the key that skips it doesn't also start the tour. */}
      <AnimatePresence>{mode === "world" && !started && !loading && <TitleScreen key="title" />}</AnimatePresence>
      <AnimatePresence>{loading && <LoadingScreen key="loader" onDone={finishLoading} />}</AnimatePresence>
    </div>
  );
};

export default HomeV2;
