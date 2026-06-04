import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "../../lib/categories-query";
import { usePaymentMethods } from "../../lib/payment-methods-query";
import { useAddEmi, useUpdateEmi, useAddEmiWithHistory } from "../../lib/emi-query";
import { PAYMENT_TYPES } from "../payment-methods/PaymentMethodFormModal";

const overlayStyle = { background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" };
const cardStyle = { background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)" };
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "0.75rem",
  color: "#F1F5F9",
  outline: "none",
};

export const LOAN_TYPES = [
  { value: "home",        label: "Home",      icon: "home",            color: "#3B82F6" },
  { value: "car",         label: "Car",        icon: "directions_car",  color: "#10B981" },
  { value: "personal",    label: "Personal",   icon: "person",          color: "#8B5CF6" },
  { value: "education",   label: "Education",  icon: "school",          color: "#F59E0B" },
  { value: "credit_card", label: "Card",       icon: "credit_card",     color: "#EF4444" },
  { value: "other",       label: "Other",      icon: "account_balance", color: "#06B6D4" },
];

function toLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function advanceMonthLocal(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const origDay = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(origDay, lastDay));
  return toLocalDateStr(d);
}

function computePastInstallments(startDateStr, tenureMonths) {
  if (!startDateStr || !tenureMonths || tenureMonths <= 0) return [];
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const result = [];
  let dateStr = startDateStr;
  for (let i = 0; i < tenureMonths; i++) {
    const d = new Date(dateStr + "T00:00:00");
    if (d >= now) break; // only strictly past
    result.push({
      index: i,
      dueDate: dateStr,
      label: d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
    });
    dateStr = advanceMonthLocal(dateStr);
  }
  return result;
}

const today = () => toLocalDateStr(new Date());

function calcEMI(principal, ratePercent, tenureMonths) {
  const p = parseFloat(principal);
  const n = parseInt(tenureMonths);
  if (!p || !n || p <= 0 || n <= 0) return null;
  const r = parseFloat(ratePercent) / (12 * 100);
  if (!r || r === 0) return (p / n).toFixed(2);
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi.toFixed(2);
}

const DEFAULT_FORM = {
  title: "", loan_type: "personal", principal: "", interest_rate: "",
  tenure_months: "", emi_amount: "", start_date: today(),
  category_id: "", payment_method_id: "", notes: "",
};

// ── Shared dropdowns (same pattern as RecurringFormModal) ────────────────────
const CategorySelect = ({ categories, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = categories.find((c) => c.id === value);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 text-sm text-left flex items-center gap-2"
        style={{ ...inputStyle, borderColor: open ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.09)" }}>
        {selected ? (
          <>
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${selected.color}22` }}>
              <span className="material-symbols-rounded" style={{ fontSize: "13px", color: selected.color, fontVariationSettings: "'FILL' 1" }}>{selected.icon}</span>
            </div>
            <span className="truncate" style={{ color: selected.color }}>{selected.name}</span>
          </>
        ) : <span style={{ color: "#4B5768" }}>No category</span>}
        <span className="material-symbols-rounded ml-auto shrink-0" style={{ fontSize: "18px", color: "#7B8FA8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>expand_more</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute left-0 right-0 mt-1.5 z-50 rounded-xl overflow-y-auto"
            style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", maxHeight: "200px" }}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="w-full px-3 py-2.5 text-left text-sm"
              style={{ color: !value ? "#A78BFA" : "#7B8FA8", background: !value ? "rgba(139,92,246,0.1)" : "transparent" }}>No category</button>
            {categories.map((cat) => (
              <button key={cat.id} type="button" onClick={() => { onChange(cat.id); setOpen(false); }}
                className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm"
                style={{ background: value === cat.id ? `${cat.color}18` : "transparent" }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${cat.color}22` }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "13px", color: cat.color, fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                </div>
                <span className="truncate" style={{ color: value === cat.id ? cat.color : "#E2E8F0" }}>{cat.name}</span>
                {value === cat.id && <span className="material-symbols-rounded ml-auto" style={{ fontSize: "14px", color: cat.color }}>check</span>}
              </button>
            ))}
            {categories.length === 0 && (
              <p className="px-4 py-3 text-xs text-text-secondary">
                <Link to="/categories" onClick={() => setOpen(false)} className="underline" style={{ color: "#A78BFA" }}>Create a category</Link>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PaymentMethodSelect = ({ methods, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = methods.find((m) => m.id === value);
  const typeInfo = selected ? PAYMENT_TYPES.find((t) => t.value === selected.type) : null;
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 text-sm text-left flex items-center gap-2"
        style={{ ...inputStyle, borderColor: open ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.09)" }}>
        {selected ? (
          <>
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${typeInfo?.color ?? "#7B8FA8"}22` }}>
              <span className="material-symbols-rounded" style={{ fontSize: "13px", color: typeInfo?.color ?? "#7B8FA8", fontVariationSettings: "'FILL' 1" }}>{typeInfo?.icon ?? "account_balance"}</span>
            </div>
            <span className="truncate text-white">{selected.last4 ? `•••• ${selected.last4}` : selected.name}</span>
          </>
        ) : <span style={{ color: "#4B5768" }}>No payment method</span>}
        <span className="material-symbols-rounded ml-auto shrink-0" style={{ fontSize: "18px", color: "#7B8FA8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>expand_more</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute left-0 right-0 mt-1.5 z-50 rounded-xl overflow-y-auto"
            style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", maxHeight: "200px" }}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="w-full px-3 py-2.5 text-left text-sm"
              style={{ color: !value ? "#A78BFA" : "#7B8FA8", background: !value ? "rgba(139,92,246,0.1)" : "transparent" }}>No method</button>
            {methods.map((m) => {
              const ti = PAYMENT_TYPES.find((t) => t.value === m.type);
              return (
                <button key={m.id} type="button" onClick={() => { onChange(m.id); setOpen(false); }}
                  className="w-full px-3 py-2.5 text-left flex items-center gap-2 text-sm"
                  style={{ background: value === m.id ? `${ti?.color ?? "#7B8FA8"}18` : "transparent" }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: `${ti?.color ?? "#7B8FA8"}22` }}>
                    <span className="material-symbols-rounded" style={{ fontSize: "13px", color: ti?.color ?? "#7B8FA8", fontVariationSettings: "'FILL' 1" }}>{ti?.icon ?? "account_balance"}</span>
                  </div>
                  <span className="truncate" style={{ color: value === m.id ? (ti?.color ?? "#E2E8F0") : "#E2E8F0" }}>{m.last4 ? `•••• ${m.last4}` : m.name}</span>
                  {value === m.id && <span className="material-symbols-rounded ml-auto" style={{ fontSize: "14px", color: ti?.color ?? "#7B8FA8" }}>check</span>}
                </button>
              );
            })}
            {methods.length === 0 && (
              <p className="px-4 py-3 text-xs text-text-secondary">
                <Link to="/payment-methods" onClick={() => setOpen(false)} className="underline" style={{ color: "#A78BFA" }}>Add a method</Link>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main modal ───────────────────────────────────────────────────────────────
const EMIFormModal = ({ open, onClose, initial = null }) => {
  const { data: categories = [] } = useCategories();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const addEmiWithHistory = useAddEmiWithHistory();
  const updateEmi         = useUpdateEmi();
  const [form, setForm]   = useState(DEFAULT_FORM);
  const [paidState, setPaidState] = useState([]); // [{ paid: bool, date: string }]
  const [error, setError] = useState(null);

  const isEditing = !!initial?.id;
  const isSaving  = addEmiWithHistory.isPending || updateEmi.isPending;
  const loanType  = LOAN_TYPES.find((t) => t.value === form.loan_type) ?? LOAN_TYPES[2];
  const accent    = loanType.color;

  const calculatedEMI = useMemo(
    () => calcEMI(form.principal, form.interest_rate, form.tenure_months),
    [form.principal, form.interest_rate, form.tenure_months]
  );

  // Compute installments that are strictly in the past
  const pastInstallments = useMemo(
    () => (!isEditing ? computePastInstallments(form.start_date, parseInt(form.tenure_months) || 0) : []),
    [form.start_date, form.tenure_months, isEditing]
  );

  // Re-init paid state whenever the past-installments list changes
  useEffect(() => {
    if (!isEditing) {
      setPaidState(pastInstallments.map((inst) => ({ paid: true, date: inst.dueDate })));
    }
  }, [pastInstallments.length, form.start_date, isEditing]);

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        title: initial.title || "",
        loan_type: initial.loan_type || "personal",
        principal: String(initial.principal ?? "") || "",
        interest_rate: String(initial.interest_rate ?? "") || "",
        tenure_months: String(initial.tenure_months ?? "") || "",
        emi_amount: String(initial.emi_amount ?? "") || "",
        start_date: initial.start_date || initial.next_due_date || today(),
        category_id: initial.category_id || "",
        payment_method_id: initial.payment_method_id || "",
        notes: initial.notes || "",
      } : { ...DEFAULT_FORM, start_date: today() });
      setError(null);
    }
  }, [open, initial]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Loan name is required"); return; }
    const emiAmt = parseFloat(form.emi_amount);
    if (!form.emi_amount || isNaN(emiAmt) || emiAmt <= 0) { setError("Enter a valid EMI amount"); return; }
    const tenure = parseInt(form.tenure_months);
    if (!form.tenure_months || isNaN(tenure) || tenure <= 0) { setError("Enter a valid tenure in months"); return; }
    if (!form.start_date) { setError("First EMI date is required"); return; }
    setError(null);

    const emiFields = {
      title: form.title.trim(),
      loan_type: form.loan_type,
      principal: parseFloat(form.principal) || 0,
      interest_rate: parseFloat(form.interest_rate) || 0,
      tenure_months: tenure,
      emi_amount: emiAmt,
      start_date: form.start_date,
      category_id: form.category_id || null,
      payment_method_id: form.payment_method_id || null,
      notes: form.notes.trim() || null,
      color: loanType.color,
      is_active: true,
    };

    try {
      if (isEditing) {
        await updateEmi.mutateAsync({ id: initial.id, ...emiFields, next_due_date: initial.next_due_date });
      } else {
        // Build paid installments from checked rows
        const paidInstallments = pastInstallments
          .map((inst, i) => ({ inst, state: paidState[i] }))
          .filter(({ state }) => state?.paid)
          .map(({ inst, state }) => ({ date: state?.date || inst.dueDate }));

        // Compute next_due_date = first unpaid installment date
        const firstUnpaidIdx = pastInstallments.findIndex((_, i) => !paidState[i]?.paid);
        let nextDueDate;
        if (firstUnpaidIdx === -1) {
          // All past months paid → next due is the installment after the last past one
          nextDueDate = pastInstallments.length > 0
            ? advanceMonthLocal(pastInstallments[pastInstallments.length - 1].dueDate)
            : form.start_date;
        } else {
          nextDueDate = pastInstallments[firstUnpaidIdx].dueDate;
        }

        await addEmiWithHistory.mutateAsync({ emiFields, paidInstallments, nextDueDate });
      }
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const paidCount = paidState.filter((s) => s?.paid).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={overlayStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="w-full sm:max-w-md sm:mx-4 rounded-t-3xl sm:rounded-2xl flex flex-col"
            style={cardStyle} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>

            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}20` }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "15px", color: accent, fontVariationSettings: "'FILL' 1" }}>{loanType.icon}</span>
                </div>
                <h2 className="text-sm font-bold text-white">{isEditing ? "Edit Loan" : "Add Loan"}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#7B8FA8" }}>close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* Loan type selector */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Loan Type</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {LOAN_TYPES.map((lt) => (
                      <button key={lt.value} type="button" onClick={() => setForm((f) => ({ ...f, loan_type: lt.value }))}
                        className="flex items-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={form.loan_type === lt.value
                          ? { background: `${lt.color}20`, color: lt.color, border: `1px solid ${lt.color}40` }
                          : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="material-symbols-rounded" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>{lt.icon}</span>
                        {lt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan name */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Loan Name *</label>
                  <input type="text" className="w-full px-3 py-2.5 text-sm" style={inputStyle}
                    placeholder="e.g. HDFC Home Loan, Car EMI…" value={form.title} onChange={set("title")} maxLength={80} />
                </div>

                {/* Principal + Rate */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Principal (₹)</label>
                    <input type="number" min="0" step="1" className="w-full px-3 py-2.5 text-sm" style={inputStyle}
                      placeholder="500000" value={form.principal} onChange={set("principal")} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Rate (% p.a.)</label>
                    <input type="number" min="0" step="0.01" className="w-full px-3 py-2.5 text-sm" style={inputStyle}
                      placeholder="8.5" value={form.interest_rate} onChange={set("interest_rate")} />
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Tenure (months) *</label>
                  <input type="number" min="1" step="1" className="w-full px-3 py-2.5 text-sm" style={inputStyle}
                    placeholder="24" value={form.tenure_months} onChange={set("tenure_months")} />
                </div>

                {/* EMI amount with calculator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text-secondary">Monthly EMI (₹) *</label>
                    {calculatedEMI && (
                      <button type="button" onClick={() => setForm((f) => ({ ...f, emi_amount: calculatedEMI }))}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all active:scale-95"
                        style={{ background: `${accent}18`, color: accent }}>
                        Use ₹{calculatedEMI}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold" style={{ color: accent }}>₹</span>
                    <input type="number" min="0.01" step="0.01" className="w-full pl-8 pr-4 py-2.5 text-sm font-bold"
                      style={inputStyle} placeholder="0.00" value={form.emi_amount} onChange={set("emi_amount")} />
                  </div>
                </div>

                {/* First EMI date */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">First EMI Date *</label>
                  <input type="date" className="w-full px-3 py-2.5 text-sm" style={{ ...inputStyle, colorScheme: "dark" }}
                    value={form.start_date} onChange={set("start_date")} />
                </div>

                {/* ── Backfill: past installments ─────────────────────────────────── */}
                {!isEditing && pastInstallments.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold text-white">
                          {pastInstallments.length} past installment{pastInstallments.length > 1 ? "s" : ""} found
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "#7B8FA8" }}>
                          Mark which months you've already paid
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button type="button"
                          onClick={() => setPaidState(pastInstallments.map((inst) => ({ paid: true, date: inst.dueDate })))}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg"
                          style={{ background: `${accent}18`, color: accent }}>
                          All paid
                        </button>
                        <button type="button"
                          onClick={() => setPaidState(pastInstallments.map((inst) => ({ paid: false, date: inst.dueDate })))}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.06)", color: "#7B8FA8" }}>
                          None
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      {pastInstallments.map((inst, i) => {
                        const state = paidState[i];
                        return (
                          <div key={inst.dueDate} className="flex items-center gap-3 px-3 py-2.5"
                            style={{ borderBottom: i < pastInstallments.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            {/* Toggle */}
                            <button type="button"
                              onClick={() => setPaidState((s) => s.map((x, j) => j === i ? { ...x, paid: !x.paid } : x))}
                              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                              style={state?.paid
                                ? { background: `${accent}22`, border: `1.5px solid ${accent}` }
                                : { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
                              {state?.paid && (
                                <span className="material-symbols-rounded" style={{ fontSize: "12px", color: accent, fontVariationSettings: "'FILL' 1" }}>check</span>
                              )}
                            </button>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white">EMI {inst.index + 1}</p>
                              <p className="text-[10px]" style={{ color: "#7B8FA8" }}>{inst.label} · due {inst.dueDate}</p>
                            </div>

                            {/* Payment date or Unpaid badge */}
                            {state?.paid ? (
                              <input type="date" className="text-xs px-2 py-1 shrink-0"
                                style={{ background: `${accent}12`, border: `1px solid ${accent}30`, borderRadius: "0.5rem", color: accent, outline: "none", colorScheme: "dark", maxWidth: "126px" }}
                                value={state.date} max={today()}
                                onChange={(e) => setPaidState((s) => s.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} />
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}>Unpaid</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between mt-2 px-0.5">
                      <p className="text-[10px] font-semibold" style={{ color: "#7B8FA8" }}>
                        {paidCount} of {pastInstallments.length} paid
                        {pastInstallments.length - paidCount > 0 && (
                          <span style={{ color: "#F87171" }}> · {pastInstallments.length - paidCount} will appear in notifications</span>
                        )}
                      </p>
                      {paidCount > 0 && form.emi_amount && (
                        <p className="text-[10px] font-bold" style={{ color: accent }}>
                          ₹{(paidCount * parseFloat(form.emi_amount)).toLocaleString("en-IN")} total paid
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Category + Payment method */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Category</label>
                  <CategorySelect categories={categories} value={form.category_id} onChange={(id) => setForm((f) => ({ ...f, category_id: id }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Paid via</label>
                  <PaymentMethodSelect methods={paymentMethods} value={form.payment_method_id} onChange={(id) => setForm((f) => ({ ...f, payment_method_id: id }))} />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Notes</label>
                  <textarea className="w-full px-3 py-2.5 text-sm resize-none" style={{ ...inputStyle, minHeight: "60px" }}
                    placeholder="Optional notes…" value={form.notes} onChange={set("notes")} maxLength={200} rows={2} />
                </div>

                {error && <p className="text-xs font-semibold" style={{ color: "#F87171" }}>{error}</p>}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 h-11 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}BB 100%)`, boxShadow: `0 4px 15px ${accent}44` }}>
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 shrink-0 animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                      Saving…
                    </span>
                  ) : isEditing ? "Save Changes" : (
                    pastInstallments.length > 0 && paidCount > 0
                      ? `Add Loan + ${paidCount} transaction${paidCount > 1 ? "s" : ""}`
                      : "Add Loan"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EMIFormModal;
