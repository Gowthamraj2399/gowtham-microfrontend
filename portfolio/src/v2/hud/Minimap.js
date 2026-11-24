import React from "react";
import { motion } from "framer-motion";
import { districts } from "../data/content";
import { useGameStore } from "../state/useGameStore";
import { islandPath as ISLAND } from "../data/map";

const route = districts.map((d, i) => `${i ? "L" : "M"}${d.map.x} ${d.map.y}`).join(" ");

const Minimap = () => {
  const active = useGameStore((s) => s.active);
  const visited = useGameStore((s) => s.visited);
  const requestJump = useGameStore((s) => s.requestJump);
  const mode = useGameStore((s) => s.mode);
  const roam = useGameStore((s) => s.roam);
  const car = useGameStore((s) => s.car);
  const current = districts.find((d) => d.id === active) || districts[0];

  // In 3D mode on phones the location card takes the bottom row; sit above it.
  return (
    <nav
      aria-label="City map"
      className={`fixed left-3 md:left-6 md:top-auto md:bottom-6 z-40 select-none ${
        // Phones: above the location card in 3D; at the top while driving,
        // so the bottom is free for the joystick and pedals.
        roam ? "top-[4.5rem]" : mode === "world" ? "bottom-[6.5rem]" : "bottom-3"
      }`}
    >
      <div className="hud-glass rounded-2xl p-1.5 w-28 md:w-44">
        <svg viewBox="0 0 100 100" className="w-full h-auto block rounded-xl" role="img" aria-label="Minimap">
          <defs>
            <radialGradient id="mm-water" cx="50%" cy="40%" r="75%">
              <stop offset="0%" stopColor="#1d1d52" />
              <stop offset="100%" stopColor="#0b0b1e" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#mm-water)" />
          <path d={ISLAND} fill="#2a1f5c" stroke="#6B2BD9" strokeWidth="1" />
          <path d={route} fill="none" stroke="#FF8A3D" strokeWidth="1.4" strokeDasharray="2.5 2" opacity="0.8" />
          {districts.map((d) => {
            const isActive = d.id === active;
            const seen = visited.includes(d.id);
            return (
              <g
                key={d.id}
                role="button"
                tabIndex={0}
                aria-label={`Fast travel to ${d.name} (${d.section})`}
                onClick={() => requestJump(d.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && requestJump(d.id)}
                className="cursor-pointer outline-none"
              >
                <title>{`${d.name} — ${d.section}`}</title>
                <circle cx={d.map.x} cy={d.map.y} r="7" fill="transparent" />
                {isActive && <circle cx={d.map.x} cy={d.map.y} r="4" fill="#FF3D7F" className="v2-pulse" />}
                <circle
                  cx={d.map.x}
                  cy={d.map.y}
                  r="3.4"
                  fill={isActive ? "#FF3D7F" : seen ? "#2EE6D6" : "#0b0b1e"}
                  stroke={seen || isActive ? "#0b0b1e" : "#2EE6D6"}
                  strokeWidth="1.2"
                />
              </g>
            );
          })}
          {roam && car ? (
            // Free roam: live car position, arrow points where it's heading.
            <g
              transform={`translate(${car.mx} ${car.my}) rotate(${180 - (car.heading * 180) / Math.PI})`}
              style={{ pointerEvents: "none" }}
            >
              <path d="M0 -4.5 L3.2 3.5 L0 1.8 L-3.2 3.5 Z" fill="#FFD23F" stroke="#0b0b1e" strokeWidth="0.8" />
            </g>
          ) : (
            <motion.g
              initial={false}
              animate={{ x: current.map.x, y: current.map.y - 8 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              style={{ pointerEvents: "none" }}
            >
              <path d="M0 3 L-3 -2 L3 -2 Z" fill="#FFD23F" stroke="#0b0b1e" strokeWidth="0.8" />
            </motion.g>
          )}
        </svg>
        <div className="f-mono text-[9px] md:text-[11px] uppercase tracking-wider px-1 pt-1 pb-0.5 flex justify-between gap-1">
          <span className="text-city-teal truncate">{current.name}</span>
          <span className="text-white/50 hidden md:inline">{current.section}</span>
        </div>
      </div>
    </nav>
  );
};

export default Minimap;
