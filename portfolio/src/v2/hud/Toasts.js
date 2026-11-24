import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../state/useGameStore";

const styles = {
  mission: { label: "Mission", color: "text-city-sun", bar: "bg-city-sun" },
  achievement: { label: "Achievement", color: "text-city-teal", bar: "bg-city-teal" },
  district: { label: "New district", color: "text-city-pink", bar: "bg-city-pink" },
};

const Toasts = () => {
  const toasts = useGameStore((s) => s.toasts);
  const dismiss = useGameStore((s) => s.dismissToast);

  return (
    <div
      aria-live="polite"
      className="fixed z-50 right-3 md:right-6 top-[4.5rem] md:top-24 flex flex-col items-end gap-2 pointer-events-none w-[min(calc(100vw-1.5rem),340px)]"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const s = styles[t.kind] || styles.district;
          return (
            <motion.button
              type="button"
              key={t.id}
              layout
              onClick={() => dismiss(t.id)}
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="pointer-events-auto hud-glass rounded-xl w-full text-center px-5 py-3 overflow-hidden relative"
            >
              <div className={`f-mono text-[10px] uppercase tracking-[0.25em] ${s.color}`}>{s.label}</div>
              <div className={`f-display text-xl md:text-2xl uppercase ${s.color}`}>{t.title}</div>
              <div className="text-xs text-white/75">{t.subtitle}</div>
              <motion.span
                className={`absolute left-0 bottom-0 h-0.5 w-full origin-left ${s.bar}`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.8, ease: "linear" }}
              />
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
