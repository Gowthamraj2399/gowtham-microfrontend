import React from "react";

const ProgressBar = ({ name, value, percentage, color = "primary" }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-white">{name}</span>
        <span className="font-semibold text-text-secondary">{value}</span>
      </div>
      <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
        />
      </div>
    </div>
  );
};

// Portfolio Allocation Progress Bar Chart Component
export const PortfolioChart = ({ allocations }) => {
  const COLORS = {
    primary: "#8B5CF6",
    "purple-500": "#A78BFA",
    "orange-500": "#F59E0B",
    "emerald-500": "#10B981",
    "cyan-500": "#06B6D4",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: "rgba(13,17,23,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "8px 12px",
        }}>
          <p style={{ color: "#E2E8F0", fontWeight: 600, fontSize: 13 }}>{data.name}</p>
          <p style={{ color: "#7B8FA8", fontSize: 12, marginTop: 2 }}>{data.value} ({data.percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="space-y-3">
        {allocations.map((allocation, index) => (
          <div key={allocation.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[allocation.color] || allocation.color }}
                />
                <span className="font-medium text-white">{allocation.name}</span>
              </div>
              <span className="font-semibold text-text-secondary">{allocation.value}</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${allocation.percentage}%`,
                  background: `linear-gradient(90deg, ${COLORS[allocation.color] || allocation.color}, ${COLORS[allocation.color] || allocation.color}99)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
