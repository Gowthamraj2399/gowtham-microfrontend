import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TransactionStatsCard from "../../components/transactions/TransactionStatsCard";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import AddTransactionModal from "../../components/transactions/AddTransactionModal";
import { useTransactions, computeStats, useDeleteTransaction } from "../../lib/transactions-query";
import { useCategories } from "../../lib/categories-query";
import { filterOptions } from "../../config/transactionsConfig";

const now = new Date();
const MONTH = now.getMonth() + 1;
const YEAR  = now.getFullYear();

const TransactionsPage = () => {
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { data: transactions = [], isLoading, error } = useTransactions({ year: YEAR, month: MONTH });
  const { data: categories = [] } = useCategories();
  const deleteTransaction = useDeleteTransaction();

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

  // Derive stats from real data
  const { total, avgDaily, largest } = computeStats(transactions);
  const liveStats = [
    {
      id: 1,
      title: "Total Spent",
      value: `₹${total.toFixed(2)}`,
      icon: "payments",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      trend: { value: "", label: "This month", color: "text-text-secondary" },
    },
    {
      id: 2,
      title: "Avg Daily Spend",
      value: `₹${avgDaily.toFixed(2)}`,
      icon: "trending_up",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      trend: { value: "", label: `${transactions.length} transactions`, color: "text-text-secondary" },
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
            Track every rupee you spend this month.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => openAdd()}
          className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold h-10 px-5 rounded-xl transition-all active:scale-95 shrink-0"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
          Add Expense
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
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
            transactions={transactions}
            filterOptions={liveFilterOptions}
            categories={categories}
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

