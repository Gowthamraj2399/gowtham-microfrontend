import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TransactionStatsCard from "../../components/transactions/TransactionStatsCard";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import AddTransactionModal from "../../components/transactions/AddTransactionModal";
import { useTransactions, computeStats, useDeleteTransaction } from "../../lib/transactions-query";
import { useCategories } from "../../lib/categories-query";
import { filterOptions } from "../../config/transactionsConfig";
import { usePartnerTransactions } from "../../lib/partner-query";
import { usePartner } from "../../lib/PartnerContext";

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR  = now.getFullYear();

// Build last 12 months (newest first)
function buildMonthOptions() {
  const opts = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(CURRENT_YEAR, now.getMonth() - i, 1);
    opts.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      shortLabel: d.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return opts;
}
const MONTH_OPTIONS = buildMonthOptions();

const TransactionsPage = () => {
  const [modalOpen, setModalOpen]             = useState(false);
  const [editTarget, setEditTarget]           = useState(null);
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [selectedMonth, setSelectedMonth]     = useState({ month: CURRENT_MONTH, year: CURRENT_YEAR });
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { showPartner, partnerId, partnerName } = usePartner();

  const { data: transactions = [], isLoading, error } = useTransactions({ year: selectedMonth.year, month: selectedMonth.month });
  const { data: categories = [] } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  // Partner data
  const { data: partnerTxs = [] } = usePartnerTransactions(
    showPartner ? partnerId : null,
    { year: selectedMonth.year, month: selectedMonth.month }
  );

  // Merged + sorted transactions
  const allTransactions = useMemo(() => {
    if (!showPartner || !partnerId) return transactions;
    return [...transactions, ...partnerTxs].sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [transactions, partnerTxs, showPartner, partnerId]);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditTarget(tx); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete transaction failed:", err.message);
    }
  };

  // Reset category filter when month changes
  const handleMonthChange = (opt) => {
    setSelectedMonth({ month: opt.month, year: opt.year });
    setSelectedCategory("All");
  };

  // Transactions filtered by selected category (for stats)
  const filteredForStats = useMemo(() =>
    selectedCategory === "All"
      ? allTransactions
      : allTransactions.filter((tx) => {
          const catName = tx.category && typeof tx.category === "object"
            ? tx.category.name
            : typeof tx.category === "string" ? tx.category : "Uncategorised";
          return catName === selectedCategory;
        }),
    [allTransactions, selectedCategory]
  );

  // Derive stats from combined data when partner toggle is on
  const { total, avgDaily, largest } = computeStats(filteredForStats);
  const selectedLabel = MONTH_OPTIONS.find(o => o.month === selectedMonth.month && o.year === selectedMonth.year)?.label ?? "";
  const statsLabel = selectedCategory !== "All" ? selectedCategory : selectedLabel;
  const liveStats = [
    {
      id: 1,
      title: "Total Spent",
      value: `₹${total.toFixed(2)}`,
      icon: "payments",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      trend: { value: "", label: statsLabel, color: "text-text-secondary" },
    },
    {
      id: 2,
      title: "Avg Daily Spend",
      value: `₹${avgDaily.toFixed(2)}`,
      icon: "trending_up",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      trend: { value: "", label: `${filteredForStats.length} transaction${filteredForStats.length !== 1 ? "s" : ""}`, color: "text-text-secondary" },
    },
    {
      id: 3,
      title: "Largest Expense",
      value: largest ? `₹${Number(largest.amount).toFixed(2)}` : "—",
      icon: "arrow_upward",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      trend: { value: "", label: largest?.title ?? "None yet", color: "text-text-secondary" },
    },
  ];

  // Build filter options from real categories
  const liveFilterOptions = {
    ...filterOptions,
    categories: ["All Categories", ...categories.map((c) => c.name)],
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>
            Spending
          </p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
            Transactions
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {MONTH_OPTIONS.find(o => o.month === selectedMonth.month && o.year === selectedMonth.year)?.label ?? ""}
          </p>
        </motion.div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => openAdd()}
            className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold h-10 px-5 rounded-xl transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
            Add Expense
          </motion.button>
        </div>
      </div>

      {/* Month picker */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {MONTH_OPTIONS.map((opt) => {
          const active = opt.month === selectedMonth.month && opt.year === selectedMonth.year;
          return (
            <button
              key={`${opt.year}-${opt.month}`}
              onClick={() => handleMonthChange(opt)}
              className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={active ? {
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(139,92,246,0.4)",
              } : {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#7B8FA8",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Stats — desktop: 3-col grid of cards | mobile: compact inline bar */}
      {!isLoading && (
        <>
          {/* Mobile summary bar */}
          <div
            className="flex sm:hidden rounded-2xl mb-4 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {liveStats.map((stat, i) => (
              <div
                key={stat.id}
                className="flex-1 flex flex-col gap-0.5 px-4 py-3 min-w-0"
                style={i < liveStats.length - 1 ? { borderRight: "1px solid rgba(255,255,255,0.07)" } : {}}
              >
                <p
                  className="text-[9px] font-bold uppercase tracking-widest truncate"
                  style={{ color: "#7B8FA8" }}
                >
                  {stat.title}
                </p>
                <p className="text-white text-base font-bold leading-tight truncate">{stat.value}</p>
                <p className="text-[10px] truncate" style={{ color: "#7B8FA8" }}>{stat.trend?.label}</p>
              </div>
            ))}
          </div>

          {/* Desktop 3-col grid */}
          <div className="hidden sm:grid grid-cols-3 gap-3 mb-6">
            {liveStats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <TransactionStatsCard stat={stat} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Stats skeleton — mobile */}
      {isLoading && (
        <div
          className="flex sm:hidden items-center rounded-2xl mb-4 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[0,1,2].map((i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center px-3 py-3 gap-1.5"
              style={i < 2 ? { borderRight: "1px solid rgba(255,255,255,0.07)" } : {}}
            >
              <div className="w-4 h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="h-3 w-14 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="h-2 w-10 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Skeleton loader */}
      {isLoading && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="px-4 py-3 flex items-center gap-3"
              style={i < 5 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}}
            >
              <div className="w-9 h-9 rounded-xl shrink-0 animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.07)", width: `${50 + (i * 13) % 35}%` }} />
                <div className="h-2 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.04)", width: `${25 + (i * 7) % 25}%` }} />
              </div>
              <div className="h-3.5 w-16 rounded-full animate-pulse shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl p-4 text-sm text-red-400 mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          Failed to load transactions: {error.message}
        </div>
      )}

      {/* Transactions Table */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <TransactionsTable
            transactions={allTransactions}
            filterOptions={liveFilterOptions}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </motion.div>
      )}

      {/* Add / Edit Expense modal */}
      <AddTransactionModal
        open={modalOpen}
        onClose={closeModal}
        initial={editTarget}
      />

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(239,68,68,0.15)" }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>
                    delete
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Transaction?</h3>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                    "{deleteTarget.title}" (₹{Number(deleteTarget.amount).toFixed(2)}) will be permanently removed.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteTransaction.isPending}
                  className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }}
                >
                  {deleteTransaction.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;

