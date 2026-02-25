export const accountInfo = {
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
};

export const preferenceOptions = {
  currencies: [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "JPY", label: "JPY - Japanese Yen" },
  ],
  languages: [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Japanese", label: "Japanese" },
  ],
  dateFormats: [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  ],
};

export const defaultPreferences = {
  currency: "USD",
  language: "English",
  dateFormat: "MM/DD/YYYY",
};

export const notificationOptions = [
  {
    key: "emailAlerts",
    title: "Email Alerts",
    description: "Receive email notifications for important updates",
    defaultValue: true,
  },
  {
    key: "pushNotifications",
    title: "Push Notifications",
    description: "Get push notifications on your device",
    defaultValue: true,
  },
  {
    key: "weeklyReport",
    title: "Weekly Report",
    description: "Receive weekly financial summary report",
    defaultValue: false,
  },
  {
    key: "monthlyReport",
    title: "Monthly Report",
    description: "Get detailed monthly financial analysis",
    defaultValue: true,
  },
];

export const securityOptions = [
  {
    id: "change-password",
    title: "Change Password",
    description: "Update your account password",
    icon: "chevron_right",
  },
  {
    id: "two-factor",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security",
    icon: "chevron_right",
  },
  {
    id: "active-sessions",
    title: "Active Sessions",
    description: "Manage your active login sessions",
    icon: "chevron_right",
  },
];

export const accountStatus = {
  memberSince: "Jan 2024",
  accountType: "Premium",
  storageUsed: "2.4 GB",
  storageTotal: "10 GB",
  storagePercentage: 24,
};

export const dataManagementOptions = [
  {
    id: "export",
    label: "Export Data",
    icon: "download",
  },
  {
    id: "import",
    label: "Import Data",
    icon: "upload",
  },
  {
    id: "backup",
    label: "Backup Now",
    icon: "backup",
  },
];
