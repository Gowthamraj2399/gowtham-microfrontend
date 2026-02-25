import React from "react";

const Preferences = ({ preferences, options, onChange }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Preferences
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {options.currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => onChange("language", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {options.languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => onChange("dateFormat", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-surface-highlight bg-white dark:bg-surface-dark text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {options.dateFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
