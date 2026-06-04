import React from "react";

const colorMap = {
  red: { bg: "rgba(239,68,68,0.12)", text: "#F87171" },
  green: { bg: "rgba(16,185,129,0.12)", text: "#34D399" },
  blue: { bg: "rgba(139,92,246,0.12)", text: "#A78BFA" },
  amber: { bg: "rgba(245,158,11,0.12)", text: "#FBBF24" },
  cyan: { bg: "rgba(6,182,212,0.12)", text: "#22D3EE" },
};

const RecurringItem = ({ name, icon, frequency, nextDate, amount, color }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: c.bg }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "18px", color: c.text, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-text-secondary">{frequency} · {nextDate}</p>
        </div>
      </div>
      <p className="text-sm font-bold" style={{ color: "#F87171" }}>{amount}</p>
    </div>
  );
};

export default RecurringItem;
