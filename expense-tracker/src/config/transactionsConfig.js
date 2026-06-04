// Spending-focused transaction stats
export const transactionStats = [
  {
    id: 1,
    title: "Total Spent",
    value: "$3,248.00",
    icon: "payments",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    trend: { value: "+8.4%", label: "vs May", color: "text-red-400" },
  },
  {
    id: 2,
    title: "Avg Daily Spend",
    value: "$108.27",
    icon: "trending_up",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    trend: { value: "-$12", label: "vs last month", color: "text-green-400" },
  },
  {
    id: 3,
    title: "Largest Expense",
    value: "$220.00",
    icon: "arrow_upward",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    trend: { value: "Jun 12", label: "Amazon order", color: "text-text-secondary" },
  },
];

export const transactions = [
  { id: 1, date: "Jun 04, 2026", title: "Starbucks",      description: "Coffee & Snacks",    category: "Food & Dining",  type: "Food",         status: "completed", statusText: "Done", amount: -8.5,   icon: "local_cafe" },
  { id: 2, date: "Jun 04, 2026", title: "Uber",           description: "Ride to office",     category: "Transport",      type: "Transport",    status: "completed", statusText: "Done", amount: -14.2,  icon: "directions_car" },
  { id: 3, date: "Jun 03, 2026", title: "Amazon",         description: "Electronics order",  category: "Shopping",       type: "Shopping",     status: "completed", statusText: "Done", amount: -67.99, icon: "shopping_bag" },
  { id: 4, date: "Jun 02, 2026", title: "Electricity Bill", description: "TNEB Monthly Bill", category: "Utilities",     type: "Bill",         status: "completed", statusText: "Done", amount: -89.0,  icon: "bolt" },
  { id: 5, date: "Jun 01, 2026", title: "Zomato",         description: "Lunch delivery",     category: "Food & Dining",  type: "Food",         status: "completed", statusText: "Done", amount: -32.5,  icon: "restaurant" },
  { id: 6, date: "Jun 01, 2026", title: "Netflix",        description: "Monthly subscription", category: "Entertainment", type: "Subscription", status: "completed", statusText: "Done", amount: -15.99, icon: "movie" },
  { id: 7, date: "May 30, 2026", title: "Reliance Fresh", description: "Groceries",          category: "Food & Dining",  type: "Groceries",    status: "completed", statusText: "Done", amount: -54.3,  icon: "local_grocery_store" },
  { id: 8, date: "May 29, 2026", title: "Petrol - HP",    description: "Fuel refill",        category: "Transport",      type: "Transport",    status: "completed", statusText: "Done", amount: -45.0,  icon: "local_gas_station" },
  { id: 9, date: "May 28, 2026", title: "Pharmacy",       description: "Medicines",          category: "Health",         type: "Health",       status: "completed", statusText: "Done", amount: -28.5,  icon: "health_and_safety" },
  { id: 10, date: "May 26, 2026", title: "Spotify",       description: "Family plan",        category: "Entertainment",  type: "Subscription", status: "completed", statusText: "Done", amount: -12.99, icon: "music_note" },
];

export const statusColors = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const filterOptions = {
  categories: ["All Categories", "Food & Dining", "Transport", "Shopping", "Entertainment", "Utilities", "Health"],
  types: ["All", "Food", "Groceries", "Transport", "Shopping", "Bill", "Subscription", "Health"],
  dateRanges: ["This Month", "Last Month", "Last 7 Days", "Last 30 Days", "Custom Range"],
};
