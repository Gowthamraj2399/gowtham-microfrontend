import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBudgetsWithSpending, useDeleteBudget } from "../../lib/budget-query";
import { usePartnerBudgetsWithSpending } from "../../lib/partner-query";
import { usePartner } from "../../lib/PartnerContext";
import BudgetFormModal from "../../components/budgets/BudgetFormModal";

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR = now.getFullYear();

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getBarColor(pct, over) {
  if (over) return "#EF4444";
  if (pct >= 85) return "#F97316";
  if (pct >= 60) return "#EAB308";
  return "#22C55E";
}

// Fill color based on remaining budget (inverse of spent)
function getFillColor(pct, over) {
  if (over) return "#EF4444";
  const rem = 100 - pct;
  if (rem <= 15) return "#EF4444";
  if (rem <= 30) return "#F97316";
  if (rem <= 50) return "#EAB308";
  return "#22C55E";
}

const BudgetsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: budgets = [], isLoading } = useBudgetsWithSpending(CURRENT_YEAR, CURRENT_MONTH);
  const deleteBudget = useDeleteBudget();

  // Partner budgets
  const { showPartner, partnerId, partnerName } = usePartner();
  const { data: partnerBudgets = [] } = usePartnerBudgetsWithSpending(
    showPartner ? partnerId : null,
    CURRENT_YEAR,
    CURRENT_MONTH
  );

  const existingCategoryIds = budgets.map((b) => b.category_id);

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (b) => { setEditTarget(b); setModalOpen(true); };

  const handleDelete = async () => {
    try {
      await deleteBudget.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete budget failed:", err.message);
    }
  };

  const totalBudget = budgets.reduce((s, b) => s + b.monthly_amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overallPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const overallOver = totalSpent > totalBudget && totalBudget > 0;

  return (
    <div className="max-w-[900px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#22C55E" }}>Budgets</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">Monthly Budgets</h1>
          <p className="text-text-secondary text-sm mt-1">
            {MONTH_NAMES[CURRENT_MONTH - 1]} {CURRENT_YEAR}
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold h-10 px-5 rounded-xl transition-all active:scale-95 shrink-0"
          style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", boxShadow: "0 4px 15px rgba(34,197,94,0.35)" }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
          Add Budget
        </motion.button>
      </div>

      {/* Overall summary card */}
      {budgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7B8FA8" }}>Overall</p>
            <p className="text-sm font-bold" style={{ color: overallOver ? "#EF4444" : "#F1F5F9" }}>
              ₹{totalSpent.toLocaleString("en-IN")} <span style={{ color: "#475569" }}>/ ₹{totalBudget.toLocaleString("en-IN")}</span>
            </p>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: "8px", background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: getBarColor(overallPct, overallOver) }}
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs" style={{ color: "#7B8FA8" }}>{overallPct.toFixed(0)}% used</p>
            <p className="text-xs font-semibold" style={{ color: overallOver ? "#EF4444" : "#22C55E" }}>
              {overallOver
                ? `₹${(totalSpent - totalBudget).toLocaleString("en-IN")} over`
                : `₹${(totalBudget - totalSpent).toLocaleString("en-IN")} remaining`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Budget cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#22C55E" }} />
        </div>
      ) : budgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#22C55E" }}>savings</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">No budgets yet</p>
            <p className="text-text-secondary text-sm mt-1">Set monthly limits for your spending categories</p>
          </div>
          <button
            onClick={openAdd}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }}
          >
            Create your first budget
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {budgets.map((budget, i) => {
            const barColor  = getBarColor(budget.pct, budget.over);
            const fillColor = getFillColor(budget.pct, budget.over);
            const fillPct   = budget.over ? 100 : Math.max(0, 100 - budget.pct);
            const cat = budget.category;
            const pm = budget.payment_method;
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: budget.over
                    ? "1px solid rgba(239,68,68,0.25)"
                    : `1px solid ${fillColor}30`,
                }}
              >
                {/* Fill background — drains left as spending rises */}
                <motion.div
                  className="absolute inset-y-0 left-0 pointer-events-none"
                  style={{ background: fillColor, opacity: budget.over ? 0.18 : 0.1 }}
                  initial={{ width: "100%" }}
                  whileInView={{ width: `${fillPct}%` }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 + 0.1 }}
                />
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {cat && (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${cat.color}22` }}
                      >
                        <span
                          className="material-symbols-rounded"
                          style={{ fontSize: "20px", color: cat.color, fontVariationSettings: "'FILL' 1" }}
                        >
                          {cat.icon}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-bold truncate">{cat?.name ?? "Unknown"}</p>
                      {pm && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: "#475569" }}>
                          Default: {pm.name}{pm.last4 ? ` •••• ${pm.last4}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {budget.over && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}
                      >
                        Over budget
                      </span>
                    )}
                    <button
                      onClick={() => openEdit(budget)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: "15px", color: "#7B8FA8" }}>edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(budget)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={{ background: "rgba(239,68,68,0.08)" }}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: "15px", color: "#F87171" }}>delete</span>
                    </button>
                  </div>
                </div>

                {/* Amount row */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-xl font-black" style={{ color: barColor }}>
                    ₹{budget.spent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm" style={{ color: "#475569" }}>
                    / ₹{budget.monthly_amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: "#7B8FA8" }}>
                    {budget.pct.toFixed(0)}%
                  </span>
                </div>

                {/* Remaining */}
                <p className="text-xs font-semibold" style={{ color: budget.over ? "#F87171" : "#22C55E" }}>
                  {budget.over
                    ? `₹${Math.abs(budget.remaining).toLocaleString("en-IN")} over budget`
                    : `₹${budget.remaining.toLocaleString("en-IN")} remaining`}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Partner budgets section */}
      {showPartner && partnerId && partnerBudgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#F472B6", fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <h2 className="text-sm font-bold text-white">{partnerName || "Partner"}'s Budgets</h2>
          </div>
          <div className="flex flex-col gap-4">
            {partnerBudgets.map((budget, i) => {
              const barColor = getBarColor(budget.pct, budget.over);
              const cat = budget.category;
              const pm  = budget.payment_method;
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: budget.over ? "1px solid rgba(239,68,68,0.25)" : `1px solid ${getFillColor(budget.pct, budget.over)}30`,
                  }}
                >
                  {/* Fill background — drains left as spending rises */}
                  <motion.div
                    className="absolute inset-y-0 left-0 pointer-events-none"
                    style={{ background: getFillColor(budget.pct, budget.over), opacity: budget.over ? 0.18 : 0.1 }}
                    initial={{ width: "100%" }}
                    whileInView={{ width: `${budget.over ? 100 : Math.max(0, 100 - budget.pct)}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 + 0.1 }}
                  />
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {cat && (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cat.color}22` }}>
                          <span className="material-symbols-rounded" style={{ fontSize: "20px", color: cat.color, fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-bold truncate">{cat?.name ?? "Unknown"}</p>
                        {pm && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: "#475569" }}>
                            Default: {pm.name}{pm.last4 ? ` •••• ${pm.last4}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    {budget.over && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold shrink-0" style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}>Over budget</span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-xl font-black" style={{ color: barColor }}>₹{budget.spent.toLocaleString("en-IN")}</span>
                    <span className="text-sm" style={{ color: "#475569" }}>/ ₹{budget.monthly_amount.toLocaleString("en-IN")}</span>
                    <span className="text-xs ml-auto" style={{ color: "#7B8FA8" }}>{budget.pct.toFixed(0)}%</span>
                  </div>

                  <p className="text-xs font-semibold" style={{ color: budget.over ? "#F87171" : "#22C55E" }}>
                    {budget.over
                      ? `₹${Math.abs(budget.remaining).toLocaleString("en-IN")} over budget`
                      : `₹${budget.remaining.toLocaleString("en-IN")} remaining`}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Budget form modal */}
      <BudgetFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        initial={editTarget}
        existingCategoryIds={existingCategoryIds}
      />

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)" }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)" }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#F87171" }}>delete</span>
                </div>
                <div>
                  <p className="text-white font-bold">Delete Budget?</p>
                  <p className="text-xs text-text-secondary">Remove the budget for <span className="text-white">{deleteTarget.category?.name}</span>?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteBudget.isPending}
                  className="flex-1 h-10 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" }}
                >
                  {deleteBudget.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetsPage;
