import React from "react";

const RecurringStatsCard = ({ stat }) => {
  const {
    title,
    value,
    icon,
    trend,
    subLabel,
    subLabelColor,
    isAlert,
  } = stat;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: isAlert
          ? "1px solid rgba(239,68,68,0.3)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="p-1.5 rounded-full"
          style={{
            background: isAlert
              ? "rgba(239,68,68,0.12)"
              : "rgba(139,92,246,0.12)",
          }}
        >
          <span
            className="material-symbols-rounded text-lg"
            style={{
              color: isAlert ? "#F87171" : "#A78BFA",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {icon}
          </span>
        </div>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: isAlert ? "#F87171" : "#A78BFA" }}
        >
          {title}
        </p>
      </div>
      <p className="text-white text-3xl font-bold leading-tight">{value}</p>
      {trend && (
        <p className={`${trend.color} text-sm font-medium flex items-center gap-1`}>
          <span
            className="material-symbols-rounded text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {trend.type === "down" ? "trending_down" : "trending_up"}
          </span>
          {trend.value}
        </p>
      )}
      {subLabel && (
        <p
          className={`text-sm font-normal ${subLabelColor || ""}`}
          style={!subLabelColor ? { color: "#7B8FA8" } : undefined}
        >
          {subLabel}
        </p>
      )}
    </div>
  );
};

export default RecurringStatsCard;
