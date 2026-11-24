import React from "react";
import { FaBars, FaMobileAlt } from "react-icons/fa";
import { districts, profile, careerStart } from "../data/content";
import { useGameStore } from "../state/useGameStore";
import { yearsSince } from "../utils/time";

const StatusBar = () => {
  const visited = useGameStore((s) => s.visited);
  const setMenuOpen = useGameStore((s) => s.setMenuOpen);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);
  const phoneOpen = useGameStore((s) => s.phoneOpen);

  return (
    <header className="fixed top-3 right-3 md:top-6 md:right-6 z-40 flex items-stretch gap-2">
      <div className="hud-glass rounded-xl px-3 py-2 flex items-center gap-3">
        <div className="hidden sm:block leading-tight">
          <div className="f-display text-base md:text-lg uppercase">{profile.name}</div>
          <div className="f-mono text-[10px] text-city-sun uppercase">
            LVL {yearsSince(careerStart)} · Engineer
          </div>
        </div>
        <div className="leading-tight" aria-label={`${visited.length} of ${districts.length} districts visited`}>
          <div className="f-mono text-[10px] uppercase text-white/60">Districts</div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5" aria-hidden="true">
              {districts.map((d) => (
                <span
                  key={d.id}
                  className={`h-2 w-2 md:w-2.5 rounded-sm ${
                    visited.includes(d.id) ? "bg-city-teal" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
            <span className="f-mono text-xs font-bold">
              {visited.length}/{districts.length}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPhoneOpen(!phoneOpen)}
        aria-label="Open phone (contact)"
        className="hud-glass rounded-xl px-3 grid place-items-center hover:text-city-teal transition-colors"
      >
        <FaMobileAlt size={18} />
      </button>
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        className="hud-glass rounded-xl px-3 grid place-items-center hover:text-city-pink transition-colors"
      >
        <FaBars size={18} />
        <span className="f-mono text-[9px] text-white/50 hidden md:block">ESC</span>
      </button>
    </header>
  );
};

export default StatusBar;
