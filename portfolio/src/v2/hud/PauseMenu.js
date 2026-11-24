import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { districts, profile } from "../data/content";
import { useGameStore } from "../state/useGameStore";

const item =
  "w-full text-left f-display uppercase text-2xl md:text-4xl py-1 px-3 -mx-3 rounded-md hover:bg-city-pink hover:text-city-night focus-visible:bg-city-pink focus-visible:text-city-night outline-none transition-colors";

const PauseMenu = () => {
  const open = useGameStore((s) => s.menuOpen);
  const setMenuOpen = useGameStore((s) => s.setMenuOpen);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);
  const requestJump = useGameStore((s) => s.requestJump);
  const visited = useGameStore((s) => s.visited);
  const active = useGameStore((s) => s.active);
  const firstRef = useRef(null);

  useEffect(() => {
    if (open) firstRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] bg-city-night/95 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container max-w-5xl py-10 md:py-16 grid md:grid-cols-2 gap-10">
            <motion.div initial={{ x: -30 }} animate={{ x: 0 }}>
              <div className="f-mono text-xs uppercase tracking-[0.3em] text-city-teal">Game paused</div>
              <h2 className="f-display text-6xl md:text-8xl uppercase text-city-pink neon-text mb-6">Menu</h2>
              <ul className="flex flex-col gap-1">
                <li>
                  <button ref={firstRef} type="button" className={item} onClick={() => setMenuOpen(false)}>
                    Resume
                  </button>
                </li>
                <li>
                  <a className={`${item} block`} href={profile.resume} download>
                    Download résumé
                  </a>
                </li>
                <li>
                  <button type="button" className={item} onClick={() => setPhoneOpen(true)}>
                    Phone · Contact
                  </button>
                </li>
                <li>
                  <Link className={`${item} block`} to="/">
                    Classic site
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div initial={{ x: 30 }} animate={{ x: 0 }}>
              <div className="f-mono text-xs uppercase tracking-[0.3em] text-city-teal mb-3">Fast travel</div>
              <ul className="flex flex-col gap-2">
                {districts.map((d, i) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => requestJump(d.id)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left card-glass hover:border-city-pink focus-visible:border-city-pink outline-none ${
                        d.id === active ? "border-city-pink" : ""
                      }`}
                    >
                      <span className="f-mono text-xs text-white/50">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1">
                        <span className="block font-semibold">{d.name}</span>
                        <span className="block text-xs text-white/60">{d.section}</span>
                      </span>
                      {visited.includes(d.id) && <FaCheck className="text-city-teal" aria-label="visited" />}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="f-mono text-[11px] text-white/40 mt-6">Esc · resume&nbsp;&nbsp;Scroll · travel&nbsp;&nbsp;Map · fast travel</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PauseMenu;
