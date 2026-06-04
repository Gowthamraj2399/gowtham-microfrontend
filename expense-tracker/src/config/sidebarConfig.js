export const sidebarConfig = {
  logo: {
    icon: "account_balance_wallet",
    title: "SpendTracker",
    subtitle: "Spending Insights",
  },
  menuItems: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "receipt_long",
      path: "/transactions",
    },
    {
      id: "categories",
      label: "Categories",
      icon: "category",
      path: "/categories",
    },
    {
      id: "payment-methods",
      label: "Accounts & Cards",
      icon: "account_balance_wallet",
      path: "/payment-methods",
    },
    {
      id: "emi",
      label: "EMIs",
      icon: "credit_card",
      path: "/emi",
    },
    {
      id: "recurring-payments",
      label: "Recurring",
      icon: "replay",
      path: "/recurring-payments",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      path: "/settings",
    },
  ],
};
