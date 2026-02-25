import React from "react";

const RecurringStatsCard = ({ stat }) => {
  const {
    title,
    value,
    icon,
    iconColor,
    trend,
    subLabel,
    subLabelColor,
    isAlert,
  } = stat;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-surface-dark border shadow-sm ${
        isAlert
          ? "border-red-500/30 dark:border-red-500/30"
          : "border-[#e5e7eb] dark:border-surface-highlight"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        <p
          className={`${isAlert ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"} text-sm font-medium uppercase tracking-wider`}
        >
          {title}
        </p>
      </div>
      <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
        {value}
      </p>
      {trend && (
        <p
          className={`${trend.color} text-sm font-medium flex items-center gap-1`}
        >
          <span className="material-symbols-outlined text-sm">
            {trend.type === "down" ? "trending_down" : "trending_up"}
          </span>
          {trend.value}
        </p>
      )}
      {subLabel && (
        <p
          className={`${subLabelColor || "text-slate-500 dark:text-slate-400"} text-sm font-normal`}
        >
          {subLabel}
        </p>
      )}
    </div>
  );
};

export default RecurringStatsCard;
