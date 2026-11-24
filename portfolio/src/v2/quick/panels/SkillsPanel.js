import React from "react";
import Panel, { Reveal, Chip } from "../Panel";
import { skillGroups } from "../../data/content";
import { Icon } from "../../hud/icons";

const accents = ["#FF3D7F", "#2EE6D6", "#FFD23F", "#FF8A3D", "#6B2BD9"];

const SkillsPanel = () => (
  <Panel id="skills" title="Loadout">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skillGroups.map((g, i) => {
        const accent = accents[i % accents.length];
        return (
          <Reveal key={g.label} delay={(i % 3) * 0.08}>
            <div
              className="card-glass rounded-2xl p-5 h-full transition-transform hover:-translate-y-1"
              style={{ borderTop: `3px solid ${accent}`, boxShadow: `0 -10px 30px -18px ${accent}` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg grid place-items-center text-city-night" style={{ background: accent }}>
                  <Icon name={g.icon} size={18} />
                </span>
                <div className="leading-tight">
                  <div className="f-display uppercase text-2xl">{g.label}</div>
                  <div className="f-mono text-[10px] uppercase text-white/50">Slot {String(i + 1).padStart(2, "0")} · {g.skills.length} items</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  </Panel>
);

export default SkillsPanel;
