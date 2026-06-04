import React from "react";

const TransactionStatsCard = ({ stat }) => {
  const { title, value, icon, trend } = stat;

  const isPositive = trend?.value?.startsWith("+") || trend?.color?.includes("green");

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider">{title}</p>
        <span
          className="material-symbols-rounded p-2 rounded-xl"
          style={{
            fontSize: "18px",
            color: "#A78BFA",
            fontVariationSettings: "'FILL' 1",
            background: "rgba(139,92,246,0.12)",
          }}
        >
          {icon}
        </span>
      </div>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
      {trend && (
        <p
          className="text-sm font-medium flex items-center gap-1"
          style={{ color: isPositive ? "#34D399" : "#F87171" }}
        >
          {trend.value}{" "}
          <span style={{ color: "#7B8FA8", fontWeight: 400 }}>{trend.label}</span>
        </p>
      )}
    </div>
  );
};

export default TransactionStatsCard;
