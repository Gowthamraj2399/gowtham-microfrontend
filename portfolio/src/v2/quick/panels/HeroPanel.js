import React from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import Panel from "../Panel";
import { profile, careerStart } from "../../data/content";
import { useGameStore } from "../../state/useGameStore";
import { yearsSince } from "../../utils/time";

const pop = (delay, rotate) => ({
  initial: { opacity: 0, y: 50, rotate: 0 },
  animate: { opacity: 1, y: 0, rotate },
  transition: { type: "spring", stiffness: 140, damping: 18, delay },
});

const HeroPanel = () => {
  const requestJump = useGameStore((s) => s.requestJump);
  return (
    <Panel id="hero">
      <div className="grid grid-cols-6 md:grid-cols-12 auto-rows-[minmax(80px,auto)] gap-3 md:gap-4">
        <motion.div
          {...pop(0.05, -1)}
          className="poster col-span-6 md:col-span-7 md:row-span-3 bg-gradient-to-br from-city-pink via-city-orange to-city-sun text-city-night p-5 md:p-8 flex flex-col justify-end"
        >
          <span className="f-mono text-xs uppercase tracking-[0.3em] mb-auto">Now playing</span>
          <h1 className="f-display uppercase text-[19vw] md:text-[clamp(3rem,10vw,8.5rem)] leading-[0.82] mt-6">
            Gowtham
            <br />
            Raj
          </h1>
          <p className="f-display uppercase text-2xl md:text-4xl mt-3">{profile.title}</p>
        </motion.div>

        <motion.div {...pop(0.15, 2)} className="poster col-span-3 md:col-span-5 md:row-span-2 bg-city-violet">
          <img src={profile.portrait} alt={profile.name} className="w-full h-full max-h-[340px] object-cover object-top" />
        </motion.div>

        <motion.div
          {...pop(0.25, -2)}
          className="poster col-span-3 md:col-span-2 bg-city-teal text-city-night p-4 flex flex-col justify-center"
        >
          <span className="f-display text-5xl md:text-6xl leading-none">{yearsSince(careerStart)}+</span>
          <span className="f-mono text-[11px] uppercase">years in the game</span>
        </motion.div>

        <motion.div
          {...pop(0.32, 1)}
          className="poster col-span-6 md:col-span-3 bg-city-night text-white p-4 flex flex-col justify-center border-city-night"
        >
          <span className="f-mono text-[11px] uppercase text-city-teal">Based in</span>
          <span className="f-display uppercase text-3xl">{profile.location}</span>
          <span className="text-xs text-white/70 mt-1">{profile.tagline}</span>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => requestJump("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 mx-auto flex flex-col items-center gap-1 f-mono text-xs uppercase tracking-[0.3em] text-white/80 hover:text-city-sun"
      >
        Scroll to start
        <FaChevronDown className="animate-bounce" />
      </motion.button>
    </Panel>
  );
};

export default HeroPanel;
