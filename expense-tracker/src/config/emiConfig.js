export const emiStats = [
  {
    id: 1,
    title: "Total Monthly EMI",
    value: "$1,250",
    icon: "payments",
    iconBgColor: "bg-blue-100 dark:bg-[#1c2a38]",
    iconColor: "text-primary",
    trend: {
      value: "2.5% less than last month",
      type: "down",
      color: "text-green-600 dark:text-green-400",
    },
  },
  {
    id: 2,
    title: "Next Payment Due",
    value: "Car Loan ($350)",
    subValue: "Due in 3 days",
    icon: "notification_important",
    iconBgColor: "bg-orange-100 dark:bg-[#38281c]",
    iconColor: "text-orange-500",
    subValueColor: "text-orange-600 dark:text-orange-400",
    highlighted: true,
  },
  {
    id: 3,
    title: "Total Outstanding Debt",
    value: "$145,000",
    icon: "account_balance",
    iconBgColor: "bg-purple-100 dark:bg-[#2a1c38]",
    iconColor: "text-purple-500",
    progress: {
      value: 65,
      color: "bg-purple-500",
    },
  },
];

export const upcomingPayments = [
  {
    id: 1,
    name: "Car Loan",
    lender: "Chase Bank",
    accountNumber: "**** 4829",
    amount: "$350.00",
    icon: "directions_car",
    status: "due",
    statusText: "Due in 3 days",
    statusColor:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    daysUntilDue: 3,
  },
  {
    id: 2,
    name: "Home Mortgage",
    lender: "Wells Fargo",
    accountNumber: "**** 1102",
    amount: "$900.00",
    icon: "home",
    status: "paid",
    statusText: "Paid",
    statusColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    isPaid: true,
  },
];

export const activeLoans = [
  {
    id: 1,
    loanName: "Car Loan",
    lender: "Chase Bank",
    monthlyEMI: "$350.00",
    paidMonths: 12,
    totalMonths: 48,
    progress: 25,
    progressColor: "bg-primary",
  },
  {
    id: 2,
    loanName: "Home Mortgage",
    lender: "Wells Fargo",
    monthlyEMI: "$900.00",
    paidMonths: 24,
    totalMonths: 360,
    progress: 6.6,
    progressColor: "bg-purple-500",
  },
  {
    id: 3,
    loanName: "Personal Loan",
    lender: "Citi Bank",
    monthlyEMI: "$150.00",
    paidMonths: 5,
    totalMonths: 12,
    progress: 41,
    progressColor: "bg-green-500",
  },
];
