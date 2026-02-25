import React from "react";

const Security = ({ securityOptions, onSecurityAction }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Security
      </h2>
      <div className="space-y-4">
        {securityOptions.map((option) => (
          <div key={option.id}>
            <button
              onClick={() => onSecurityAction && onSecurityAction(option.id)}
              className="w-full text-left px-4 py-3 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight hover:bg-slate-50 dark:hover:bg-surface-highlight/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {option.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {option.description}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  {option.icon}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Security;
