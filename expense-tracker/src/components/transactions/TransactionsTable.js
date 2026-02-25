import React, { useState } from "react";
import { statusColors } from "../../config/transactionsConfig";

const TransactionsTable = ({ transactions, filterOptions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 Days");

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    return `${amount >= 0 ? "+" : "-"}$${absAmount.toFixed(2)}`;
  };

  const getAmountColor = (amount) => {
    if (amount >= 0) return "text-green-600 dark:text-green-400";
    return "text-slate-900 dark:text-white";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      transaction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-end gap-4">
        {/* Search & Date */}
        <div className="flex flex-1 flex-wrap gap-4">
          <div className="flex-1 min-w-60">
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Search
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary material-symbols-outlined">
                search
              </span>
              <input
                className="w-full bg-white dark:bg-[#1c2127] border border-gray-200 dark:border-[#3b4754] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-all"
                placeholder="Search by merchant or description..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Date Range
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary material-symbols-outlined">
                calendar_today
              </span>
              <input
                className="w-full bg-white dark:bg-[#1c2127] border border-gray-200 dark:border-[#3b4754] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-gray-400 transition-all"
                type="text"
                value={selectedDateRange}
                readOnly
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined cursor-pointer hover:text-white">
                expand_more
              </span>
            </div>
          </div>
        </div>
        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0 no-scrollbar">
          <button className="whitespace-nowrap flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-md">
            {selectedCategory}
          </button>
          <button className="whitespace-nowrap flex items-center gap-2 h-10 px-4 rounded-lg bg-white dark:bg-[#283039] border border-gray-200 dark:border-transparent text-slate-600 dark:text-gray-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#3b4754] transition-colors">
            Income
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
          <button className="whitespace-nowrap flex items-center gap-2 h-10 px-4 rounded-lg bg-white dark:bg-[#283039] border border-gray-200 dark:border-transparent text-slate-600 dark:text-gray-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#3b4754] transition-colors">
            Expenses
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
          <button className="whitespace-nowrap flex items-center gap-2 h-10 px-4 rounded-lg bg-white dark:bg-[#283039] border border-gray-200 dark:border-transparent text-slate-600 dark:text-gray-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#3b4754] transition-colors">
            Transfers
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#182029] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1c252e] border-b border-gray-200 dark:border-[#3b4754]">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap">
                  Date
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap w-1/3">
                  Description
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap">
                  Category
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap">
                  Type
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap">
                  Status
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap text-right">
                  Amount
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 whitespace-nowrap text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#3b4754]">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="group hover:bg-slate-50 dark:hover:bg-[#1f2833] transition-colors"
                >
                  <td className="p-4 text-sm text-slate-600 dark:text-gray-300 whitespace-nowrap">
                    {transaction.date}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${transaction.iconBg} flex items-center justify-center ${transaction.iconColor} shrink-0`}
                      >
                        <span className="material-symbols-outlined">
                          {transaction.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {transaction.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-gray-300 whitespace-nowrap">
                    {transaction.category}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-gray-300 whitespace-nowrap">
                    {transaction.type}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border ${
                        statusColors[transaction.status]
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-500"
                            : transaction.status === "pending"
                              ? "bg-yellow-500 animate-pulse"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {transaction.statusText}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-sm font-bold ${getAmountColor(
                      transaction.amount,
                    )} text-right whitespace-nowrap`}
                  >
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button className="text-gray-400 hover:text-primary transition-colors p-1">
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-[#3b4754] bg-slate-50 dark:bg-[#1c252e]">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">1</span>{" "}
            to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredTransactions.length}
            </span>{" "}
            results
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#3b4754] text-slate-600 dark:text-gray-400 text-sm font-medium hover:bg-white dark:hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#3b4754] text-slate-600 dark:text-gray-400 text-sm font-medium hover:bg-white dark:hover:bg-[#283039] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
