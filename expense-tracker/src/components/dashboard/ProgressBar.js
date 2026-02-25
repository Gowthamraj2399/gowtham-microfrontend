import React from "react";

const ProgressBar = ({ name, value, percentage, color = "primary" }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-900 dark:text-white">
          {name}
        </span>
        <span className="font-bold text-text-secondary">{value}</span>
      </div>
      <div className="w-full bg-[#e5e7eb] dark:bg-surface-highlight rounded-full h-2 overflow-hidden">
        <div
          className={`bg-${color} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Portfolio Allocation Progress Bar Chart Component
export const PortfolioChart = ({ allocations }) => {
  const COLORS = {
    primary: "#137fec",
    "purple-500": "#a855f7",
    "orange-500": "#f97316",
    "emerald-500": "#10b981",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-surface-dark border border-surface-highlight rounded-lg p-3 shadow-lg">
          <p className="font-medium text-slate-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-text-secondary">
            {data.value} ({data.percentage}%)
          </p>
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
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[allocation.color] || allocation.color,
                  }}
                ></div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {allocation.name}
                </span>
              </div>
              <span className="font-bold text-text-secondary">
                {allocation.value}
              </span>
            </div>
            <div className="w-full bg-[#e5e7eb] dark:bg-surface-highlight rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-1000 ease-out hover:opacity-80"
                style={{
                  width: `${allocation.percentage}%`,
                  backgroundColor: COLORS[allocation.color] || allocation.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
