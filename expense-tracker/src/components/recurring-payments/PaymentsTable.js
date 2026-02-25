import React, { useState } from "react";
import { statusColors } from "../../config/recurringPaymentsConfig";

const PaymentsTable = ({ payments, filterOptions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Date");

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || payment.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" ||
      payment.statusText.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters and Search Toolbar */}
      <section className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[#1c252e] p-4 rounded-xl border border-[#283039]">
        {/* Search */}
        <div className="relative w-full lg:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#9dabb9] group-focus-within:text-white transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full rounded-lg border-none bg-[#283039] py-2.5 pl-10 pr-3 text-white placeholder-[#9dabb9] focus:ring-2 focus:ring-primary focus:bg-[#323b46] transition-all sm:text-sm"
            placeholder="Search payments by name..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button className="flex items-center gap-2 rounded-lg bg-[#283039] px-3 py-2 hover:bg-[#323b46] transition-colors border border-transparent hover:border-[#4b5563]">
            <span className="text-white text-sm font-medium">
              Category: {selectedCategory}
            </span>
            <span className="material-symbols-outlined text-white text-sm">
              expand_more
            </span>
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#283039] px-3 py-2 hover:bg-[#323b46] transition-colors border border-transparent hover:border-[#4b5563]">
            <span className="text-white text-sm font-medium">
              Status: {selectedStatus}
            </span>
            <span className="material-symbols-outlined text-white text-sm">
              expand_more
            </span>
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#283039] px-3 py-2 hover:bg-[#323b46] transition-colors border border-transparent hover:border-[#4b5563]">
            <span className="text-white text-sm font-medium">
              Sort By: {sortBy}
            </span>
            <span className="material-symbols-outlined text-white text-sm">
              sort
            </span>
          </button>
        </div>
      </section>

      {/* Main Payments Table */}
      <section className="w-full overflow-hidden rounded-xl border border-[#283039] bg-[#1c252e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#283039] bg-[#232d36]">
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                  Next Due
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#283039]">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-[#283039]/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${payment.iconBg} ${payment.iconColor}`}
                      >
                        <span className="material-symbols-outlined">
                          {payment.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {payment.serviceName}
                        </p>
                        <p className="text-xs text-[#9dabb9]">
                          {payment.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-[#283039] px-2 py-1 text-xs font-medium text-[#9dabb9]">
                      {payment.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-white">{payment.frequency}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="text-sm font-bold text-white font-mono">
                      {formatCurrency(payment.amount)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-white">{payment.nextDue}</p>
                    <p
                      className={`text-xs ${
                        payment.dueInfoColor || "text-[#9dabb9]"
                      }`}
                    >
                      {payment.dueInfo}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        statusColors[payment.status]
                      }`}
                    >
                      {payment.statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-[#9dabb9] hover:text-white rounded-full p-1 hover:bg-[#323b46] transition-colors">
                      <span className="material-symbols-outlined">
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
        <div className="flex items-center justify-between border-t border-[#283039] bg-[#1c252e] px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#9dabb9]">
                Showing <span className="font-medium text-white">1</span> to{" "}
                <span className="font-medium text-white">
                  {filteredPayments.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
                  {filteredPayments.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              >
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-[#283039] hover:bg-[#283039] focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button
                  aria-current="page"
                  className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20"
                >
                  1
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-[#283039] hover:bg-[#283039] focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentsTable;
