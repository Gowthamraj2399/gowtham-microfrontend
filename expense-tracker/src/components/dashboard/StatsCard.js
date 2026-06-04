import React from "react";
import { motion } from "framer-motion";

const colorMap = {
  blue:    { icon: "rgba(139,92,246,0.15)",  iconText: "#A78BFA", glow: "rgba(139,92,246,0.15)"  },
  emerald: { icon: "rgba(16,185,129,0.15)",  iconText: "#34D399", glow: "rgba(16,185,129,0.15)"  },
  orange:  { icon: "rgba(245,158,11,0.15)",  iconText: "#FBBF24", glow: "rgba(245,158,11,0.15)"  },
  purple:  { icon: "rgba(168,85,247,0.15)",  iconText: "#C084FC", glow: "rgba(168,85,247,0.15)"  },
  red:     { icon: "rgba(239,68,68,0.15)",   iconText: "#F87171", glow: "rgba(239,68,68,0.15)"   },
};

const changePalette = {
  positive: { bg: "rgba(16,185,129,0.12)",  text: "#34D399", arrow: "arrow_upward"   },
  negative: { bg: "rgba(239,68,68,0.12)",   text: "#F87171", arrow: "arrow_downward" },
  neutral:  { bg: "rgba(255,255,255,0.07)", text: "#7B8FA8", arrow: null             },
};

const StatsCard = ({ title, value, change, changeType = "neutral", icon, color }) => {
  const colors = colorMap[color] || colorMap.blue;
  const cp     = changePalette[changeType] || changePalette.neutral;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative flex flex-col rounded-2xl p-4 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `0 4px 20px ${colors.glow}`,
      }}
    >
      {/* Top row: icon + title */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-2 rounded-xl shrink-0" style={{ background: colors.icon }}>
          <span className="material-symbols-rounded"
            style={{ fontSize: "18px", color: colors.iconText, fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider leading-tight">
          {title}
        </p>
      </div>

      {/* Value */}
      <p className="text-white text-2xl font-black tracking-tight leading-none mb-3">
        {value}
      </p>

      {/* Change pill */}
      {change && (
        <span className="self-start inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold"
          style={{ background: cp.bg, color: cp.text }}>
          {cp.arrow && (
            <span className="material-symbols-rounded"
              style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>
              {cp.arrow}
            </span>
          )}
          {change}
        </span>
      )}
    </motion.div>
  );
};

export default StatsCard;
