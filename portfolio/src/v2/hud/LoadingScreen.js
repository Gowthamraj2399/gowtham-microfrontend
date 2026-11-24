import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadingTips, profile } from "../data/content";

const DURATION = 1800;

// Poster-style loader. Shown once per browser session; any key / tap skips it.
const LoadingScreen = ({ onDone }) => {
  const [tip] = useState(() => loadingTips[Math.floor(Math.random() * loadingTips.length)]);

  useEffect(() => {
    const t = setTimeout(onDone, DURATION);
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-city-night overflow-hidden flex flex-col"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex-1 grid grid-cols-6 grid-rows-6 gap-3 p-4 md:p-8">
        <motion.div
          className="poster col-span-6 md:col-span-4 row-span-4 bg-gradient-to-b from-city-violet via-city-pink to-city-orange flex items-end p-5 md:p-8 -rotate-1"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="f-display uppercase text-[18vw] md:text-[9vw] leading-[0.85] text-city-night">
            {profile.name.split(" ").map((w) => (
              <span key={w} className="block">
                {w}
              </span>
            ))}
          </h1>
        </motion.div>
        <motion.div
          className="poster hidden md:block col-span-2 row-span-3 bg-city-sun rotate-2"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <img src={profile.portrait} alt="" className="w-full h-full object-cover object-top duotone" />
        </motion.div>
        <motion.div
          className="poster col-span-6 md:col-span-2 row-span-2 md:row-span-3 bg-city-teal text-city-night p-4 flex items-center rotate-1"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="f-display uppercase text-2xl md:text-3xl leading-tight">{profile.tagline}</p>
        </motion.div>
      </div>
      <div className="px-4 md:px-8 pb-6 flex flex-col md:flex-row md:items-end gap-3 md:gap-8">
        <p className="flex-1 text-sm text-white/80">{tip}</p>
        <div className="md:w-72">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full w-full origin-left bg-city-pink"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: DURATION / 1000, ease: "easeInOut" }}
            />
          </div>
          <p className="f-mono text-[10px] uppercase text-white/50 mt-2 text-right">Loading city… press any key to skip</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
