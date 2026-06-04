import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "../../lib/categories-query";
import { useAddTransaction, useUpdateTransaction } from "../../lib/transactions-query";
import { usePaymentMethods } from "../../lib/payment-methods-query";
import { PAYMENT_TYPES } from "../payment-methods/PaymentMethodFormModal";

const overlayStyle = {
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(6px)",
};
const cardStyle = {
  background: "#0D1117",
  border: "1px solid rgba(255,255,255,0.1)",
};
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "0.75rem",
  color: "#F1F5F9",
  outline: "none",
};

const today = () => new Date().toISOString().split("T")[0];

const DEFAULT_FORM = {
  title: "",
  amount: "",
  category_id: "",
  payment_method_id: "",
  date: today(),
  notes: "",
};

// ── Payment method dropdown ────────────────────────────────────────────────
const PaymentMethodSelect = ({ methods, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = methods.find((m) => m.id === value);
  const typeInfo = selected ? PAYMENT_TYPES.find((t) => t.value === selected.type) : null;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-all"
        style={{
          ...inputStyle,
          borderColor: open ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.09)",
        }}
      >
        {selected ? (
          <>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `${selected.color}22` }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "13px", color: selected.color, fontVariationSettings: "'FILL' 1" }}
              >
                {selected.icon}
              </span>
            </div>
            <span className="text-white font-medium truncate">
              {selected.name}{selected.last4 ? ` •••• ${selected.last4}` : ""}
            </span>
          </>
        ) : (
          <span style={{ color: "#4B5768" }}>Select payment method…</span>
        )}
        <span
          className="material-symbols-rounded ml-auto shrink-0 transition-transform"
          style={{ fontSize: "18px", color: "#7B8FA8", transform: open ? "rotate(180deg)" : "none" }}
        >
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 mt-1.5 z-50 rounded-xl overflow-hidden"
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              maxHeight: "220px",
              overflowY: "auto",
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {/* None option */}
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm transition-all"
              style={{
                background: !value ? "rgba(139,92,246,0.1)" : "transparent",
                color: !value ? "#A78BFA" : "#7B8FA8",
              }}
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="material-symbols-rounded" style={{ fontSize: "12px", color: "#475569" }}>block</span>
              </div>
              Unspecified
            </button>

            {methods.map((m) => {
              const ti = PAYMENT_TYPES.find((t) => t.value === m.type);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onChange(m.id); setOpen(false); }}
                  className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm transition-all"
                  style={{ background: value === m.id ? `${m.color}18` : "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${m.color}12`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = value === m.id ? `${m.color}18` : "transparent")}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${m.color}22` }}
                  >
                    <span
                      className="material-symbols-rounded"
                      style={{ fontSize: "13px", color: m.color, fontVariationSettings: "'FILL' 1" }}
                    >
                      {m.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="truncate block" style={{ color: value === m.id ? m.color : "#E2E8F0" }}>
                      {m.name}{m.last4 ? ` •••• ${m.last4}` : ""}
                    </span>
                    {ti && (
                      <span className="text-[10px]" style={{ color: "#475569" }}>{ti.label}</span>
                    )}
                  </div>
                  {value === m.id && (
                    <span className="material-symbols-rounded ml-auto shrink-0" style={{ fontSize: "14px", color: m.color }}>check</span>
                  )}
                </button>
              );
            })}

            {methods.length === 0 && (
              <p className="px-4 py-3 text-xs text-text-secondary">
                No methods yet.{" "}
                <Link to="/payment-methods" className="underline" style={{ color: "#A78BFA" }}>Add one</Link>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Category dropdown ──────────────────────────────────────────────────────
const CategorySelect = ({ categories, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = categories.find((c) => c.id === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-all"
        style={{
          ...inputStyle,
          borderColor: open ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.09)",
        }}
      >
        {selected ? (
          <>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `${selected.color}22` }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "13px", color: selected.color, fontVariationSettings: "'FILL' 1" }}
              >
                {selected.icon}
              </span>
            </div>
            <span className="text-white font-medium truncate">{selected.name}</span>
          </>
        ) : (
          <span style={{ color: "#4B5768" }}>Select a category…</span>
        )}
        <span
          className="material-symbols-rounded ml-auto shrink-0 transition-transform"
          style={{ fontSize: "18px", color: "#7B8FA8", transform: open ? "rotate(180deg)" : "none" }}
        >
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 mt-1.5 z-50 rounded-xl overflow-hidden"
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              maxHeight: "220px",
              overflowY: "auto",
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {/* None option */}
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm transition-all"
              style={{
                background: !value ? "rgba(139,92,246,0.1)" : "transparent",
                color: !value ? "#A78BFA" : "#7B8FA8",
              }}
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                <span className="material-symbols-rounded" style={{ fontSize: "12px", color: "#475569" }}>block</span>
              </div>
              No category
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { onChange(cat.id); setOpen(false); }}
                className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm transition-all"
                style={{
                  background: value === cat.id ? `${cat.color}18` : "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${cat.color}12`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = value === cat.id ? `${cat.color}18` : "transparent")}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `${cat.color}22` }}
                >
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "13px", color: cat.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {cat.icon}
                  </span>
                </div>
                <span className="truncate" style={{ color: value === cat.id ? cat.color : "#E2E8F0" }}>
                  {cat.name}
                </span>
                {value === cat.id && (
                  <span className="material-symbols-rounded ml-auto shrink-0" style={{ fontSize: "14px", color: cat.color }}>
                    check
                  </span>
                )}
              </button>
            ))}

            {categories.length === 0 && (
              <p className="px-4 py-3 text-xs text-text-secondary">
                No categories yet.{" "}
                <Link to="/categories" onClick={() => setOpen(false)} className="underline" style={{ color: "#A78BFA" }}>Create one</Link>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main modal ─────────────────────────────────────────────────────────────
const AddTransactionModal = ({ open, onClose, onSuccess, initial = null }) => {
  const { data: categories = [] } = useCategories();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const addTransaction    = useAddTransaction();
  const updateTransaction = useUpdateTransaction();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);

  const isEditing = !!initial?.id;

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          title: initial.title || "",
          amount: String(initial.amount) || "",
          category_id: initial.category_id || "",
          payment_method_id: initial.payment_method_id || "",
          date: initial.date || today(),
          notes: initial.notes || "",
        });
      } else {
        setForm({ ...DEFAULT_FORM, date: today() });
      }
      setError(null);
    }
  }, [open, initial]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) { setError("Enter a valid amount greater than 0"); return; }
    if (!form.date) { setError("Date is required"); return; }

    setError(null);
    try {
      if (isEditing) {
        await updateTransaction.mutateAsync({
          id: initial.id,
          title: form.title.trim(),
          amount: amt,
          category_id: form.category_id || null,
          payment_method_id: form.payment_method_id || null,
          date: form.date,
          notes: form.notes.trim() || null,
        });
      } else {
        await addTransaction.mutateAsync({
          title: form.title.trim(),
          amount: amt,
          category_id: form.category_id || null,
          payment_method_id: form.payment_method_id || null,
          date: form.date,
          notes: form.notes.trim() || null,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong, please try again.");
    }
  };

  // Pending state for either mutation
  const isSaving = addTransaction.isPending || updateTransaction.isPending;

  // Selected category for dynamic accent colour
  const selCat = categories.find((c) => c.id === form.category_id);
  const accent = selCat?.color || "#8B5CF6";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-2xl flex flex-col"
            style={cardStyle}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-sm font-bold text-white">{isEditing ? "Edit Expense" : "Add Expense"}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#7B8FA8" }}>close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* Amount — large, prominent */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Amount *</label>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold"
                      style={{ color: accent }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="w-full pl-8 pr-4 py-3 text-xl font-bold"
                      style={{ ...inputStyle, borderRadius: "0.875rem", letterSpacing: "-0.02em" }}
                      placeholder="0.00"
                      value={form.amount}
                      onChange={set("amount")}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">What did you spend on? *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 text-sm"
                    style={inputStyle}
                    placeholder="e.g. Starbucks, Uber, Amazon…"
                    value={form.title}
                    onChange={set("title")}
                    maxLength={80}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Category</label>
                  <CategorySelect
                    categories={categories}
                    value={form.category_id}
                    onChange={(id) => setForm((f) => ({ ...f, category_id: id }))}
                  />
                </div>

                {/* Payment method */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Paid via</label>
                  <PaymentMethodSelect
                    methods={paymentMethods}
                    value={form.payment_method_id}
                    onChange={(id) => setForm((f) => ({ ...f, payment_method_id: id }))}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Date *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 text-sm"
                    style={{ ...inputStyle, colorScheme: "dark" }}
                    value={form.date}
                    onChange={set("date")}
                    max={today()}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Notes</label>
                  <textarea
                    className="w-full px-3 py-2.5 text-sm resize-none"
                    style={{ ...inputStyle, minHeight: "72px" }}
                    placeholder="Optional notes…"
                    value={form.notes}
                    onChange={set("notes")}
                    maxLength={200}
                    rows={2}
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold" style={{ color: "#F87171" }}>{error}</p>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-4 flex gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${accent} 0%, ${accent}BB 100%)`,
                    boxShadow: `0 4px 15px ${accent}44`,
                  }}
                >
                  {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;
