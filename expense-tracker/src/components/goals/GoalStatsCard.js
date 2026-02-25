import React from "react";

const GoalStatsCard = ({ stat }) => {
  const { title, value, icon, iconColor, progress, subLabel } = stat;

  return (
    <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
      </div>
      <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
        {value}
      </p>
      {progress !== undefined && (
        <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full">
          <div
            className="h-1 bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {subLabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{subLabel}</p>
      )}
    </div>
  );
};

export default GoalStatsCard;
