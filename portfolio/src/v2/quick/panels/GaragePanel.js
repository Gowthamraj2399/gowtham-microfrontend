import React from "react";
import Panel, { Reveal } from "../Panel";
import { projects } from "../../data/content";

const frames = ["bg-city-pink", "bg-city-teal", "bg-city-sun"];
const tilts = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]"];

const GaragePanel = () => (
  <Panel id="garage" title="The Garage">
    <div className="grid md:grid-cols-3 gap-6 md:gap-5">
      {projects.map((p, i) => (
        <Reveal key={p.name} delay={i * 0.1}>
          <article className="group h-full flex flex-col">
            <div className={`poster ${frames[i % 3]} ${tilts[i % 3]} p-3 transition-transform group-hover:rotate-0 group-hover:-translate-y-1`}>
              <div className="bg-city-night/90 aspect-[4/3] grid place-items-center overflow-hidden">
                <img src={p.image} alt={`${p.name} screenshot`} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            <div className="card-glass rounded-2xl p-5 mt-4 flex-1 flex flex-col">
              <div className="f-mono text-[10px] uppercase text-city-teal">{p.platform}</div>
              <h3 className="f-display uppercase text-3xl leading-tight mb-2">{p.name}</h3>
              <p className="text-sm text-white/80 leading-relaxed flex-1">{p.description}</p>
              <dl className="mt-4 pt-3 border-t border-white/10">
                <dt className="f-mono text-[10px] uppercase text-white/50 mb-1">Specs</dt>
                <dd className="f-mono text-xs text-city-sun">{p.specs.join(" · ")}</dd>
              </dl>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  </Panel>
);

export default GaragePanel;
