import React from "react";
import PortfolioStatsCard from "../../components/mutual-funds/PortfolioStatsCard";
import PortfolioChart from "../../components/mutual-funds/PortfolioChart";
import AssetAllocation from "../../components/mutual-funds/AssetAllocation";
import HoldingsTable from "../../components/mutual-funds/HoldingsTable";
import {
  portfolioStats,
  assetAllocation,
  holdings,
  chartTimeframes,
} from "../../config/mutualFundsConfig";

const MutualFundsPage = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      {/* Page Heading & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Investments</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
            My Portfolio
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track your mutual fund performance and holdings
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 text-sm font-semibold text-text-secondary transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>download</span>
            <span>Report</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-xl h-10 px-5 text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>add</span>
            Invest More
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {portfolioStats.map((stat) => (
          <PortfolioStatsCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <PortfolioChart timeframes={chartTimeframes} />
        <AssetAllocation allocations={assetAllocation} totalFunds={12} />
      </div>

      {/* Holdings Table */}
      <HoldingsTable holdings={holdings} />
    </div>
  );
};

export default MutualFundsPage;
