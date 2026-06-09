import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRecurringPayments,
  useUpdateRecurringPayment,
  useDeleteRecurringPayment,
} from "../../lib/recurring-query";
import RecurringFormModal, { FREQUENCY_OPTIONS } from "../../components/recurring-payments/RecurringFormModal";
import { usePartner } from "../../lib/PartnerContext";
import { usePartnerRecurring } from "../../lib/partner-query";

// ── Helpers ──────────────────────────────────────────────────────────────────
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

function toMonthly(amount, frequency) {
  if (frequency === "daily")  return amount * 30;
  if (frequency === "weekly") return amount * 4.33;
  if (frequency === "yearly") return amount / 12;
  return amount;
}

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const FREQ_LABEL = Object.fromEntries(FREQUENCY_OPTIONS.map((f) => [f.value, f.label]));
const FREQ_ICON  = Object.fromEntries(FREQUENCY_OPTIONS.map((f) => [f.value, f.icon]));

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
    ))}
  </div>
);

// ── Card ──────────────────────────────────────────────────────────────────────
const RecurringCard = ({ item, onEdit, onDelete, onToggle }) => {
  const status = getDueStatus(item.next_due_date);
  const color  = item.color || "#8B5CF6";
  return (
    <motion.div layout className="rounded-2xl px-4 py-3.5 flex flex-col gap-2.5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <span className="material-symbols-rounded" style={{ fontSize: "18px", color, fontVariationSettings: "'FILL' 1" }}>{item.icon || "repeat"}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-white truncate">{item.title}</p>
            {item._isPartner && <span className="text-[9px] font-bold px-1 py-0.5 rounded shrink-0" style={{ background: "rgba(244,114,182,0.15)", color: "#F472B6" }}>Partner</span>}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {item.category && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{ background: `${item.category.color}18`, color: item.category.color }}>
                {item.category.name}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(255,255,255,0.06)", color: "#7B8FA8" }}>
              <span className="material-symbols-rounded" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>{FREQ_ICON[item.frequency] || "repeat"}</span>
              {FREQ_LABEL[item.frequency] || item.frequency}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 gap-1">
          <span className="text-base font-black" style={{ color }}>{fmtCurrency(item.amount)}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ color: status.color, background: status.bg }}>{status.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {!item._isPartner && (
          <button onClick={() => onToggle(item)}
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all active:scale-95"
            style={item.is_active
              ? { background: "rgba(16,185,129,0.12)", color: "#34D399" }
              : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>
              {item.is_active ? "check_circle" : "pause_circle"}
            </span>
            {item.is_active ? "Active" : "Paused"}
          </button>
        )}
        {item._isPartner && (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ background: "rgba(244,114,182,0.1)", color: "#F472B6" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>favorite</span>
            Partner
          </span>
        )}
        <div className="flex-1" />
        {!item._isPartner && (
          <>
            <button onClick={() => onEdit(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(139,92,246,0.12)", color: "#A78BFA" }}>
              <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>edit</span>
            </button>
            <button onClick={() => onDelete(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}>
              <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>delete</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
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
      <h3 className="text-base font-bold text-white mb-1">Delete recurring payment?</h3>
      <p className="text-sm text-text-secondary mb-5">
        <span className="font-semibold text-white">"{item?.title}"</span> will be removed.
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
const RecurringPaymentsPage = () => {
  const { data: payments = [], isLoading: isOwnLoading } = useRecurringPayments();
  const updatePayment = useUpdateRecurringPayment();
  const deletePayment = useDeleteRecurringPayment();
  const { showPartner, partnerId, isPartnerConnLoading } = usePartner();
  const { data: partnerPayments = [], isLoading: isPartnerLoading } = usePartnerRecurring(showPartner ? partnerId : null);
  const isLoading = isOwnLoading || (showPartner && (isPartnerConnLoading || (!!partnerId && isPartnerLoading)));

  const [tab,        setTab]        = useState("active");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const allPayments = showPartner ? [...payments, ...partnerPayments] : payments;
  const active      = allPayments.filter((p) => p.is_active);
  const inactive    = payments.filter((p) => !p.is_active); // only own paused
  const visible     = tab === "active" ? active : inactive;

  const monthlyCost = active.reduce((sum, p) => sum + toMonthly(p.amount, p.frequency), 0);
  const nextDue     = active.length
    ? active.reduce((min, p) => p.next_due_date < min ? p.next_due_date : min, active[0].next_due_date)
    : null;

  const handleAdd   = ()     => { setEditItem(null);  setModalOpen(true); };
  const handleEdit  = (item) => { setEditItem(item);  setModalOpen(true); };
  const handleClose = ()     => { setModalOpen(false); setEditItem(null); };
  const handleToggle = (item) => updatePayment.mutate({ id: item.id, is_active: !item.is_active });
  const handleDelete = async () => {
    if (!deleteItem) return;
    await deletePayment.mutateAsync(deleteItem.id);
    setDeleteItem(null);
  };

  return (
    <div className="max-w-[680px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Bills</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">Recurring Payments</h1>
          <p className="text-sm mt-1 text-text-secondary">Manage your subscriptions and bills</p>
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl h-10 px-5 text-white text-sm font-bold transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}>
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
          Add Payment
        </button>
      </header>

      {/* Summary bar */}
      {!isLoading && allPayments.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-5 rounded-2xl p-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            { label: "MONTHLY",  value: fmtCurrency(monthlyCost), sub: "total cost" },
            { label: "ACTIVE",   value: active.length,             sub: "payments"  },
            { label: "NEXT DUE", value: nextDue
                ? new Date(nextDue + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                : "—",
              sub: "upcoming" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7B8FA8" }}>{label}</span>
              <span className="text-base font-black text-white leading-tight">{value}</span>
              <span className="text-[10px] font-medium" style={{ color: "#4B5768" }}>{sub}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "active",   label: "Active", count: active.length },
          { key: "inactive", label: "Paused", count: inactive.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={tab === key
              ? { background: "rgba(139,92,246,0.2)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.35)" }
              : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.07)" }}>
            {label}
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
              style={{ background: tab === key ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.08)", color: tab === key ? "#A78BFA" : "#7B8FA8" }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <Skeleton />
      ) : visible.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#8B5CF6", fontVariationSettings: "'FILL' 1" }}>repeat</span>
          </div>
          <p className="text-base font-bold text-white mb-1">
            {tab === "active" ? "No active payments" : "No paused payments"}
          </p>
          <p className="text-sm text-text-secondary mb-5">
            {tab === "active" ? "Add subscriptions, rent, or utility bills" : "Paused payments will appear here"}
          </p>
          {tab === "active" && (
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}>
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
              Add Payment
            </button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-3">
            {visible.map((item) => (
              <RecurringCard key={item.id} item={item}
                onEdit={handleEdit} onDelete={setDeleteItem} onToggle={handleToggle} />
            ))}
          </div>
        </AnimatePresence>
      )}

      <RecurringFormModal open={modalOpen} onClose={handleClose} initial={editItem} />

      <AnimatePresence>
        {deleteItem && (
          <DeleteModal item={deleteItem} onConfirm={handleDelete}
            onCancel={() => setDeleteItem(null)} isPending={deletePayment.isPending} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecurringPaymentsPage;
