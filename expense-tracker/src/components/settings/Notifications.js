import React from "react";

const Notifications = ({ notifications, notificationOptions, onToggle }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Notifications
      </h2>
      <div className="space-y-4">
        {notificationOptions.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3 border-b border-[#e5e7eb] dark:border-surface-highlight last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {item.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {item.description}
              </p>
            </div>
            <button
              onClick={() => onToggle(item.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[item.key]
                  ? "bg-primary"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[item.key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
