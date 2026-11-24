import React from "react";
import { motion } from "framer-motion";
import { awards, districts, missions, profile, projects, skillGroups } from "../data/content";
import { useGameStore } from "../state/useGameStore";

const summary = {
  hero: () => `${profile.title} · ${profile.tagline}`,
  about: () => profile.pitch,
  skills: () =>
    `${skillGroups.length} loadout slots · ${skillGroups.reduce((n, g) => n + g.skills.length, 0)} skills`,
  missions: () => {
    const now = missions.find((m) => !m.endDate);
    return now ? `Now: ${now.role} at ${now.company}` : `${missions.length} missions on record`;
  },
  garage: () => `${profile.projectsDelivered} projects · featured: ${projects.map((p) => p.name).join(" · ")}`,
  awards: () => awards.map((a) => `${a.title} (${a.year})`).join(" · "),
  phone: () => "Email, LinkedIn and GitHub — all on the phone.",
};

// 3D world only: a location banner for the district the camera is at, with
// the way into its full details.
const LocationCard = () => {
  const active = useGameStore((s) => s.active);
  const openSheet = useGameStore((s) => s.openSheet);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);
  const index = districts.findIndex((d) => d.id === active);
  const d = districts[index];

  const action =
    active === "hero"
      ? null
      : active === "phone"
      ? { label: "Open phone", onClick: () => setPhoneOpen(true) }
      : { label: "View details", onClick: () => openSheet(active) };

  return (
    <div className="fixed z-40 bottom-3 right-3 left-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:bottom-6 md:w-[480px] pointer-events-none">
      {/* Remount per district and fade in. No exit animation: with quick fast
          travel through several districts, a wait-for-exit could get stuck. */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="hud-glass rounded-2xl px-4 py-3 pointer-events-auto flex items-center gap-3"
        >
          <div className="min-w-0 flex-1">
            <div className="f-mono text-[10px] uppercase tracking-[0.25em] text-city-teal">
              District {String(index + 1).padStart(2, "0")} · {d.section}
            </div>
            <div className="f-display uppercase text-2xl md:text-3xl leading-tight truncate">{d.name}</div>
            <div className="text-xs text-white/70 truncate">{summary[active]()}</div>
          </div>
          {action ? (
            <button
              type="button"
              onClick={action.onClick}
              className="shrink-0 rounded-lg bg-city-pink text-city-night f-display uppercase text-sm md:text-base px-3 py-2 hover:brightness-110"
            >
              {action.label}
            </button>
          ) : (
            <span className="shrink-0 f-mono text-[10px] uppercase text-white/60 v2-blink">Scroll ▼</span>
          )}
        </motion.div>
    </div>
  );
};

export default LocationCard;
