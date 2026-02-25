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
    <div className="max-w-[1200px] w-full mx-auto px-4 py-6 pb-20">
      {/* Page Heading & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            My Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track your mutual fund performance and holdings
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-300 dark:border-[#3e4856] text-gray-700 dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#3e4856] transition-colors">
            <span className="material-symbols-outlined mr-2 text-[20px]">
              download
            </span>
            <span>Report</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined mr-2 text-[20px]">
              add
            </span>
            <span>Invest More</span>
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
