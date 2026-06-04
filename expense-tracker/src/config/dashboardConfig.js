// Monthly spending data — all amounts in USD
export const dashboardConfig = {
  // Top-level stats cards
  stats: [
    {
      id: "this-month",
      title: "This Month",
      value: "$3,248",
      change: "+8.4%",
      changeType: "negative",
      icon: "calendar_month",
      color: "orange",
    },
    {
      id: "last-month",
      title: "Last Month",
      value: "$2,997",
      change: "-3.1% vs Apr",
      changeType: "positive",
      icon: "history",
      color: "blue",
    },
    {
      id: "emis-due",
      title: "EMIs Due",
      value: "$1,650",
      change: "This month",
      changeType: "neutral",
      icon: "credit_card",
      color: "purple",
    },
    {
      id: "recurring-total",
      title: "Recurring",
      value: "$118",
      change: "Monthly auto",
      changeType: "neutral",
      icon: "replay",
      color: "emerald",
    },
  ],

  // Daily spending trend — current month vs previous month
  spendingTrend: {
    title: "Daily Spending",
    subtitle: "Jun vs May 2026",
    data: [
      { day: "1",  thisMonth: 45,  lastMonth: 30 },
      { day: "2",  thisMonth: 0,   lastMonth: 120 },
      { day: "3",  thisMonth: 89,  lastMonth: 55 },
      { day: "4",  thisMonth: 200, lastMonth: 80 },
      { day: "5",  thisMonth: 35,  lastMonth: 200 },
      { day: "6",  thisMonth: 150, lastMonth: 45 },
      { day: "7",  thisMonth: 60,  lastMonth: 90 },
      { day: "8",  thisMonth: 0,   lastMonth: 60 },
      { day: "9",  thisMonth: 95,  lastMonth: 75 },
      { day: "10", thisMonth: 180, lastMonth: 110 },
      { day: "11", thisMonth: 40,  lastMonth: 30 },
      { day: "12", thisMonth: 220, lastMonth: 145 },
      { day: "13", thisMonth: 75,  lastMonth: 65 },
      { day: "14", thisMonth: 130, lastMonth: 90 },
    ],
  },

  // Spending by category — this month
  categoryBreakdown: [
    { name: "Food & Dining",  amount: 820, budget: 900,  icon: "restaurant",       color: "#F59E0B" },
    { name: "Transport",      amount: 340, budget: 400,  icon: "directions_car",   color: "#3B82F6" },
    { name: "Shopping",       amount: 615, budget: 600,  icon: "shopping_bag",     color: "#EC4899" },
    { name: "Entertainment",  amount: 198, budget: 250,  icon: "movie",            color: "#8B5CF6" },
    { name: "Utilities",      amount: 275, budget: 300,  icon: "bolt",             color: "#06B6D4" },
    { name: "Health",         amount: 140, budget: 200,  icon: "health_and_safety",color: "#10B981" },
  ],

  // Month-over-month comparison (last 6 months)
  monthlyComparison: {
    title: "Monthly Spend",
    subtitle: "Last 6 months",
    data: [
      { month: "Jan", amount: 2850 },
      { month: "Feb", amount: 3100 },
      { month: "Mar", amount: 2700 },
      { month: "Apr", amount: 3320 },
      { month: "May", amount: 2997 },
      { month: "Jun", amount: 3248 },
    ],
    previousAvg: 3000,
  },

  // Upcoming EMIs
  upcomingEmis: [
    {
      id: 1,
      title: "Home Loan",
      bank: "HDFC Bank",
      amount: "$1,200",
      dueDate: "Jun 25",
      status: "due-soon",
    },
    {
      id: 2,
      title: "Car Loan",
      bank: "Toyota Finance",
      amount: "$450",
      dueDate: "Jul 02",
      status: "upcoming",
    },
  ],

  // Upcoming recurring payments
  recurringPayments: {
    title: "Recurring",
    total: "$118/mo",
    items: [
      {
        id: 1,
        name: "Netflix",
        icon: "movie",
        frequency: "Monthly",
        nextDate: "Jun 28",
        amount: "-$15.99",
        color: "red",
      },
      {
        id: 2,
        name: "Spotify",
        icon: "music_note",
        frequency: "Family Plan",
        nextDate: "Jul 01",
        amount: "-$12.99",
        color: "green",
      },
      {
        id: 3,
        name: "Internet",
        icon: "wifi",
        frequency: "AT&T Fiber",
        nextDate: "Jul 05",
        amount: "-$89.00",
        color: "blue",
      },
    ],
  },

  // Recent transactions (expenses only)
  recentTransactions: [
    { id: 1, title: "Starbucks",        category: "Food & Dining", date: "Today, 9:14am", amount: -8.5,   icon: "local_cafe" },
    { id: 2, title: "Uber",             category: "Transport",     date: "Today, 8:02am", amount: -14.2,  icon: "directions_car" },
    { id: 3, title: "Amazon",           category: "Shopping",      date: "Yesterday",     amount: -67.99, icon: "shopping_bag" },
    { id: 4, title: "Electricity Bill", category: "Utilities",     date: "Jun 02",        amount: -89.0,  icon: "bolt" },
    { id: 5, title: "Zomato",           category: "Food & Dining", date: "Jun 01",        amount: -32.5,  icon: "restaurant" },
  ],
};

