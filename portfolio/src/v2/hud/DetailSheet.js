import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useGameStore } from "../state/useGameStore";
import { PanelContext } from "../quick/Panel";
import AboutPanel from "../quick/panels/AboutPanel";
import SkillsPanel from "../quick/panels/SkillsPanel";
import MissionsPanel from "../quick/panels/MissionsPanel";
import GaragePanel from "../quick/panels/GaragePanel";
import AwardsPanel from "../quick/panels/AwardsPanel";

// The same panels the Quick view uses, rendered in "sheet" mode — so the 3D
// world and the 2D view never drift apart.
const panels = {
  about: AboutPanel,
  skills: SkillsPanel,
  missions: MissionsPanel,
  garage: GaragePanel,
  awards: AwardsPanel,
};

const DetailSheet = () => {
  const sheet = useGameStore((s) => s.sheet);
  const closeSheet = useGameStore((s) => s.closeSheet);
  const Body = sheet && panels[sheet];

  return (
    <AnimatePresence>
      {Body && (
        <motion.div
          key="sheet"
          className="fixed inset-0 z-[55] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close details" className="absolute inset-0 bg-city-night/60" onClick={closeSheet} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="relative h-full w-full md:w-[min(1100px,92vw)] bg-city-night border-l border-city-teal/30 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Close details"
              className="sticky top-3 float-right mr-3 z-10 hud-glass rounded-xl p-3 hover:text-city-pink"
            >
              <FaTimes />
            </button>
            <div className="px-5 md:px-10 py-10 md:py-14">
              <PanelContext.Provider value="sheet">
                <Body />
              </PanelContext.Provider>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailSheet;
