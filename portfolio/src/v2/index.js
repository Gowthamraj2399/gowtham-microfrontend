import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./v2.css";
import Hud from "./hud/Hud";
import LoadingScreen from "./hud/LoadingScreen";
import QuickView from "./quick/QuickView";

const LOADER_KEY = "v2-loader-seen";

// Decides which driver runs. Phase 1 only has the Quick view; phase 2 adds the
// 3D World and returns "world" when WebGL is available, motion is allowed, the
// device isn't low-end and the URL doesn't ask for ?mode=quick.
export const pickMode = () => "quick";

const HomeV2 = () => {
  const [mode] = useState(pickMode);
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
  }, []);

  return (
    <div className="v2-root min-h-screen overflow-x-hidden" data-mode={mode}>
      <QuickView />
      <Hud />
      <AnimatePresence>{loading && <LoadingScreen key="loader" onDone={finishLoading} />}</AnimatePresence>
    </div>
  );
};

export default HomeV2;
