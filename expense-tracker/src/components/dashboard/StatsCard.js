import React from "react";

const StatsCard = ({ title, value, change, changeType, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };

  const changeColorClasses = {
    positive: "text-[#0bda5b] bg-[#0bda5b]/10",
    negative: "text-orange-500 bg-orange-500/10",
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
        {change && (
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-medium flex items-center ${changeColorClasses[changeType]}`}
          >
            <span className="material-symbols-outlined text-[12px] mr-0.5">
              {changeType === "positive" ? "arrow_upward" : "arrow_downward"}
            </span>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-1">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
