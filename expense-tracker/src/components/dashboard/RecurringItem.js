import React from "react";

const RecurringItem = ({ name, icon, frequency, nextDate, amount, color }) => {
  const colorClasses = {
    red: "bg-red-500/10 text-red-600",
    green: "bg-green-500/10 text-green-600",
    blue: "bg-blue-500/10 text-blue-600",
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-xs text-text-secondary">
            {frequency} • Next: {nextDate}
          </p>
        </div>
      </div>
      <p className="text-sm font-bold text-red-500">{amount}</p>
    </div>
  );
};

export default RecurringItem;
