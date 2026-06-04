import React from "react";

const GoalStatsCard = ({ stat }) => {
  const { title, value, icon, progress, subLabel } = stat;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "20px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
      {progress !== undefined && (
        <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
          />
        </div>
      )}
      {subLabel && <p className="text-xs text-text-secondary">{subLabel}</p>}
    </div>
  );
};

export default GoalStatsCard;
