import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEmis, useDeleteEmi, useUpdateEmi } from "../../lib/emi-query";
import EMIFormModal, { LOAN_TYPES } from "../../components/emi/EMIFormModal";

// ── Amortization helpers ─────────────────────────────────────────────────────
function computeAmortization(principal, annualRate, tenureMonths, paidCount, emiAmount) {
  const r = (annualRate || 0) / 12 / 100;
  const remaining = Math.max(tenureMonths - paidCount, 0);

  if (!principal || !remaining) return { principalRemaining: 0, interestRemaining: 0 };

  let principalRemaining;
  if (r === 0) {
    // Zero-interest: linear reduction
    principalRemaining = principal * (remaining / tenureMonths);
  } else {
    const k = paidCount;
    const emi = emiAmount || principal * r * Math.pow(1+r, tenureMonths) / (Math.pow(1+r, tenureMonths) - 1);
    principalRemaining = principal * Math.pow(1+r, k) - (emi / r) * (Math.pow(1+r, k) - 1);
  }

  principalRemaining = Math.max(principalRemaining, 0);
  const totalRemaining = remaining * (emiAmount || 0);
  const interestRemaining = Math.max(totalRemaining - principalRemaining, 0);
  return { principalRemaining, interestRemaining };
}


function getDueStatus(nextDueDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due  = new Date(nextDueDateStr + "T00:00:00");
  const diff = Math.round((due - today) / 86400000);
  if (diff < 0)   return { label: `${Math.abs(diff)}d overdue`, color: "#F87171", bg: "rgba(239,68,68,0.1)" };
  if (diff === 0) return { label: "Due today",       color: "#FBBF24", bg: "rgba(245,158,11,0.12)" };
  if (diff <= 3)  return { label: `Due in ${diff}d`, color: "#FBBF24", bg: "rgba(245,158,11,0.1)" };
  return { label: `in ${diff}d`, color: "#7B8FA8", bg: "rgba(255,255,255,0.05)" };
}

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const LOAN_MAP = Object.fromEntries(LOAN_TYPES.map((t) => [t.value, t]));

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
    ))}
  </div>
);

// ── EMI Card ──────────────────────────────────────────────────────────────────
const EMICard = ({ emi, onEdit, onDelete }) => {
  const lt          = LOAN_MAP[emi.loan_type] ?? LOAN_MAP.personal;
  const color       = lt.color;
  const paid        = emi.paid_count;
  const total       = emi.tenure_months;
  const progress    = total > 0 ? Math.min((paid / total) * 100, 100) : 0;
  const outstanding = Math.max((total - paid) * emi.emi_amount, 0);
  const status      = getDueStatus(emi.next_due_date);

  // Principal / interest split using reducing-balance amortization
  const { principalRemaining, interestRemaining } = computeAmortization(
    Number(emi.principal) || 0,
    Number(emi.interest_rate) || 0,
    total,
    paid,
    emi.emi_amount
  );
  const hasPrincipal = !!(Number(emi.principal) || 0);

  return (
    <motion.div layout className="rounded-2xl px-4 py-4 flex flex-col gap-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>

      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <span className="material-symbols-rounded" style={{ fontSize: "20px", color, fontVariationSettings: "'FILL' 1" }}>{lt.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{emi.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
              style={{ background: `${color}18`, color }}>{lt.label}</span>
            {emi.category && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{ background: `${emi.category.color}18`, color: emi.category.color }}>
                {emi.category.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-base font-black" style={{ color }}>{fmtCurrency(emi.emi_amount)}<span className="text-[10px] font-semibold text-text-secondary">/mo</span></span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5"
            style={{ color: status.color, background: status.bg }}>{status.label}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px] font-bold" style={{ color: "#7B8FA8" }}>
            {paid} / {total} months paid
          </span>
          <div className="flex items-center gap-2">
            {hasPrincipal ? (
              <>
                <span className="text-[10px] font-bold" style={{ color: "#34D399" }}>
                  P: {fmtCurrency(principalRemaining)}
                </span>
                <span className="text-[10px]" style={{ color: "#4B5768" }}>+</span>
                <span className="text-[10px] font-bold" style={{ color: "#F87171" }}>
                  I: {fmtCurrency(interestRemaining)}
                </span>
              </>
            ) : (
              <span className="text-[10px] font-bold" style={{ color: "#7B8FA8" }}>
                {fmtCurrency(outstanding)} left
              </span>
            )}
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 pt-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex-1" />
        <button onClick={() => onEdit(emi)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(139,92,246,0.12)", color: "#A78BFA" }}>
          <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>edit</span>
        </button>
        <button onClick={() => onDelete(emi)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}>
          <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>delete</span>
        </button>
      </div>
    </motion.div>
  );
};

// ── Completed EMI card (compact) ──────────────────────────────────────────────
const CompletedEMICard = ({ emi, onDelete }) => {
  const lt    = LOAN_MAP[emi.loan_type] ?? LOAN_MAP.personal;
  const color = lt.color;
  return (
    <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
        <span className="material-symbols-rounded" style={{ fontSize: "16px", color: `${color}80`, fontVariationSettings: "'FILL' 1" }}>{lt.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "#94A3B8" }}>{emi.title}</p>
        <p className="text-[10px] font-medium" style={{ color: "#4B5768" }}>
          {emi.tenure_months} months · {fmtCurrency(emi.emi_amount)}/mo
        </p>
      </div>
      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
        style={{ background: "rgba(16,185,129,0.1)", color: "#34D399" }}>
        <span className="material-symbols-rounded" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        Paid off
      </span>
      <button onClick={() => onDelete(emi)}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 shrink-0"
        style={{ background: "rgba(239,68,68,0.08)", color: "#F8717180" }}>
        <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>delete</span>
      </button>
    </div>
  );
};

// ── Delete confirm ────────────────────────────────────────────────────────────
const DeleteModal = ({ item, onConfirm, onCancel, isPending }) => (
  <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
    <motion.div className="w-full sm:max-w-xs sm:mx-4 rounded-t-3xl sm:rounded-2xl p-5"
      style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)" }}
      initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
      transition={{ type: "spring", damping: 26, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
      <div className="sm:hidden flex justify-center mb-4">
        <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
      </div>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(239,68,68,0.15)" }}>
        <span className="material-symbols-rounded" style={{ fontSize: "22px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>delete</span>
      </div>
      <h3 className="text-base font-bold text-white mb-1">Delete loan?</h3>
      <p className="text-sm text-text-secondary mb-5">
        <span className="font-semibold text-white">"{item?.title}"</span> will be permanently removed.
        Existing transactions are kept.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 h-11 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isPending} className="flex-1 h-11 rounded-xl text-sm font-bold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}>
          {isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const EmiPage = () => {
  const { data: emis = [], isLoading } = useEmis();
  const deleteEmi = useDeleteEmi();

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDone,   setShowDone]   = useState(false);

  const active    = emis.filter((e) => e.is_active);
  const completed = emis.filter((e) => !e.is_active);

  const totalMonthlyEMI  = active.reduce((s, e) => s + e.emi_amount, 0);
  const totalOutstanding = active.reduce((s, e) => s + Math.max((e.tenure_months - e.paid_count) * e.emi_amount, 0), 0);

  // Split using proper reducing-balance amortization
  const { totalPrincipalRemaining, totalInterestRemaining } = active.reduce((acc, e) => {
    const { principalRemaining, interestRemaining } = computeAmortization(
      Number(e.principal) || 0,
      Number(e.interest_rate) || 0,
      e.tenure_months,
      e.paid_count,
      e.emi_amount
    );
    return {
      totalPrincipalRemaining: acc.totalPrincipalRemaining + principalRemaining,
      totalInterestRemaining:  acc.totalInterestRemaining  + interestRemaining,
    };
  }, { totalPrincipalRemaining: 0, totalInterestRemaining: 0 });

  const handleAdd    = ()     => { setEditItem(null);  setModalOpen(true); };
  const handleEdit   = (item) => { setEditItem(item);  setModalOpen(true); };
  const handleClose  = ()     => { setModalOpen(false); setEditItem(null); };
  const handleDelete = async () => {
    if (!deleteItem) return;
    await deleteEmi.mutateAsync(deleteItem.id);
    setDeleteItem(null);
  };

  return (
    <div className="max-w-[680px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Loans</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">EMI Management</h1>
          <p className="text-sm mt-1 text-text-secondary">Track your loans and debt-free journey</p>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl h-10 px-5 text-white text-sm font-bold transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}>
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
          Add Loan
        </button>
      </header>

      {/* Summary bar */}
      {!isLoading && emis.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 rounded-2xl p-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            { label: "MONTHLY EMI",   value: fmtCurrency(totalMonthlyEMI),         sub: "total",       color: "#A78BFA" },
            { label: "ACTIVE LOANS",  value: active.length,                         sub: "ongoing",     color: "#7B8FA8" },
            { label: "PRINCIPAL",     value: fmtCurrency(totalPrincipalRemaining),  sub: "remaining",   color: "#34D399" },
            { label: "INTEREST",      value: fmtCurrency(totalInterestRemaining),   sub: "remaining",   color: "#F87171" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="flex flex-col items-center text-center gap-0.5 py-1">
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7B8FA8" }}>{label}</span>
              <span className="text-sm font-black leading-tight" style={{ color }}>{value}</span>
              <span className="text-[10px] font-medium" style={{ color: "#4B5768" }}>{sub}</span>
            </div>
          ))}
        </div>
      )}

      {/* Active EMIs */}
      {isLoading ? (
        <Skeleton />
      ) : active.length === 0 && completed.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#8B5CF6", fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <p className="text-base font-bold text-white mb-1">No loans added yet</p>
          <p className="text-sm text-text-secondary mb-5">Track home, car, education, or personal loans</p>
          <button onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
            Add Loan
          </button>
        </motion.div>
      ) : (
        <>
          {active.length > 0 && (
            <AnimatePresence mode="popLayout">
              <div className="flex flex-col gap-3 mb-5">
                {active.map((emi) => (
                  <EMICard key={emi.id} emi={emi} onEdit={handleEdit} onDelete={setDeleteItem} />
                ))}
              </div>
            </AnimatePresence>
          )}

          {active.length === 0 && (
            <motion.div className="flex flex-col items-center justify-center py-10 text-center mb-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm font-semibold text-white mb-1">No active loans</p>
              <p className="text-xs text-text-secondary">All loans are paid off!</p>
            </motion.div>
          )}

          {/* Completed section */}
          {completed.length > 0 && (
            <div className="mt-2">
              <button onClick={() => setShowDone((v) => !v)}
                className="flex items-center gap-2 w-full text-left mb-3 group">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7B8FA8" }}>
                  Paid Off ({completed.length})
                </span>
                <span className="material-symbols-rounded transition-transform" style={{ fontSize: "16px", color: "#7B8FA8", transform: showDone ? "rotate(180deg)" : "none" }}>
                  expand_more
                </span>
              </button>
              <AnimatePresence>
                {showDone && (
                  <motion.div className="flex flex-col gap-2"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}>
                    {completed.map((emi) => (
                      <CompletedEMICard key={emi.id} emi={emi} onDelete={setDeleteItem} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      <EMIFormModal open={modalOpen} onClose={handleClose} initial={editItem} />

      <AnimatePresence>
        {deleteItem && (
          <DeleteModal item={deleteItem} onConfirm={handleDelete}
            onCancel={() => setDeleteItem(null)} isPending={deleteEmi.isPending} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmiPage;
