import React from "react";

const EMIStatsCard = ({ stat }) => {
  const {
    title,
    value,
    subValue,
    icon,
    iconBgColor,
    iconColor,
    trend,
    subValueColor,
    highlighted,
    progress,
  } = stat;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-surface-dark border shadow-sm ${
        highlighted
          ? "border-blue-500/30 dark:border-blue-500/50 shadow-[0_0_15px_rgba(19,127,236,0.1)] relative overflow-hidden"
          : "border-[#e5e7eb] dark:border-surface-highlight"
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
      )}

      <div className="flex items-start justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <span
            className={`material-symbols-outlined ${iconColor} text-[20px]`}
          >
            {icon}
          </span>
        </div>
      </div>

      <p
        className={`text-slate-900 dark:text-white font-bold leading-tight ${
          subValue ? "text-2xl" : "text-3xl"
        }`}
      >
        {value}
      </p>

      {subValue && (
        <p className={`text-sm font-bold mt-1 ${subValueColor}`}>{subValue}</p>
      )}

      {trend && (
        <p
          className={`${trend.color} text-xs font-medium flex items-center gap-1`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {trend.type === "down" ? "trending_down" : "trending_up"}
          </span>
          {trend.value}
        </p>
      )}

      {progress && (
        <div className="w-full bg-gray-200 dark:bg-[#283039] rounded-full h-1.5 mt-2">
          <div
            className={`${progress.color} h-1.5 rounded-full`}
            style={{ width: `${progress.value}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default EMIStatsCard;
