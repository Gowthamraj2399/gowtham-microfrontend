import React from "react";

const PortfolioStatsCard = ({ stat }) => {
  const { title, value, icon, trend, subLabel } = stat;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex justify-between items-start">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#A78BFA" }}
        >
          {title}
        </p>
        <div
          className="p-1.5 rounded-full"
          style={{ background: "rgba(139,92,246,0.12)" }}
        >
          <span
            className="material-symbols-rounded text-lg"
            style={{ color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
      </div>
      <p className="text-white text-3xl font-bold leading-tight">{value}</p>
      {trend && (
        <p className={`${trend.color} text-sm font-medium flex items-center gap-1`}>
          <span>{trend.value}</span>
          <span className="text-sm font-normal" style={{ color: "#7B8FA8" }}>
            {trend.label}
          </span>
        </p>
      )}
      {subLabel && (
        <p className="text-sm font-normal" style={{ color: "#7B8FA8" }}>
          {subLabel}
        </p>
      )}
    </div>
  );
};

export default PortfolioStatsCard;
