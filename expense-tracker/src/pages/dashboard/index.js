import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import { SpendingTrendChart, MonthlyComparisonChart } from "../../components/dashboard/SpendingCharts";
import SpendingByCategory from "../../components/dashboard/SpendingByCategory";
import EMIList from "../../components/dashboard/EMIList";
import RecurringList from "../../components/dashboard/RecurringList";
import { dashboardConfig } from "../../config/dashboardConfig";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
};

// ── Small recent-transaction row ───────────────────────────────────────────
const RecentTxRow = ({ tx }) => (
  <div
    className="flex items-center justify-between py-2.5"
    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(139,92,246,0.12)" }}
      >
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "16px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
        >
          {tx.icon}
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold text-white leading-tight">{tx.title}</p>
        <p className="text-[11px] text-text-secondary">{tx.category}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-bold" style={{ color: "#F87171" }}>
        -${Math.abs(tx.amount).toFixed(2)}
      </p>
      <p className="text-[11px] text-text-secondary">{tx.date}</p>
    </div>
  </div>
);

// ── Dashboard page ─────────────────────────────────────────────────────────
const DashboardPage = () => {
  const {
    stats,
    spendingTrend,
    categoryBreakdown,
    monthlyComparison,
    upcomingEmis,
    recurringPayments,
    recentTransactions,
  } = dashboardConfig;

  const thisMonth = stats.find((s) => s.id === "this-month");
  const lastMonth = stats.find((s) => s.id === "last-month");
  const diff = 3248 - 2997;
  const diffPct = ((diff / 2997) * 100).toFixed(1);

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">

      {/* ── Page header ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-between items-end gap-4 mb-6"
      >
        <motion.div variants={itemVariants}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>
            Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
            June 2026
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            You've spent <span className="text-white font-semibold">$3,248</span> so far this month
            &nbsp;·&nbsp;
            <span style={{ color: diff > 0 ? "#F87171" : "#34D399" }}>
              {diff > 0 ? "+" : "-"}${Math.abs(diff)} vs May
            </span>
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-2">
          <button
            className="flex items-center justify-center gap-1.5 rounded-xl h-9 px-4 text-xs font-semibold text-text-secondary transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>calendar_today</span>
            June 2026
          </button>
          <Link
            to="/transactions"
            className="flex items-center justify-center gap-1.5 rounded-xl h-9 px-4 text-xs font-bold text-white transition-all active:scale-95 no-underline"
            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>add</span>
            Add Expense
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5"
      >
        {stats.map((stat) => (
          <motion.div key={stat.id} variants={itemVariants}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts row ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <SpendingTrendChart {...spendingTrend} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MonthlyComparisonChart {...monthlyComparison} />
        </motion.div>
      </motion.div>

      {/* ── Category + Recent Transactions ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
      >
        {/* Category breakdown — 2 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <SpendingByCategory categories={categoryBreakdown} />
        </motion.div>

        {/* Recent transactions — 1 col */}
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl p-5 flex flex-col gap-3 h-full" style={glassStyle}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Spending</h3>
              <Link
                to="/transactions"
                className="text-xs font-semibold no-underline transition-colors"
                style={{ color: "#A78BFA" }}
              >
                View all
              </Link>
            </div>
            <div className="flex flex-col">
              {recentTransactions.map((tx) => (
                <RecentTxRow key={tx.id} tx={tx} />
              ))}
            </div>
            <div className="mt-auto pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">5 transactions today</span>
                <span className="font-bold" style={{ color: "#F87171" }}>-$212.19</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── EMIs + Recurring ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div variants={itemVariants}>
          <EMIList emis={upcomingEmis} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <RecurringList {...recurringPayments} />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default DashboardPage;

