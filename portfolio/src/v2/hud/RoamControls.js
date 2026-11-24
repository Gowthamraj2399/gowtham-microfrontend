import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaTimes } from "react-icons/fa";
import { useGameStore } from "../state/useGameStore";
import { input, resetInput } from "../world/input";

const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// Hold-to-press pad button that writes into the shared driving input.
const Pad = ({ k, label, children, className = "" }) => {
  const press = (v) => (e) => {
    e.preventDefault();
    input[k] = v;
  };
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={press(true)}
      onPointerUp={press(false)}
      onPointerLeave={press(false)}
      onPointerCancel={press(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`hud-glass rounded-2xl w-16 h-16 grid place-items-center text-xl active:bg-city-pink active:text-city-night select-none touch-none ${className}`}
    >
      {children}
    </button>
  );
};

// Free-roam HUD: exit button, key hints on desktop, a touch pad on phones.
const RoamControls = () => {
  const setRoam = useGameStore((s) => s.setRoam);
  const [touch] = useState(isTouch);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 9000);
    return () => {
      clearTimeout(t);
      resetInput();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setRoam(false)}
        className="fixed z-40 top-6 left-6 hud-glass rounded-xl px-3 py-2 hidden md:flex items-center gap-2 f-mono text-xs uppercase hover:text-city-pink"
      >
        <FaTimes /> Exit free roam
      </button>

      {!touch && hint && (
        <div className="fixed z-40 left-1/2 -translate-x-1/2 top-20 hud-glass rounded-xl px-4 py-2 f-mono text-[11px] uppercase text-white/85 text-center pointer-events-none">
          W A S D / arrows drive · Space brake · Shift boost · R reset · Esc menu
        </div>
      )}

      {touch && (
        <div className="fixed z-40 right-3 bottom-[6.5rem] md:bottom-28 flex items-end gap-3 select-none">
          <div className="flex gap-2">
            <Pad k="left" label="Steer left">
              <FaArrowLeft />
            </Pad>
            <Pad k="right" label="Steer right">
              <FaArrowRight />
            </Pad>
          </div>
          <div className="flex flex-col gap-2">
            <Pad k="up" label="Accelerate" className="text-city-teal">
              <FaArrowUp />
            </Pad>
            <Pad k="down" label="Brake / reverse">
              <FaArrowDown />
            </Pad>
          </div>
        </div>
      )}
    </>
  );
};

export default RoamControls;
