import React, { useEffect } from "react";
import Minimap from "./Minimap";
import StatusBar from "./StatusBar";
import Toasts from "./Toasts";
import PauseMenu from "./PauseMenu";
import PhoneOverlay from "./Phone";
import LocationCard from "./LocationCard";
import DetailSheet from "./DetailSheet";
import RoamControls from "./RoamControls";
import { useGameStore } from "../state/useGameStore";

// The HUD only reads the store, so it works on top of either driver.
const Hud = () => {
  const mode = useGameStore((s) => s.mode);
  const roam = useGameStore((s) => s.roam);
  // 3D title screen: keep the frame clean until the player starts.
  const started = useGameStore((s) => s.started);
  const title = mode === "world" && !started;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const { menuOpen, phoneOpen, sheet, setMenuOpen, setPhoneOpen, closeSheet } = useGameStore.getState();
      if (sheet) closeSheet();
      else if (phoneOpen) setPhoneOpen(false);
      else setMenuOpen(!menuOpen);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {!title && <StatusBar />}
      {!title && <Minimap />}
      {mode === "world" && !title && <LocationCard />}
      {mode === "world" && roam && <RoamControls />}
      <Toasts />
      {mode === "world" && <DetailSheet />}
      <PhoneOverlay />
      <PauseMenu />
    </>
  );
};

export default Hud;
