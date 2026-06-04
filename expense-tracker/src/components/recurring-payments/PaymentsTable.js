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

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1rem",
  };

  const filterBtnStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters and Search Toolbar */}
      <section
        className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center p-4 rounded-2xl"
        style={cardStyle}
      >
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span
              className="material-symbols-rounded"
              style={{ color: "#7B8FA8", fontVariationSettings: "'FILL' 1" }}
            >
              search
            </span>
          </div>
          <input
            className="block w-full py-2.5 pl-10 pr-3 rounded-lg text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              outline: "none",
            }}
            placeholder="Search payments by name..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </div>
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button style={filterBtnStyle}>
            <span className="text-white text-sm font-medium">Category: {selectedCategory}</span>
            <span className="material-symbols-rounded text-sm" style={{ color: "#A78BFA" }}>expand_more</span>
          </button>
          <button style={filterBtnStyle}>
            <span className="text-white text-sm font-medium">Status: {selectedStatus}</span>
            <span className="material-symbols-rounded text-sm" style={{ color: "#A78BFA" }}>expand_more</span>
          </button>
          <button style={filterBtnStyle}>
            <span className="text-white text-sm font-medium">Sort By: {sortBy}</span>
            <span className="material-symbols-rounded text-sm" style={{ color: "#A78BFA" }}>sort</span>
          </button>
        </div>
      </section>

      {/* Main Payments Table */}
      <section className="w-full overflow-hidden rounded-2xl" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#A78BFA" }}>Service Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#A78BFA" }}>Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#A78BFA" }}>Frequency</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-right" style={{ color: "#A78BFA" }}>Amount</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#A78BFA" }}>Next Due</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: "#A78BFA" }}>Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: "#A78BFA" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="transition-colors group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${payment.iconBg} ${payment.iconColor}`}
                      >
                        <span className="material-symbols-rounded" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {payment.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{payment.serviceName}</p>
                        <p className="text-xs" style={{ color: "#7B8FA8" }}>{payment.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                      style={{
                        background: "rgba(139,92,246,0.12)",
                        color: "#A78BFA",
                      }}
                    >
                      {payment.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-white">{payment.frequency}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <p className="text-sm font-bold text-white font-mono">{formatCurrency(payment.amount)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-white">{payment.nextDue}</p>
                    <p
                      className={`text-xs ${payment.dueInfoColor || ""}`}
                      style={!payment.dueInfoColor ? { color: "#7B8FA8" } : undefined}
                    >
                      {payment.dueInfo}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[payment.status]}`}
                    >
                      {payment.statusText}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      className="rounded-full p-1 transition-colors"
                      style={{ color: "#7B8FA8" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#7B8FA8";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span className="material-symbols-rounded">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div
          className="flex items-center justify-between px-4 py-3 sm:px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm" style={{ color: "#7B8FA8" }}>
                Showing <span className="font-medium text-white">1</span> to{" "}
                <span className="font-medium text-white">{filteredPayments.length}</span>{" "}
                of{" "}
                <span className="font-medium text-white">{filteredPayments.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
                <button
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 transition-colors"
                  style={{
                    color: "#7B8FA8",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-rounded text-sm">chevron_left</span>
                </button>
                <button
                  aria-current="page"
                  className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                    border: "1px solid rgba(139,92,246,0.5)",
                  }}
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 transition-colors"
                  style={{
                    color: "#7B8FA8",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-rounded text-sm">chevron_right</span>
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
