import React from "react";

const colorMap = {
  "bg-primary": "#8B5CF6",
  "bg-[#0bda5b]": "#0bda5b",
  "bg-amber-400": "#fbbf24",
};

const AssetAllocation = ({ allocations, totalFunds = 12 }) => {
  const getConicGradient = () => {
    let gradient = "conic-gradient(";
    let currentPercent = 0;

    allocations.forEach((allocation, index) => {
      const startPercent = currentPercent;
      currentPercent += allocation.percentage;
      if (index > 0) gradient += ", ";
      const color =
        colorMap[allocation.color] || colorMap[allocation.dotColor] || "#8B5CF6";
      gradient += `${color} ${startPercent}% ${currentPercent}%`;
    });

    gradient += ")";
    return gradient;
  };

  return (
    <div
      className="flex flex-col rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <h3 className="text-white font-bold text-lg mb-6">Asset Allocation</h3>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div
          className="w-48 h-48 rounded-full relative"
          style={{ background: getConicGradient() }}
        >
          <div
            className="absolute inset-4 rounded-full flex flex-col items-center justify-center"
            style={{ background: "#080B14" }}
          >
            <span className="text-2xl font-bold text-white">{totalFunds}</span>
            <span className="text-xs font-medium" style={{ color: "#7B8FA8" }}>
              Active Funds
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {allocations.map((allocation) => (
          <div key={allocation.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background:
                    colorMap[allocation.color] ||
                    colorMap[allocation.dotColor] ||
                    "#8B5CF6",
                }}
              ></div>
              <span className="text-sm" style={{ color: "#7B8FA8" }}>
                {allocation.category}
              </span>
            </div>
            <span className="text-sm font-bold text-white">
              {allocation.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetAllocation;
