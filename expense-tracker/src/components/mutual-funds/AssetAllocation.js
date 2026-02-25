import React from "react";

const AssetAllocation = ({ allocations, totalFunds = 12 }) => {
  // Calculate conic gradient based on percentages
  const getConicGradient = () => {
    let gradient = "conic-gradient(";
    let currentPercent = 0;

    allocations.forEach((allocation, index) => {
      const startPercent = currentPercent;
      currentPercent += allocation.percentage;

      if (index > 0) gradient += ", ";

      const colorMap = {
        "bg-primary": "#137fec",
        "bg-[#0bda5b]": "#0bda5b",
        "bg-amber-400": "#fbbf24",
      };

      const color = colorMap[allocation.color] || "#137fec";
      gradient += `${color} ${startPercent}% ${currentPercent}%`;
    });

    gradient += ")";
    return gradient;
  };

  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-[#283039] shadow-sm border border-gray-100 dark:border-none p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Asset Allocation
      </h3>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* CSS Conic Gradient Donut */}
        <div
          className="w-48 h-48 rounded-full relative"
          style={{ background: getConicGradient() }}
        >
          <div className="absolute inset-4 bg-white dark:bg-[#283039] rounded-full flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalFunds}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#9dabb9] font-medium">
              Active Funds
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {allocations.map((allocation) => (
          <div
            key={allocation.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${allocation.dotColor}`}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {allocation.category}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {allocation.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetAllocation;
