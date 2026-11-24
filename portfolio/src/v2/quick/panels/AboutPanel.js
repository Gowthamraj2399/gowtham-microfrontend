import React from "react";
import { FaDownload } from "react-icons/fa";
import Panel, { Reveal } from "../Panel";
import { profile, careerStart, missions, projects, awards } from "../../data/content";
import { formatDuration } from "../../utils/time";

const AboutPanel = () => {
  const stats = [
    { label: "Experience", value: formatDuration(careerStart, null) },
    { label: "Companies", value: missions.length },
    { label: "Featured projects", value: projects.length },
    { label: "Awards", value: awards.length },
    { label: "Base", value: profile.location },
    { label: "Class", value: "Full stack" },
  ];

  return (
    <Panel id="about" title="Character">
      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 items-start">
        <Reveal>
          <div className="poster bg-gradient-to-b from-city-sun to-city-pink -rotate-2 max-w-sm mx-auto">
            <img src={profile.portrait} alt={profile.name} className="w-full h-auto object-cover" />
            <div className="absolute left-0 right-0 bottom-0 bg-city-night/85 px-4 py-3">
              <div className="f-display uppercase text-3xl">{profile.name}</div>
              <div className="f-mono text-[11px] uppercase text-city-teal">{profile.title}</div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <div className="card-glass rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="f-mono text-[10px] uppercase text-white/55">{s.label}</div>
                  <div className="f-display text-2xl md:text-3xl uppercase text-city-sun leading-tight">{s.value}</div>
                </div>
              ))}
            </div>
          </Reveal>
          {profile.bio.map((p, i) => (
            <Reveal key={i} delay={0.15 + i * 0.08}>
              <p className="text-base md:text-lg leading-relaxed text-white/90">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <a
              href={profile.resume}
              download
              className="poster inline-flex items-center gap-3 bg-city-teal text-city-night px-5 py-3 f-display uppercase text-xl hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#0b0b1e] transition"
            >
              <FaDownload /> Download résumé
            </a>
          </Reveal>
        </div>
      </div>
    </Panel>
  );
};

export default AboutPanel;
