import React from "react";

const GoalItem = ({ title, icon, current, target, color }) => {
  const percentage = Math.round((current / target) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-lg text-${color}-500`}
          >
            {icon}
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </p>
        </div>
        <p className="text-xs font-medium text-text-secondary">
          ${current.toLocaleString()} / ${target.toLocaleString()}
        </p>
      </div>
      <div className="w-full bg-[#e5e7eb] dark:bg-surface-highlight rounded-full h-2.5 overflow-hidden">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${
            color === "emerald" ? "teal" : "indigo"
          }-500 h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-secondary">{percentage}% complete</span>
        <span
          className={`font-medium ${
            percentage >= 100
              ? "text-green-500"
              : percentage >= 75
              ? "text-blue-500"
              : "text-orange-500"
          }`}
        >
          ${Math.max(0, target - current).toLocaleString()} left
        </span>
      </div>
    </div>
  );
};

export default GoalItem;
