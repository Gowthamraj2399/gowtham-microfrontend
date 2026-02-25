import React, { useState } from "react";

const HoldingsTable = ({ holdings }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHoldings = holdings.filter((holding) =>
    holding.fundName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const getCategoryBadgeClass = (color) => {
    const colorMap = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green:
        "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      amber:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-[#283039] shadow-sm border border-gray-100 dark:border-none overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-[#3e4856] flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Your Holdings
        </h3>
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            className="w-full bg-[#f6f7f8] dark:bg-[#111418] border-none rounded-lg py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50"
            placeholder="Search funds..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1f262e] border-b border-gray-100 dark:border-[#3e4856]">
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider">
                Fund Name
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider text-right">
                Invested
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider text-right">
                Current Value
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider text-right">
                Returns
              </th>
              <th className="p-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#3e4856]">
            {filteredHoldings.map((holding) => (
              <tr
                key={holding.id}
                className="hover:bg-gray-50 dark:hover:bg-[#323b46] transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${holding.avatarBg} flex items-center justify-center ${holding.avatarColor} text-xs font-bold`}
                    >
                      {holding.shortName}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {holding.fundName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-[#9dabb9] sm:hidden">
                        {holding.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getCategoryBadgeClass(
                      holding.categoryColor,
                    )}`}
                  >
                    {holding.category}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(holding.invested)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(holding.currentValue)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-bold ${
                        holding.isPositive ? "text-[#0bda5b]" : "text-red-500"
                      }`}
                    >
                      {holding.isPositive ? "+" : ""}
                      {formatCurrency(holding.returns)}
                    </span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        holding.isPositive
                          ? "text-[#0bda5b] bg-[#0bda5b]/10"
                          : "text-red-500 bg-red-500/10"
                      }`}
                    >
                      {holding.isPositive ? "+" : ""}
                      {holding.returnsPercentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button className="text-gray-400 hover:text-primary transition-colors">
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
      <div className="p-4 border-t border-gray-100 dark:border-[#3e4856] flex justify-center">
        <button className="text-sm font-medium text-primary hover:text-blue-400 transition-colors">
          View All Holdings
        </button>
      </div>
    </div>
  );
};

export default HoldingsTable;
