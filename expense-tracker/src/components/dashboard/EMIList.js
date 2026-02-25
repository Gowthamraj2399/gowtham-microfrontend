import React from "react";
import EMIItem from "./EMIItem";

const EMIList = ({ emis }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight p-0 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[#e5e7eb] dark:border-surface-highlight flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Upcoming EMIs
        </h3>
        <button className="text-xs font-medium text-primary hover:text-blue-400">
          View All
        </button>
      </div>
      <div className="flex flex-col">
        {emis.map((emi) => (
          <EMIItem key={emi.id} {...emi} />
        ))}
      </div>
    </div>
  );
};

export default EMIList;
