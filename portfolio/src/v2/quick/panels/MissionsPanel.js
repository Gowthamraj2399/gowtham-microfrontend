import React from "react";
import { motion } from "framer-motion";
import Panel, { Reveal, Chip } from "../Panel";
import { missions } from "../../data/content";
import { formatDuration, formatMonth, monthsBetween } from "../../utils/time";

const MissionsPanel = () => {
  const longest = Math.max(...missions.map((m) => monthsBetween(m.startDate, m.endDate)));

  return (
    <Panel id="missions" title="Missions">
      <ol className="flex flex-col gap-5">
        {missions.map((m, i) => {
          const number = missions.length - i;
          const current = !m.endDate;
          const months = monthsBetween(m.startDate, m.endDate);
          return (
            <Reveal key={m.company} delay={i * 0.06}>
              <li className="card-glass rounded-2xl p-5 md:p-6 grid md:grid-cols-[auto_1fr_auto] gap-5 items-start">
                <div className="flex md:flex-col items-center gap-3">
                  <span className="w-16 h-16 rounded-xl bg-white grid place-items-center p-2 shrink-0">
                    <img src={m.logo} alt="" className="max-w-full max-h-full object-contain" />
                  </span>
                  <span className="f-mono text-[11px] uppercase text-white/50">#{String(number).padStart(2, "0")}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`f-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                        current ? "bg-city-pink text-city-night" : "bg-city-teal/20 text-city-teal"
                      }`}
                    >
                      {current ? <span className="v2-blink">● In progress</span> : "✓ Complete"}
                    </span>
                    <span className="f-mono text-[11px] text-white/60">
                      {formatMonth(m.startDate)} — {formatMonth(m.endDate)}
                    </span>
                  </div>
                  <h3 className="f-display uppercase text-2xl md:text-3xl leading-tight">{m.company}</h3>
                  <p className="text-sm text-city-sun mb-3">{m.role}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>

                {/* Tenure bar — foreshadows the tower heights in the 3D downtown. */}
                <div className="md:w-40">
                  <div className="f-mono text-[10px] uppercase text-white/50 mb-1">Time on mission</div>
                  <div className="f-display text-2xl">{formatDuration(m.startDate, m.endDate)}</div>
                  <div className="h-2 mt-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-city-pink to-city-orange"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(months / longest) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2 }}
                    />
                  </div>
                </div>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </Panel>
  );
};

export default MissionsPanel;
