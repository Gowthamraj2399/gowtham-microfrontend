import React from "react";

const EMIItem = ({ title, bank, amount, dueDate, status }) => {
  const statusClasses = {
    "due-soon":
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500",
    upcoming: "bg-[#e5e7eb] dark:bg-surface-highlight text-text-secondary",
  };

  const [month, day] = dueDate.split(" ");

  return (
    <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb] dark:border-surface-highlight/50 hover:bg-[#f9fafb] dark:hover:bg-surface-highlight/30 transition-colors last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center justify-center w-10 h-10 rounded bg-[#e5e7eb] dark:bg-surface-highlight text-text-secondary">
          <span className="text-[10px] font-bold uppercase">{month}</span>
          <span className="text-sm font-bold">{day}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="text-xs text-text-secondary">{bank}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {amount}
        </p>
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusClasses[status]}`}
        >
          {status === "due-soon" ? "Due Soon" : "Upcoming"}
        </span>
      </div>
    </div>
  );
};

export default EMIItem;
