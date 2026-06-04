import React from "react";

const colorToHex = {
  emerald: "#10B981",
  blue: "#8B5CF6",
  amber: "#F59E0B",
  rose: "#F43F5E",
  cyan: "#06B6D4",
};

const GoalItem = ({ title, icon, current, target, color }) => {
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const hex = colorToHex[color] || "#8B5CF6";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "18px", color: hex, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
        <p className="text-xs text-text-secondary">
          ${current.toLocaleString()} / ${target.toLocaleString()}
        </p>
      </div>
      <div
        className="w-full rounded-full h-1.5 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${hex}, ${hex}99)` }}
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-secondary">{percentage}% complete</span>
        <span style={{ color: hex, fontWeight: 600 }}>
          ${Math.max(0, target - current).toLocaleString()} left
        </span>
      </div>
    </div>
  );
};

export default GoalItem;
