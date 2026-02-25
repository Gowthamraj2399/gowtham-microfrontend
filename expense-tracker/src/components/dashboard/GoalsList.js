import React from "react";
import GoalItem from "./GoalItem";

const GoalsList = ({ goals }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight p-4 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Savings Goals
        </h3>
        <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#e5e7eb] dark:hover:bg-surface-highlight text-text-secondary">
          <span className="material-symbols-outlined text-base">add</span>
        </button>
      </div>
      {goals.map((goal) => (
        <GoalItem key={goal.id} {...goal} />
      ))}
    </div>
  );
};

export default GoalsList;
