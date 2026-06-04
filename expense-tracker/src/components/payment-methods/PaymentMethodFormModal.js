import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Payment method types ───────────────────────────────────────────────────
export const PAYMENT_TYPES = [
  { value: "bank",    label: "Bank Account",   icon: "account_balance",        color: "#3B82F6" },
  { value: "credit",  label: "Credit Card",    icon: "credit_card",            color: "#8B5CF6" },
  { value: "debit",   label: "Debit Card",     icon: "payment",                color: "#06B6D4" },
  { value: "wallet",  label: "Wallet",         icon: "account_balance_wallet", color: "#10B981" },
  { value: "upi",     label: "UPI",            icon: "qr_code",                color: "#F59E0B" },
  { value: "cash",    label: "Cash",           icon: "payments",               color: "#22C55E" },
];

// ── Color palette ──────────────────────────────────────────────────────────
const COLOR_OPTIONS = [
  "#8B5CF6", "#6366F1", "#3B82F6", "#06B6D4",
  "#10B981", "#22C55E", "#84CC16", "#EAB308",
  "#F59E0B", "#F97316", "#EF4444", "#EC4899",
  "#A855F7", "#D946EF", "#64748B", "#94A3B8",
];

const DEFAULT_FORM = {
  name: "",
  type: "bank",
  last4: "",
  color: "#3B82F6",
  icon: "account_balance",
  is_default: false,
};

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

const PaymentMethodFormModal = ({ open, initial = null, onSave, onClose, loading }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({ ...DEFAULT_FORM, ...initial });
      } else {
        setForm(DEFAULT_FORM);
      }
      setError(null);
    }
  }, [open, initial]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // When type changes, auto-update icon and color to match the type defaults
  const handleTypeChange = (value) => {
    const type = PAYMENT_TYPES.find((t) => t.value === value);
    setForm((f) => ({
      ...f,
      type: value,
      icon: type?.icon || f.icon,
      color: type?.color || f.color,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (form.last4 && !/^\d{1,4}$/.test(form.last4)) {
      setError("Last 4 digits must be numeric (max 4)");
      return;
    }
    setError(null);
    await onSave({ ...form, name: form.name.trim() });
  };

  const selectedType = PAYMENT_TYPES.find((t) => t.value === form.type);
  const needsLast4 = ["bank", "credit", "debit"].includes(form.type);

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
            className="w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl flex flex-col"
            style={{ ...cardStyle, maxHeight: "92dvh" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                {/* Live preview */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${form.color}22` }}
                >
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "18px", color: form.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {form.icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {initial ? "Edit Payment Method" : "New Payment Method"}
                  </h2>
                  {form.name && (
                    <p className="text-xs mt-0.5" style={{ color: form.color }}>
                      {form.name}{form.last4 ? ` •••• ${form.last4}` : ""}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#7B8FA8" }}>close</span>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto flex-1">
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* Type selector */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => handleTypeChange(t.value)}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all text-xs font-semibold"
                        style={{
                          background: form.type === t.value ? `${t.color}18` : "rgba(255,255,255,0.03)",
                          border: form.type === t.value ? `1px solid ${t.color}55` : "1px solid rgba(255,255,255,0.07)",
                          color: form.type === t.value ? t.color : "#7B8FA8",
                        }}
                      >
                        <span
                          className="material-symbols-rounded"
                          style={{ fontSize: "20px", color: form.type === t.value ? t.color : "#475569", fontVariationSettings: "'FILL' 1" }}
                        >
                          {t.icon}
                        </span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Name *</label>
                  <input
                    className="w-full px-3 py-2.5 text-sm"
                    style={inputStyle}
                    placeholder={
                      form.type === "bank"    ? "e.g. HDFC Savings Account" :
                      form.type === "credit"  ? "e.g. Axis Black Card" :
                      form.type === "debit"   ? "e.g. SBI Debit Card" :
                      form.type === "wallet"  ? "e.g. PhonePe Wallet" :
                      form.type === "upi"     ? "e.g. GPay UPI" :
                                               "e.g. Cash on hand"
                    }
                    value={form.name}
                    onChange={set("name")}
                    maxLength={50}
                    autoFocus
                  />
                </div>

                {/* Last 4 digits — only for bank/card */}
                {needsLast4 && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                      Last 4 digits <span className="opacity-50 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      className="w-full px-3 py-2.5 text-sm"
                      style={inputStyle}
                      placeholder="e.g. 4321"
                      value={form.last4}
                      onChange={(e) => setForm((f) => ({ ...f, last4: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    />
                  </div>
                )}

                {/* Color */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Color</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, color: c }))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: c,
                          outline: form.color === c ? `2px solid white` : "none",
                          outlineOffset: "2px",
                          transform: form.color === c ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        {form.color === c && (
                          <span className="material-symbols-rounded text-white" style={{ fontSize: "14px" }}>check</span>
                        )}
                      </button>
                    ))}
                    {/* Custom color */}
                    <div className="relative w-7 h-7 shrink-0" title="Pick custom color">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-lg"
                      />
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center pointer-events-none"
                        style={{
                          background: !COLOR_OPTIONS.includes(form.color)
                            ? form.color
                            : "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                          outline: !COLOR_OPTIONS.includes(form.color) ? `2px solid white` : "none",
                          outlineOffset: "2px",
                          transform: !COLOR_OPTIONS.includes(form.color) ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        {!COLOR_OPTIONS.includes(form.color) ? (
                          <span className="material-symbols-rounded text-white" style={{ fontSize: "14px", textShadow: "0 0 3px rgba(0,0,0,0.6)" }}>check</span>
                        ) : (
                          <span className="material-symbols-rounded text-white" style={{ fontSize: "13px", textShadow: "0 0 4px rgba(0,0,0,0.9)" }}>colorize</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Set as default */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    className="w-9 h-5 rounded-full relative transition-all shrink-0"
                    style={{ background: form.is_default ? form.color : "rgba(255,255,255,0.1)" }}
                    onClick={() => setForm((f) => ({ ...f, is_default: !f.is_default }))}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                      style={{ left: form.is_default ? "calc(100% - 18px)" : "2px" }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary">Set as default payment method</span>
                </label>

                {error && (
                  <p className="text-xs font-semibold" style={{ color: "#F87171" }}>{error}</p>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-4 flex gap-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all active:scale-95"
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
                  disabled={loading}
                  className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${form.color} 0%, ${form.color}BB 100%)`,
                    boxShadow: `0 4px 15px ${form.color}44`,
                  }}
                >
                  {loading ? "Saving…" : initial ? "Save Changes" : "Add Method"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentMethodFormModal;
