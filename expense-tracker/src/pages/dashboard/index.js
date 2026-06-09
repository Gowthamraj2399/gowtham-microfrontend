import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import { SpendingTrendChart, MonthlyComparisonChart } from "../../components/dashboard/SpendingCharts";
import SpendingByCategory from "../../components/dashboard/SpendingByCategory";
import EMIList from "../../components/dashboard/EMIList";
import RecurringList from "../../components/dashboard/RecurringList";
import { useDashboard } from "../../lib/dashboard-query";
import { useBudgetsWithSpending } from "../../lib/budget-query";
import { usePartner } from "../../lib/PartnerContext";
import { usePartnerTransactions, usePartnerEmis, usePartnerRecurring } from "../../lib/partner-query";

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

function getFillColor(pct, over) {
  if (over) return "#EF4444";
  const rem = 100 - pct;
  if (rem <= 15) return "#EF4444";
  if (rem <= 30) return "#F97316";
  if (rem <= 50) return "#EAB308";
  return "#22C55E";
}

// ── Skeleton block ────────────────────────────────────────────────────────
const Skel = ({ h = "h-5", w = "w-full", className = "" }) => (
  <div className={`animate-pulse rounded-lg ${h} ${w} ${className}`} style={{ background: "rgba(255,255,255,0.06)" }} />
);

// ── Recent transaction row ────────────────────────────────────────────────
const RecentTxRow = ({ tx, isPartner }) => {
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
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-white leading-tight">{tx.title}</p>
            {isPartner && <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: "rgba(244,114,182,0.15)", color: "#F472B6" }}>Partner</span>}
          </div>
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
  const { showPartner, partnerId, partnerName } = usePartner();
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
    emiMonthlyTotal,
    recurringMonthlyTotal,
    thisMonth,
    thisYear,
  } = useDashboard();

  const { data: budgets = [] } = useBudgetsWithSpending(thisYear, thisMonth);

  // Partner data (only fetched when connected + toggle on)
  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
  const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

  const { data: partnerTxsThis = [] } = usePartnerTransactions(
    showPartner ? partnerId : null,
    { year: thisYear, month: thisMonth }
  );
  const { data: partnerTxsLast = [] } = usePartnerTransactions(
    showPartner ? partnerId : null,
    { year: lastMonthYear, month: lastMonth }
  );
  const { data: partnerEmis = [] }      = usePartnerEmis(showPartner ? partnerId : null);
  const { data: partnerRecurring = [] } = usePartnerRecurring(showPartner ? partnerId : null);

  const partnerThisTotal        = partnerTxsThis.reduce((s, t) => s + Number(t.amount), 0);
  const combinedTotal           = showPartner ? thisTotal + partnerThisTotal : thisTotal;
  const partnerEmiMonthly       = partnerEmis.filter((e) => e.is_active).reduce((s, e) => s + Number(e.emi_amount), 0);
  const partnerRecurringMonthly = partnerRecurring.filter((r) => r.is_active && r.frequency === "monthly").reduce((s, r) => s + Number(r.amount), 0);

  // Merged daily spending trend
  const mergedSpendingTrend = useMemo(() => {
    if (!showPartner) return spendingTrend;
    const buildMap = (txns) => {
      const m = {};
      for (const tx of txns) { const d = parseInt(tx.date.split("-")[2], 10); m[d] = (m[d] || 0) + Number(tx.amount); }
      return m;
    };
    const pThis = buildMap(partnerTxsThis);
    const pLast = buildMap(partnerTxsLast);
    return spendingTrend.map((item) => ({
      ...item,
      thisMonth: item.thisMonth != null ? item.thisMonth + (pThis[parseInt(item.day, 10)] || 0) : item.thisMonth,
      lastMonth: item.lastMonth != null ? item.lastMonth + (pLast[parseInt(item.day, 10)] || 0) : item.lastMonth,
    }));
  }, [showPartner, spendingTrend, partnerTxsThis, partnerTxsLast]);

  // Merged category breakdown
  const mergedCategoryBreakdown = useMemo(() => {
    if (!showPartner || partnerTxsThis.length === 0) return categoryBreakdown;
    const catMap = {};
    for (const cat of categoryBreakdown) catMap[cat.id] = { ...cat };
    for (const tx of partnerTxsThis) {
      const cat = tx.category;
      if (!cat) continue;
      if (catMap[cat.id]) catMap[cat.id].amount += Number(tx.amount);
      else catMap[cat.id] = { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon, amount: Number(tx.amount) };
    }
    return Object.values(catMap).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [showPartner, categoryBreakdown, partnerTxsThis]);

  // Merged monthly comparison (only this + last month data available)
  const mergedMonthlyComparison = useMemo(() => {
    if (!showPartner) return monthlyComparison;
    const thisLabel = new Date(thisYear, thisMonth - 1, 1).toLocaleDateString("en-IN", { month: "short" });
    const lastLabel = new Date(lastMonthYear, lastMonth - 1, 1).toLocaleDateString("en-IN", { month: "short" });
    const pThisAmt = partnerTxsThis.reduce((s, t) => s + Number(t.amount), 0);
    const pLastAmt = partnerTxsLast.reduce((s, t) => s + Number(t.amount), 0);
    return monthlyComparison.map((m) => {
      if (m.month === thisLabel) return { ...m, amount: m.amount + pThisAmt };
      if (m.month === lastLabel) return { ...m, amount: m.amount + pLastAmt };
      return m;
    });
  }, [showPartner, monthlyComparison, partnerTxsThis, partnerTxsLast, thisMonth, thisYear, lastMonth, lastMonthYear]);

  const avg6m = mergedMonthlyComparison.filter((m) => m.amount > 0).length > 0
    ? Math.round(mergedMonthlyComparison.reduce((s, m) => s + m.amount, 0) / mergedMonthlyComparison.filter((m) => m.amount > 0).length)
    : 0;

  const displayEmiTotal       = showPartner ? emiMonthlyTotal + partnerEmiMonthly : emiMonthlyTotal;
  const displayRecurringTotal  = showPartner ? recurringMonthlyTotal + partnerRecurringMonthly : recurringMonthlyTotal;
  const fixedMonthlyTotal      = displayEmiTotal + displayRecurringTotal;
  const fixedPct               = combinedTotal > 0 ? Math.min(100, Math.round((fixedMonthlyTotal / combinedTotal) * 100)) : 0;

  // Override stats cards when showing combined
  const displayStats = showPartner
    ? stats.map((s) => {
        if (s.id === "this-month")      return { ...s, value: fmtINR(combinedTotal) };
        if (s.id === "emis-due")        return { ...s, value: fmtINR(emiMonthlyTotal + partnerEmiMonthly) };
        if (s.id === "recurring-total") return { ...s, value: fmtINR(recurringMonthlyTotal + partnerRecurringMonthly) };
        return s;
      })
    : stats;

  // Merged recent transactions (sorted by date desc, top 5)
  const mergedRecent = showPartner
    ? [...recentTransactions, ...partnerTxsThis]
        .sort((a, b) => b.date.localeCompare(a.date) || new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
    : recentTransactions;

  // Merged upcoming EMIs / recurring (partner active items merged, sorted by due date)
  const mergedEmis = showPartner
    ? [...upcomingEmis, ...partnerEmis.filter((e) => e.is_active)]
        .sort((a, b) => (a.next_due_date || "9999").localeCompare(b.next_due_date || "9999"))
        .slice(0, 5)
    : upcomingEmis;
  const mergedRecurring = showPartner
    ? [...upcomingRecurring, ...partnerRecurring.filter((r) => r.is_active)]
        .sort((a, b) => (a.next_due_date || "9999").localeCompare(b.next_due_date || "9999"))
        .slice(0, 6)
    : upcomingRecurring;

  const monthLabel = new Date(thisYear, thisMonth - 1, 1)
    .toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const statRoutes = {
    "this-month": "/transactions",
    "last-month": "/transactions",
    "emis-due": "/emi",
    "recurring-total": "/recurring-payments",
  };

  // avg6m computed from mergedMonthlyComparison above

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
              {showPartner && (
                <span className="mr-1 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(244,114,182,0.15)", color: "#F472B6" }}>Combined</span>
              )}
              Spent <span className="text-white font-semibold">{fmtINR(combinedTotal)}</span> so far
              {diffPct != null && !showPartner && (
                <>&nbsp;·&nbsp;
                  <span style={{ color: diffAmt > 0 ? "#F87171" : "#34D399" }}>
                    {diffAmt >= 0 ? "+" : ""}{fmtINR(Math.abs(diffAmt))} vs last month
                  </span>
                </>
              )}
              {showPartner && partnerThisTotal > 0 && (
                <>&nbsp;·&nbsp;<span style={{ color: "#F472B6" }}>{partnerName || "Partner"}: {fmtINR(partnerThisTotal)}</span></>
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
          : displayStats.map((stat) => (
              <motion.div key={stat.id} variants={itemVariants}>
                <StatsCard {...stat} to={statRoutes[stat.id]} />
              </motion.div>
            ))
        }
      </motion.div>

      {/* ── Monthly Commitments ── */}
      {!isLoading && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mb-4">
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4 sm:gap-6" style={glassStyle}>
              {/* Total */}
              <div className="flex items-center gap-3 min-w-[140px]">
                <div className="p-2.5 rounded-xl shrink-0" style={{ background: "rgba(139,92,246,0.15)" }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>lock_clock</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Fixed Monthly</p>
                  <p className="text-xl font-black text-white leading-tight">{fmtINR(fixedMonthlyTotal)}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 self-center" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* EMI */}
              <Link to="/emi" className="no-underline flex items-center gap-2.5 rounded-xl px-2 py-1 -mx-2 -my-1 transition-all hover:bg-white/5">
                <div className="p-2 rounded-xl shrink-0" style={{ background: "rgba(168,85,247,0.12)" }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#C084FC", fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary font-medium">EMIs</p>
                  <p className="text-sm font-bold text-white">{fmtINR(displayEmiTotal)}</p>
                </div>
                <span className="material-symbols-rounded" style={{ fontSize: "14px", color: "rgba(255,255,255,0.25)" }}>chevron_right</span>
              </Link>

              <span className="text-text-secondary font-bold text-xs">+</span>

              {/* Recurring */}
              <Link to="/recurring-payments" className="no-underline flex items-center gap-2.5 rounded-xl px-2 py-1 -mx-2 -my-1 transition-all hover:bg-white/5">
                <div className="p-2 rounded-xl shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#34D399", fontVariationSettings: "'FILL' 1" }}>replay</span>
                </div>
                <div>
                  <p className="text-[11px] text-text-secondary font-medium">Recurring</p>
                  <p className="text-sm font-bold text-white">{fmtINR(displayRecurringTotal)}</p>
                </div>
                <span className="material-symbols-rounded" style={{ fontSize: "14px", color: "rgba(255,255,255,0.25)" }}>chevron_right</span>
              </Link>

              {/* Progress */}
              {combinedTotal > 0 && (
                <>
                  <div className="hidden sm:block w-px h-10 self-center" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="flex-1 min-w-[160px]">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-[11px] text-text-secondary">of this month's spend</p>
                      <p className="text-[11px] font-bold" style={{ color: fixedPct >= 80 ? "#F87171" : fixedPct >= 50 ? "#FBBF24" : "#A78BFA" }}>{fixedPct}%</p>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${fixedPct}%`, background: fixedPct >= 80 ? "linear-gradient(90deg,#F87171,#EF4444)" : "linear-gradient(90deg,#8B5CF6,#34D399)" }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* ── Budget Health ── */}
      {!isLoading && budgets.length > 0 && (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mt-4">
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-4" style={glassStyle}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Budget Health</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{budgets.length} budget{budgets.length !== 1 ? "s" : ""} · {monthLabel}</p>
                </div>
                <Link to="/budgets" className="text-xs font-semibold no-underline flex items-center gap-0.5" style={{ color: "#22C55E" }}>
                  View all
                  <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>chevron_right</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {budgets.slice(0, 10).map((b, i) => {
                  const cat = b.category;
                  const fillColor = getFillColor(b.pct, b.over);
                  const fillPct = b.over ? 100 : Math.max(0, 100 - b.pct);
                  return (
                    <Link
                      key={b.id}
                      to="/budgets"
                      className="relative rounded-xl p-3 overflow-hidden no-underline flex flex-col gap-1.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${fillColor}25` }}
                    >
                      <motion.div
                        className="absolute inset-y-0 left-0 pointer-events-none"
                        style={{ background: fillColor, opacity: b.over ? 0.15 : 0.09 }}
                        initial={{ width: "100%" }}
                        animate={{ width: `${fillPct}%` }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.05 }}
                      />
                      <div className="relative flex items-center gap-1.5">
                        {cat && (
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cat.color}20` }}>
                            <span className="material-symbols-rounded" style={{ fontSize: "13px", color: cat.color, fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                          </div>
                        )}
                        <p className="text-xs font-bold text-white truncate">{cat?.name ?? "—"}</p>
                      </div>
                      <p className="relative text-[11px]" style={{ color: "#94A3B8" }}>
                        {fmtINR(b.spent)} <span style={{ color: "#475569" }}>/ {fmtINR(b.monthly_amount)}</span>
                      </p>
                      <p className="relative text-[10px] font-semibold" style={{ color: b.over ? "#F87171" : fillColor }}>
                        {b.over ? `${fmtINR(Math.abs(b.remaining))} over` : `${fmtINR(b.remaining)} left`}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Charts ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {isLoading
            ? <div className="rounded-2xl p-5 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <SpendingTrendChart title="Daily Spending" subtitle={`${monthLabel} vs previous month`} data={mergedSpendingTrend} to="/transactions" />
          }
        </motion.div>
        <motion.div variants={itemVariants}>
          {isLoading
            ? <div className="rounded-2xl p-5 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <MonthlyComparisonChart title="Monthly Comparison" subtitle="Last 6 months" data={mergedMonthlyComparison} previousAvg={avg6m} to="/transactions" />
          }
        </motion.div>
      </motion.div>

      {/* ── Category + Recent ── */}
      <motion.div variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {isLoading
            ? <div className="rounded-2xl p-5 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <SpendingByCategory categories={mergedCategoryBreakdown} to="/categories" />
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
            ) : recentTransactions.length === 0 && partnerTxsThis.length === 0 ? (
              <p className="text-xs text-text-secondary py-6 text-center">No transactions yet this month</p>
            ) : (
              <>
                <div className="flex flex-col">
                  {mergedRecent.map((tx) => <RecentTxRow key={tx.id} tx={tx} isPartner={!!tx._isPartner} />)}
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{mergedRecent.length} recent</span>
                  <span className="font-bold" style={{ color: "#F87171" }}>
                    -{fmtINR(mergedRecent.reduce((s, t) => s + Number(t.amount), 0))}
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
            : <EMIList emis={mergedEmis} total={fmtINR(displayEmiTotal)} />
          }
        </motion.div>
        <motion.div variants={itemVariants}>
          {isLoading
            ? <div className="rounded-2xl p-5 h-48 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            : <RecurringList
                title="Recurring Payments"
                total={fmtINR(mergedRecurring.reduce((s, r) => s + Number(r.amount), 0))}
                items={mergedRecurring}
              />
          }
        </motion.div>
      </motion.div>

    </div>
  );
};

export default DashboardPage;

