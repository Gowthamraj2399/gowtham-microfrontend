import React, { useState } from "react";
import AccountInfo from "../../components/settings/AccountInfo";
import Preferences from "../../components/settings/Preferences";
import Notifications from "../../components/settings/Notifications";
import Security from "../../components/settings/Security";
import AccountStatus from "../../components/settings/AccountStatus";
import DataManagement from "../../components/settings/DataManagement";
import DangerZone from "../../components/settings/DangerZone";
import {
  accountInfo,
  preferenceOptions,
  defaultPreferences,
  notificationOptions,
  securityOptions,
  accountStatus,
  dataManagementOptions,
} from "../../config/settingsConfig";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(
    notificationOptions.reduce((acc, option) => {
      acc[option.key] = option.defaultValue;
      return acc;
    }, {}),
  );

  const [preferences, setPreferences] = useState(defaultPreferences);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleAccountSave = (data) => {
    console.log("Saving account info:", data);
    // Add your save logic here
  };

  const handleSecurityAction = (actionId) => {
    console.log("Security action:", actionId);
    // Add your security action logic here
  };

  const handleDataAction = (actionId) => {
    console.log("Data action:", actionId);
    // Add your data management logic here
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      console.log("Clearing all data");
      // Add your clear data logic here
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      console.log("Deleting account");
      // Add your delete account logic here
    }
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 py-6 pb-20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <AccountInfo accountData={accountInfo} onSave={handleAccountSave} />
          <Preferences
            preferences={preferences}
            options={preferenceOptions}
            onChange={handlePreferenceChange}
          />
          <Notifications
            notifications={notifications}
            notificationOptions={notificationOptions}
            onToggle={toggleNotification}
          />
          <Security
            securityOptions={securityOptions}
            onSecurityAction={handleSecurityAction}
          />
        </div>

        {/* Sidebar - Quick Actions & Info */}
        <div className="space-y-6">
          <AccountStatus status={accountStatus} />
          <DataManagement
            options={dataManagementOptions}
            onAction={handleDataAction}
          />
          <DangerZone
            onClearData={handleClearData}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
