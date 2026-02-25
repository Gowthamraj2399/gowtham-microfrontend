import React from "react";

const AccountInfo = ({ accountData, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    onSave && onSave(data);
  };

  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Account Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            defaultValue={accountData.fullName}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            defaultValue={accountData.email}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={accountData.phone}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-primary/20"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountInfo;
