import React from "react";

const DangerZone = ({ onClearData, onDeleteAccount }) => {
  return (
    <div className="rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 shadow-sm p-6">
      <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 uppercase tracking-wider">
        Danger Zone
      </h3>
      <div className="space-y-3">
        <button
          onClick={onClearData}
          className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-surface-dark border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
        >
          Clear All Data
        </button>
        <button
          onClick={onDeleteAccount}
          className="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DangerZone;
