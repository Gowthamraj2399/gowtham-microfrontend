import React from "react";

const DataManagement = ({ options, onAction }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm p-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
        Data Management
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAction && onAction(option.id)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-surface-highlight hover:bg-slate-200 dark:hover:bg-surface-highlight/70 text-slate-900 dark:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {option.icon}
            </span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataManagement;
