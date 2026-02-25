import React from "react";

const TransactionStatsCard = ({ stat }) => {
  const { title, value, icon, iconBg, iconColor, trend } = stat;

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <span
          className={`material-symbols-outlined ${iconColor} ${iconBg} p-1.5 rounded-lg`}
        >
          {icon}
        </span>
      </div>
      <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
        {value}
      </p>
      {trend && (
        <p className={`${trend.color} text-sm font-medium`}>
          {trend.value}{" "}
          <span className="text-slate-500 dark:text-slate-400 font-normal">
            {trend.label}
          </span>
        </p>
      )}
    </div>
  );
};

export default TransactionStatsCard;
