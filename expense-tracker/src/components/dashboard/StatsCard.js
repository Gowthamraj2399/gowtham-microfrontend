import React from "react";
import { motion } from "framer-motion";

const colorMap = {
  blue: {
    icon: "rgba(139,92,246,0.15)",
    iconText: "#A78BFA",
    glow: "rgba(139,92,246,0.2)",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.06) 100%)",
  },
  emerald: {
    icon: "rgba(16,185,129,0.15)",
    iconText: "#34D399",
    glow: "rgba(16,185,129,0.2)",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 100%)",
  },
  orange: {
    icon: "rgba(245,158,11,0.15)",
    iconText: "#FBBF24",
    glow: "rgba(245,158,11,0.2)",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.05) 100%)",
  },
  purple: {
    icon: "rgba(139,92,246,0.15)",
    iconText: "#C084FC",
    glow: "rgba(168,85,247,0.2)",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(139,92,246,0.06) 100%)",
  },
};

const StatsCard = ({ title, value, change, changeType, icon, color }) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative flex flex-col gap-4 rounded-2xl p-5 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: `0 4px 24px ${colors.glow}`,
      }}
    >
      {/* Background gradient accent */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: colors.gradient }}
      />

      <div className="relative flex justify-between items-start">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: colors.icon }}
        >
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: "20px",
              color: colors.iconText,
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {icon}
          </span>
        </div>
        {change && (
          <span
            className="px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-0.5"
            style={{
              background:
                changeType === "positive"
                  ? "rgba(16,185,129,0.12)"
                  : "rgba(239,68,68,0.12)",
              color: changeType === "positive" ? "#34D399" : "#F87171",
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{ fontSize: "12px", fontVariationSettings: "'FILL' 1" }}
            >
              {changeType === "positive" ? "arrow_upward" : "arrow_downward"}
            </span>
            {change}
          </span>
        )}
      </div>

      <div className="relative">
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-white text-2xl font-bold tracking-tight leading-tight">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
