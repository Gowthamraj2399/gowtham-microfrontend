import React from "react";

const AccountStatus = ({ status }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm p-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
        Account Status
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Member Since
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {status.memberSince}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Account Type
          </span>
          <span className="text-sm font-medium text-primary">
            {status.accountType}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Storage Used
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {status.storageUsed} / {status.storageTotal}
          </span>
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${status.storagePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AccountStatus;
