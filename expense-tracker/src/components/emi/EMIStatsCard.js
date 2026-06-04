import React from "react";

const EMIStatsCard = ({ stat }) => {
  const { title, value, subValue, icon, trend, subValueColor, highlighted, progress } = stat;

  return (
    <div
      className="relative flex flex-col gap-3 rounded-2xl p-5 overflow-hidden"
      style={{
        background: highlighted
          ? "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.08) 100%)"
          : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: highlighted
          ? "1px solid rgba(139,92,246,0.3)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: highlighted ? "0 4px 24px rgba(139,92,246,0.2)" : "none",
      }}
    >
      {highlighted && (
        <div
          className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
          style={{ background: "linear-gradient(180deg, #8B5CF6, #06B6D4)" }}
        />
      )}

      <div className="flex items-start justify-between">
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider">{title}</p>
        <div
          className="p-2 rounded-xl"
          style={{ background: "rgba(139,92,246,0.15)" }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "18px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
      </div>

      <p className="text-white font-bold leading-tight text-2xl">{value}</p>

      {subValue && (
        <p
          className="text-sm font-semibold"
          style={{ color: subValueColor === "text-green-500" ? "#34D399" : subValueColor === "text-red-500" ? "#F87171" : "#7B8FA8" }}
        >
          {subValue}
        </p>
      )}

      {trend && (
        <p className="text-xs font-medium flex items-center gap-1" style={{ color: trend.type === "down" ? "#34D399" : "#F87171" }}>
          <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>
            {trend.type === "down" ? "trending_down" : "trending_up"}
          </span>
          {trend.value}
        </p>
      )}

      {progress && (
        <div className="w-full rounded-full h-1.5 mt-1" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${progress.value}%`, background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
          />
        </div>
      )}
    </div>
  );
};

export default EMIStatsCard;
