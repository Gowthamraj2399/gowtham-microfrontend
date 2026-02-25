import React from "react";

const PortfolioStatsCard = ({ stat }) => {
  const { title, value, icon, iconBgColor, iconColor, trend, subLabel } = stat;

  return (
    <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-surface-dark shadow-sm border border-[#e5e7eb] dark:border-surface-highlight">
      <div className="flex justify-between items-start">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <div className={`p-1.5 ${iconBgColor} rounded-full`}>
          <span className={`material-symbols-outlined ${iconColor} text-lg`}>
            {icon}
          </span>
        </div>
      </div>
      <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
        {value}
      </p>
      {trend && (
        <p
          className={`${trend.color} text-sm font-medium flex items-center gap-1`}
        >
          <span>{trend.value}</span>
          <span className="text-slate-500 dark:text-slate-400 font-normal">
            {trend.label}
          </span>
        </p>
      )}
      {subLabel && (
        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
          {subLabel}
        </p>
      )}
    </div>
  );
};

export default PortfolioStatsCard;
