import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useGameStore } from "../state/useGameStore";
import { input, resetInput } from "../world/input";

const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// Keep receiving this finger's moves even if it slides off the control.
const capture = (e) => {
  try {
    e.currentTarget.setPointerCapture(e.pointerId);
  } catch {
    /* pointer already gone */
  }
};

const RADIUS = 52; // how far the joystick knob travels, in px

// Left thumb: analog steering. Drag the knob sideways; the further you drag,
// the harder the car turns. Lets go → centres.
const Joystick = () => {
  const base = useRef(null);
  const [dx, setDx] = useState(0);
  const pointer = useRef(null);

  const move = (e) => {
    if (pointer.current !== e.pointerId || !base.current) return;
    const r = base.current.getBoundingClientRect();
    const x = Math.max(-RADIUS, Math.min(RADIUS, e.clientX - (r.left + r.width / 2)));
    // Small dead zone so a resting thumb doesn't drift.
    const axis = Math.abs(x) < 6 ? 0 : x / RADIUS;
    input.steerAxis = -axis; // + is left in the car's convention
    setDx(x);
  };
  const end = (e) => {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    input.steerAxis = 0;
    setDx(0);
  };

  return (
    <div
      ref={base}
      role="slider"
      aria-label="Steering"
      aria-valuemin={-1}
      aria-valuemax={1}
      aria-valuenow={Math.round((dx / RADIUS) * 100) / 100}
      onPointerDown={(e) => {
        e.preventDefault();
        pointer.current = e.pointerId;
        capture(e);
        move(e);
      }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-40 h-24 rounded-full hud-glass touch-none select-none flex items-center justify-center"
    >
      <span className="absolute left-4 f-mono text-xs text-white/40" aria-hidden="true">
        ◀
      </span>
      <span className="absolute right-4 f-mono text-xs text-white/40" aria-hidden="true">
        ▶
      </span>
      <span
        className="w-14 h-14 rounded-full bg-city-teal/90 shadow-[0_0_20px_rgba(46,230,214,0.6)] border-2 border-white/70"
        style={{ transform: `translateX(${dx}px)`, transition: pointer.current === null ? "transform 0.15s" : "none" }}
        aria-hidden="true"
      />
    </div>
  );
};

// Right thumb: hold-to-press pedal writing into the shared driving input.
const Pedal = ({ k, label, className, children }) => {
  const [down, setDown] = useState(false);
  const press = (v) => (e) => {
    e.preventDefault();
    input[k] = v;
    setDown(v);
  };
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        capture(e);
        press(true)(e);
      }}
      onPointerUp={press(false)}
      onPointerCancel={press(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`rounded-2xl f-display uppercase tracking-wide select-none touch-none border-2 transition-transform ${
        down ? "scale-95 brightness-125" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

// Free-roam HUD: exit button and key hints on desktop; joystick + pedals on phones.
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
        <div className="fixed z-40 inset-x-0 bottom-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex items-end justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <Joystick />
          </div>
          <div className="pointer-events-auto flex items-end gap-3">
            <Pedal k="down" label="Brake / reverse" className="w-20 h-20 bg-city-night/85 border-white/30 text-white text-base">
              Brake
            </Pedal>
            <Pedal
              k="up"
              label="Accelerate"
              className="w-20 h-32 bg-city-pink/90 border-white/60 text-city-night text-xl shadow-[0_0_24px_rgba(255,61,127,0.55)]"
            >
              Gas
            </Pedal>
          </div>
        </div>
      )}
    </>
  );
};

export default RoamControls;
