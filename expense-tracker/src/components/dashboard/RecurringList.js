import React from "react";
import RecurringItem from "./RecurringItem";

const RecurringList = ({ title, total, items }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight p-4 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-text-secondary">Total: {total}</p>
      </div>
      {items.map((item) => (
        <RecurringItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default RecurringList;
