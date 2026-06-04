import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import { SpendingTrendChart, MonthlyComparisonChart } from "../../components/dashboard/SpendingCharts";
import SpendingByCategory from "../../components/dashboard/SpendingByCategory";
import EMIList from "../../components/dashboard/EMIList";
import RecurringList from "../../components/dashboard/RecurringList";
import { useDashboard } from "../../lib/dashboard-query";

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

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

// ── Skeleton block ────────────────────────────────────────────────────────
const Skel = ({ h = "h-5", w = "w-full", className = "" }) => (
  <div className={`animate-pulse rounded-lg ${h} ${w} ${className}`} style={{ background: "rgba(255,255,255,0.06)" }} />
);

// ── Recent transaction row ────────────────────────────────────────────────
const RecentTxRow = ({ tx }) => {
  const cat   = tx.category;
  const color = cat?.color || "#8B5CF6";
  const icon  = cat?.icon  || "receipt_long";
  const dateLabel = new Date(tx.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <div className="flex items-center justify-between py-2.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
          <span className="material-symbols-rounded" style={{ fontSize: "16px", color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-tight">{tx.title}</p>
          <p className="text-[11px] text-text-secondary">{cat?.name || "Uncategorised"}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold" style={{ color: "#F87171" }}>-{fmtINR(tx.amount)}</p>
        <p className="text-[11px] text-text-secondary">{dateLabel}</p>
      </div>
    </div>
  );
};

// ── Dashboard page ────────────────────────────────────────────────────────
const DashboardPage = () => {
  const {
    isLoading,
    stats,
    thisTotal,
    lastTotal,
    diffAmt,
    diffPct,
    spendingTrend,
    categoryBreakdown,
    monthlyComparison,
    recentTransactions,
    upcomingEmis,
    upcomingRecurring,
    thisMonth,
    thisYear,
  } = useDashboard();

  const monthLabel = new Date(thisYear, thisMonth - 1, 1)
    .toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const avg6m = monthlyComparison.filter((m) => m.amount > 0).length > 0
    ? Math.round(monthlyComparison.reduce((s, m) => s + m.amount, 0) / monthlyComparison.filter((m) => m.amount > 0).length)
    : 0;

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">

      {/* ── Header ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <motion.div variants={itemVariants}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Overview</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">{monthLabel}</h1>
          {isLoading ? (
            <Skel h="h-4" w="w-56" className="mt-2" />
          ) : (
            <p className="text-text-secondary text-sm mt-1">
              Spent <span className="text-white font-semibold">{fmtINR(thisTotal)}</span> so far
              {diffPct != null && (
                <>&nbsp;·&nbsp;
                  <span style={{ color: diffAmt > 0 ? "#F87171" : "#34D399" }}>
                    {diffAmt >= 0 ? "+" : ""}{fmtINR(Math.abs(diffAmt))} vs last month
                  </span>
                </>
              )}
            </p>
          )}
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/transactions"
            className="flex items-center justify-center gap-1.5 rounded-xl h-9 px-4 text-xs font-bold text-white transition-all active:scale-95 no-underline"
            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "15px" }}>add</span>
            Add Expense
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="rounded-2xl p-5 h-28 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
              </motion.div>
            ))
          : stats.map((stat) => (
              <motion.div key={stat.id} variants={itemVariants}>
                <StatsCard {...stat} />
              </motion.div>
            ))
        }
      </motion.div>

      {/* ── Charts ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {isLoading
            ? <div className="rounded-2xl p-5 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <SpendingTrendChart title="Daily Spending" subtitle={`${monthLabel} vs previous month`} data={spendingTrend} />
          }
        </motion.div>
        <motion.div variants={itemVariants}>
          {isLoading
            ? <div className="rounded-2xl p-5 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <MonthlyComparisonChart title="Monthly Comparison" subtitle="Last 6 months" data={monthlyComparison} previousAvg={avg6m} />
          }
        </motion.div>
      </motion.div>

      {/* ── Category + Recent ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {isLoading
            ? <div className="rounded-2xl p-5 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <SpendingByCategory categories={categoryBreakdown} />
          }
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl p-5 flex flex-col gap-3 h-full" style={glassStyle}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Spending</h3>
              <Link to="/transactions" className="text-xs font-semibold no-underline" style={{ color: "#A78BFA" }}>View all</Link>
            </div>
            {isLoading ? (
              <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <Skel key={i} h="h-10" />)}</div>
            ) : recentTransactions.length === 0 ? (
              <p className="text-xs text-text-secondary py-6 text-center">No transactions yet this month</p>
            ) : (
              <>
                <div className="flex flex-col">
                  {recentTransactions.map((tx) => <RecentTxRow key={tx.id} tx={tx} />)}
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{recentTransactions.length} recent</span>
                  <span className="font-bold" style={{ color: "#F87171" }}>
                    -{fmtINR(recentTransactions.reduce((s, t) => s + Number(t.amount), 0))}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ── EMIs + Recurring ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          {isLoading
            ? <div className="rounded-2xl p-5 h-48 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <EMIList emis={upcomingEmis} />
          }
        </motion.div>
        <motion.div variants={itemVariants}>
          {isLoading
            ? <div className="rounded-2xl p-5 h-48 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <RecurringList
                title="Recurring Payments"
                total={fmtINR(upcomingRecurring.reduce((s, r) => s + Number(r.amount), 0))}
                items={upcomingRecurring}
              />
          }
        </motion.div>
      </motion.div>

    </div>
  );
};

export default DashboardPage;

