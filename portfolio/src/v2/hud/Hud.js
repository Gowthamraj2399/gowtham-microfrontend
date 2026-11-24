import React, { useEffect } from "react";
import Minimap from "./Minimap";
import StatusBar from "./StatusBar";
import Toasts from "./Toasts";
import PauseMenu from "./PauseMenu";
import PhoneOverlay from "./Phone";
import { useGameStore } from "../state/useGameStore";

// The HUD only reads the store, so it works unchanged on top of the 3D world.
const Hud = () => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const { menuOpen, phoneOpen, setMenuOpen, setPhoneOpen } = useGameStore.getState();
      if (phoneOpen) setPhoneOpen(false);
      else setMenuOpen(!menuOpen);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <StatusBar />
      <Minimap />
      <Toasts />
      <PhoneOverlay />
      <PauseMenu />
    </>
  );
};

export default Hud;
