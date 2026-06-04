import { useMemo } from "react";
import { useTransactions } from "./transactions-query";
import { useEmis } from "./emi-query";
import { useRecurringPayments } from "./recurring-query";

function toLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthBoundsStr(year, month) {
  const pad = (n) => String(n).padStart(2, "0");
  const last = new Date(year, month, 0).getDate();
  return {
    start: `${year}-${pad(month)}-01`,
    end: `${year}-${pad(month)}-${pad(last)}`,
  };
}

/**
 * Returns all derived dashboard data from live Supabase queries.
 * All amounts in ₹ (INR).
 */
export function useDashboard() {
  const now = new Date();
  const thisYear  = now.getFullYear();
  const thisMonth = now.getMonth() + 1; // 1-based
  const lastMonth = thisMonth === 1 ? 12 : thisMonth - 1;
  const lastMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

  const todayStr = toLocalDateStr(now);
  const { start: thisStart, end: thisEnd } = monthBoundsStr(thisYear, thisMonth);
  const { start: lastStart, end: lastEnd } = monthBoundsStr(lastMonthYear, lastMonth);

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: thisTxns   = [], isLoading: loadingThis } = useTransactions({ year: thisYear,      month: thisMonth });
  const { data: lastTxns   = [], isLoading: loadingLast } = useTransactions({ year: lastMonthYear, month: lastMonth });
  const { data: emis       = [], isLoading: loadingEmis } = useEmis();
  const { data: recurring  = [], isLoading: loadingRec  } = useRecurringPayments();

  const isLoading = loadingThis || loadingLast || loadingEmis || loadingRec;

  const derived = useMemo(() => {
    // ── This month / last month totals ───────────────────────────────────
    const thisTotal = thisTxns.reduce((s, t) => s + Number(t.amount), 0);
    const lastTotal = lastTxns.reduce((s, t) => s + Number(t.amount), 0);
    const diffAmt   = thisTotal - lastTotal;
    const diffPct   = lastTotal > 0 ? ((diffAmt / lastTotal) * 100).toFixed(1) : null;

    // ── EMI stats ────────────────────────────────────────────────────────
    const activeEmis = emis.filter((e) => e.is_active);
    const emisThisMonth = activeEmis.filter((e) => e.next_due_date >= thisStart && e.next_due_date <= thisEnd);
    const emiMonthlyTotal = activeEmis.reduce((s, e) => s + Number(e.emi_amount), 0);
    const overdueEmis = activeEmis.filter((e) => e.next_due_date <= todayStr);

    // ── Recurring stats ──────────────────────────────────────────────────
    const activeRecurring = recurring.filter((r) => r.is_active && r.frequency === "monthly");
    const recurringMonthlyTotal = activeRecurring.reduce((s, r) => s + Number(r.amount), 0);
    const overdueRecurring = recurring.filter((r) => r.is_active && r.next_due_date <= todayStr);

    // ── Stats cards ──────────────────────────────────────────────────────
    const stats = [
      {
        id: "this-month",
        title: "This Month",
        value: fmtINR(thisTotal),
        change: diffPct != null
          ? `${diffAmt >= 0 ? "+" : ""}${diffPct}% vs last mo`
          : null,
        changeType: diffAmt > 0 ? "negative" : diffAmt < 0 ? "positive" : "neutral",
        icon: "calendar_month",
        color: "orange",
      },
      {
        id: "last-month",
        title: "Last Month",
        value: fmtINR(lastTotal),
        change: lastTotal > 0
          ? new Date(lastMonthYear, lastMonth - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
          : "No data",
        changeType: "neutral",
        icon: "history",
        color: "blue",
      },
      {
        id: "emis-due",
        title: "EMI / Month",
        value: fmtINR(emiMonthlyTotal),
        change: overdueEmis.length > 0
          ? `${overdueEmis.length} overdue`
          : `${activeEmis.length} loan${activeEmis.length !== 1 ? "s" : ""}`,
        changeType: overdueEmis.length > 0 ? "negative" : "neutral",
        icon: "credit_card",
        color: "purple",
      },
      {
        id: "recurring-total",
        title: "Recurring",
        value: fmtINR(recurringMonthlyTotal),
        change: overdueRecurring.length > 0
          ? `${overdueRecurring.length} overdue`
          : `${activeRecurring.length} active`,
        changeType: overdueRecurring.length > 0 ? "negative" : "neutral",
        icon: "replay",
        color: "emerald",
      },
    ];

    // ── Daily spending trend (this month vs last month) ──────────────────
    const todayDay = now.getDate(); // current day of month (e.g. 4)
    const daysInLastMonth = new Date(lastMonthYear, lastMonth, 0).getDate();
    const maxDays = Math.max(todayDay, daysInLastMonth);

    const thisByDay = buildDayMap(thisTxns);
    const lastByDay = buildDayMap(lastTxns);

    const spendingTrend = Array.from({ length: maxDays }, (_, i) => {
      const day = i + 1;
      return {
        day: String(day),
        thisMonth: day <= todayDay ? (thisByDay[day] || 0) : null,
        lastMonth: day <= daysInLastMonth ? (lastByDay[day] || 0) : null,
      };
    }).filter((d) => d.thisMonth !== null || d.lastMonth !== null);

    // ── Category breakdown ───────────────────────────────────────────────
    const catMap = {};
    for (const tx of thisTxns) {
      const cat = tx.category;
      if (!cat) continue;
      if (!catMap[cat.id]) {
        catMap[cat.id] = { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon, amount: 0 };
      }
      catMap[cat.id].amount += Number(tx.amount);
    }
    const categoryBreakdown = Object.values(catMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);

    // ── Monthly comparison (last 6 months bar chart) ─────────────────────
    const monthlyComparison = buildMonthlyComparison(thisTxns, lastTxns, thisYear, thisMonth);

    // ── Recent transactions (last 5) ─────────────────────────────────────
    const recentTransactions = thisTxns.slice(0, 5);

    // ── Upcoming EMIs (next 3) ───────────────────────────────────────────
    const upcomingEmis = activeEmis
      .sort((a, b) => a.next_due_date.localeCompare(b.next_due_date))
      .slice(0, 3);

    // ── Upcoming recurring (active, sorted by due) ───────────────────────
    const upcomingRecurring = recurring
      .filter((r) => r.is_active)
      .sort((a, b) => a.next_due_date.localeCompare(b.next_due_date))
      .slice(0, 5);

    return {
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
      overdueEmis,
      overdueRecurring,
      emiMonthlyTotal,
      recurringMonthlyTotal,
      thisMonth,
      thisYear,
    };
  }, [thisTxns, lastTxns, emis, recurring]);

  return { ...derived, isLoading };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function getMonthName(month, year) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function buildDayMap(txns) {
  const map = {};
  for (const tx of txns) {
    const day = parseInt(tx.date.split("-")[2], 10);
    map[day] = (map[day] || 0) + Number(tx.amount);
  }
  return map;
}

function buildMonthlyComparison(thisTxns, lastTxns, year, month) {
  // Build last 6 months labels + amounts from cached data
  // We only have this + last month fully loaded; show those two accurately,
  // rest will fill in via individual queries if needed — for now show what we have.
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    months.push({
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      amount: 0,
    });
  }
  // Fill in this month and last month
  const thisLabel = new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "short" });
  const lastLabel = new Date(year, month - 2, 1).toLocaleDateString("en-IN", { month: "short" });
  const thisTotal = thisTxns.reduce((s, t) => s + Number(t.amount), 0);
  const lastTotal = lastTxns.reduce((s, t) => s + Number(t.amount), 0);
  for (const m of months) {
    if (m.month === thisLabel) m.amount = thisTotal;
    if (m.month === lastLabel) m.amount = lastTotal;
  }
  return months;
}
