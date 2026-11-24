import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { contacts, phoneMessages, profile } from "../data/content";
import { useGameStore } from "../state/useGameStore";
import { Icon } from "./icons";

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// The phone screen itself — used inline in the Contact panel and as the HUD overlay.
export const PhoneScreen = ({ onClose, animateMessages = true }) => {
  const time = useClock();
  return (
    <div className="relative w-[290px] h-[560px] rounded-[2.4rem] bg-city-night border-[6px] border-[#26264a] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-6 pt-3 pb-1 f-mono text-[11px] text-white/80">
        <span>{time}</span>
        <span className="w-16 h-4 rounded-full bg-black" aria-hidden="true" />
        <span>5G ▮▮▮</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <img src={profile.portrait} alt="" className="w-9 h-9 rounded-full object-cover bg-city-violet" />
        <div className="leading-tight flex-1">
          <div className="font-semibold text-sm">{profile.name}</div>
          <div className="f-mono text-[10px] text-city-teal">online</div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close phone" className="p-2 hover:text-city-pink">
            <FaTimes />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2">
        {phoneMessages.map((m, i) => (
          <motion.div
            key={m}
            initial={animateMessages ? { opacity: 0, y: 10 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 + i * 0.45 }}
            className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-sm"
          >
            {m}
          </motion.div>
        ))}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <div className="f-mono text-[10px] uppercase text-white/50 px-1">Contacts</div>
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-city-violet to-city-pink px-3 py-2.5 hover:brightness-110 transition"
            >
              <span className="w-8 h-8 rounded-full bg-black/25 grid place-items-center">
                <Icon name={c.icon} />
              </span>
              <span className="leading-tight min-w-0">
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="block text-[11px] text-white/80 truncate">{c.handle}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="h-1 w-24 mx-auto mb-2 rounded-full bg-white/40" aria-hidden="true" />
    </div>
  );
};

const PhoneOverlay = () => {
  const open = useGameStore((s) => s.phoneOpen);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Phone"
          className="fixed z-50 right-3 md:right-8 bottom-3 md:bottom-8"
          initial={{ y: "110%", rotate: 6 }}
          animate={{ y: 0, rotate: 0 }}
          exit={{ y: "120%", rotate: 6 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
        >
          <PhoneScreen onClose={() => setPhoneOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhoneOverlay;
