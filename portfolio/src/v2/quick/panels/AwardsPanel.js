import React from "react";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import Panel, { Reveal } from "../Panel";
import { awards } from "../../data/content";

const AwardsPanel = () => (
  <Panel id="awards" title="Hall of Fame">
    <div className="grid gap-6 max-w-3xl">
      {awards.map((a) => (
        <Reveal key={a.title}>
          <div className="poster bg-city-sun text-city-night p-6 md:p-10 rotate-1 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <motion.div
              className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-city-night text-city-sun grid place-items-center"
              initial={{ scale: 0, rotate: -30 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
            >
              <FaTrophy className="text-5xl md:text-6xl" aria-hidden="true" />
            </motion.div>
            <div>
              <div className="f-mono text-[11px] uppercase tracking-[0.25em]">Achievement · {a.year}</div>
              <h3 className="f-display uppercase text-4xl md:text-5xl leading-none my-1">{a.title}</h3>
              <p className="font-semibold text-sm mb-2">{a.awarder}</p>
              <p className="text-sm md:text-base leading-relaxed">{a.description}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </Panel>
);

export default AwardsPanel;
