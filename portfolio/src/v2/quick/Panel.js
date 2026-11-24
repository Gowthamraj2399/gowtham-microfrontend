import React, { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { districts } from "../data/content";

export const Reveal = ({ children, delay = 0, className = "", y = 40 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

export const Chip = ({ children, className = "" }) => (
  <span className={`inline-block f-mono text-[11px] uppercase px-2 py-1 rounded bg-white/10 border border-white/10 ${className}`}>
    {children}
  </span>
);

// One district = one full-height section. `data-district` is what the Quick
// view's observer reads to set the active district.
// "section": a full-height district in the Quick view (observed by its driver).
// "sheet": the same content inside the 3D world's detail sheet.
export const PanelContext = createContext("section");

const Panel = ({ id, title, children, className = "" }) => {
  const mode = useContext(PanelContext);
  const index = districts.findIndex((d) => d.id === id);
  const district = districts[index];
  const header = title && (
    <Reveal className={mode === "sheet" ? "mb-6" : "mb-8 md:mb-12"}>
      <div className="f-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-city-teal">
        District {String(index + 1).padStart(2, "0")} · {district.name}
      </div>
      <h2 className="f-display uppercase text-5xl md:text-7xl leading-none mt-2">{title}</h2>
    </Reveal>
  );

  if (mode === "sheet") {
    return (
      <div aria-label={district.section}>
        {header}
        {children}
      </div>
    );
  }

  return (
    <section
      id={`district-${id}`}
      data-district={id}
      aria-label={district.section}
      className={`relative min-h-screen flex items-center py-28 md:py-32 ${className}`}
    >
      <div className="container w-full">
        {header}
        {children}
      </div>
    </section>
  );
};

export default Panel;
