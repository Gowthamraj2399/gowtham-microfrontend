import React, { useState } from "react";

const HoldingsTable = ({ holdings }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHoldings = holdings.filter((holding) =>
    holding.fundName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const getCategoryBadgeStyle = (color) => {
    const styleMap = {
      blue: { background: "rgba(139,92,246,0.12)", color: "#A78BFA" },
      green: { background: "rgba(11,218,91,0.12)", color: "#0bda5b" },
      amber: { background: "rgba(251,191,36,0.12)", color: "#fbbf24" },
    };
    return styleMap[color] || styleMap.blue;
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden" style={cardStyle}>
      <div
        className="p-6 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-white font-bold text-lg">Your Holdings</h3>
        <div className="relative w-full md:w-64">
          <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: "#7B8FA8" }}>
            search
          </span>
          <input
            className="w-full py-2 pl-10 pr-4 rounded-lg text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
              outline: "none",
            }}
            placeholder="Search funds..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th className="p-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#A78BFA" }}>Fund Name</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-widest hidden sm:table-cell" style={{ color: "#A78BFA" }}>Category</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-widest text-right" style={{ color: "#A78BFA" }}>Invested</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-widest text-right" style={{ color: "#A78BFA" }}>Current Value</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-widest text-right" style={{ color: "#A78BFA" }}>Returns</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-widest text-center" style={{ color: "#A78BFA" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.map((holding) => (
              <tr
                key={holding.id}
                className="transition-colors group"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full ${holding.avatarBg} flex items-center justify-center ${holding.avatarColor} text-xs font-bold`}
                    >
                      {holding.shortName}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{holding.fundName}</span>
                      <span className="text-xs sm:hidden" style={{ color: "#7B8FA8" }}>{holding.category}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={getCategoryBadgeStyle(holding.categoryColor)}
                  >
                    {holding.category}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-medium text-white">{formatCurrency(holding.invested)}</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-bold text-white">{formatCurrency(holding.currentValue)}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end">
                    <span
                      className="text-sm font-bold"
                      style={{ color: holding.isPositive ? "#0bda5b" : "#EF4444" }}
                    >
                      {holding.isPositive ? "+" : ""}{formatCurrency(holding.returns)}
                    </span>
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded"
                      style={{
                        color: holding.isPositive ? "#0bda5b" : "#EF4444",
                        background: holding.isPositive
                          ? "rgba(11,218,91,0.1)"
                          : "rgba(239,68,68,0.1)",
                      }}
                    >
                      {holding.isPositive ? "+" : ""}{holding.returnsPercentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button
                    className="transition-colors"
                    style={{ color: "#7B8FA8" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#A78BFA")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7B8FA8")}
                  >
                    <span className="material-symbols-rounded text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="p-4 flex justify-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          className="text-sm font-medium transition-colors"
          style={{ color: "#A78BFA" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#8B5CF6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#A78BFA")}
        >
          View All Holdings
        </button>
      </div>
    </div>
  );
};

export default HoldingsTable;
