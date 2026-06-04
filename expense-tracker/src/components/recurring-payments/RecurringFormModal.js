import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "../../lib/categories-query";
import { usePaymentMethods } from "../../lib/payment-methods-query";
import { useAddRecurringPayment, useUpdateRecurringPayment, computeNextDueDate, computeCurrentDueDate } from "../../lib/recurring-query";
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

export const FREQUENCY_OPTIONS = [
  { value: "monthly", label: "Monthly", icon: "calendar_month" },
  { value: "yearly",  label: "Yearly",  icon: "event_repeat" },
  { value: "weekly",  label: "Weekly",  icon: "calendar_view_week" },
  { value: "daily",   label: "Daily",   icon: "today" },
];

const PRESET_COLORS = [
  "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B",
  "#EF4444", "#EC4899", "#06B6D4", "#F97316",
];

export const RECURRING_ICONS = [
  "repeat", "subscriptions", "home", "wifi", "phone_android",
  "local_gas_station", "medical_services", "school", "fitness_center",
  "restaurant", "electric_bolt", "water_drop",
];

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DEFAULT_FORM = {
  title: "", amount: "", frequency: "monthly",
  due_day: new Date().getDate(), due_month: new Date().getMonth() + 1,
  category_id: "", payment_method_id: "",
  color: "#8B5CF6", icon: "repeat", notes: "",
};

// ── Inline shared dropdowns ──────────────────────────────────────────────────
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
                No categories. <Link to="/categories" onClick={() => setOpen(false)} className="underline" style={{ color: "#A78BFA" }}>Create one</Link>
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
                No methods. <Link to="/payment-methods" onClick={() => setOpen(false)} className="underline" style={{ color: "#A78BFA" }}>Add one</Link>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Day picker chip grid ──────────────────────────────────────────────────────
const DayPicker = ({ value, onChange, accent, maxDay = 31 }) => {
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
      {days.map((d) => (
        <button key={d} type="button" onClick={() => onChange(d)}
          className="rounded-lg py-1.5 text-xs font-bold transition-all active:scale-90"
          style={value === d
            ? { background: `${accent}22`, color: accent, border: `1px solid ${accent}50` }
            : { background: "rgba(255,255,255,0.04)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.06)" }}>
          {d}
        </button>
      ))}
    </div>
  );
};

// ── Main modal ───────────────────────────────────────────────────────────────
const RecurringFormModal = ({ open, onClose, initial = null }) => {
  const { data: categories = [] } = useCategories();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const addRecurring    = useAddRecurringPayment();
  const updateRecurring = useUpdateRecurringPayment();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);

  const isEditing = !!initial?.id;
  const isSaving  = addRecurring.isPending || updateRecurring.isPending;

  // Compute next_due_date preview shown to user
  const nextDuePreview = useMemo(() => {
    if (form.frequency === "weekly" || form.frequency === "daily") return null;
    const dateStr = computeNextDueDate(form.frequency, form.due_day, form.due_month);
    if (!dateStr) return null;
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }, [form.frequency, form.due_day, form.due_month]);

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        title: initial.title || "",
        amount: String(initial.amount) || "",
        frequency: initial.frequency || "monthly",
        due_day: initial.due_day ?? new Date().getDate(),
        due_month: initial.due_month ?? (new Date().getMonth() + 1),
        category_id: initial.category_id || "",
        payment_method_id: initial.payment_method_id || "",
        color: initial.color || "#8B5CF6",
        icon: initial.icon || "repeat",
        notes: initial.notes || "",
      } : { ...DEFAULT_FORM });
      setError(null);
    }
  }, [open, initial]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) { setError("Enter a valid amount"); return; }
    if ((form.frequency === "monthly" || form.frequency === "yearly") && !form.due_day) {
      setError("Select a day"); return;
    }
    setError(null);

    const next_due_date = computeCurrentDueDate({ frequency: form.frequency, due_day: form.due_day || null, due_month: form.due_month || null })
      || `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${String(new Date().getDate()).padStart(2,"0")}`;

    const payload = {
      title: form.title.trim(), amount: amt, frequency: form.frequency,
      due_day: form.due_day || null,
      due_month: form.frequency === "yearly" ? (form.due_month || null) : null,
      next_due_date,
      category_id: form.category_id || null,
      payment_method_id: form.payment_method_id || null,
      color: form.color, icon: form.icon,
      notes: form.notes.trim() || null,
    };
    try {
      if (isEditing) await updateRecurring.mutateAsync({ id: initial.id, ...payload });
      else           await addRecurring.mutateAsync({ ...payload, is_active: true });
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

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
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${form.color}20` }}>
                  <span className="material-symbols-rounded" style={{ fontSize: "15px", color: form.color, fontVariationSettings: "'FILL' 1" }}>{form.icon}</span>
                </div>
                <h2 className="text-sm font-bold text-white">{isEditing ? "Edit Recurring" : "Add Recurring"}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#7B8FA8" }}>close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto" style={{ maxHeight: "80vh" }}>
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* Frequency */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Frequency</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {FREQUENCY_OPTIONS.map((f) => (
                      <button key={f.value} type="button" onClick={() => setForm((s) => ({ ...s, frequency: f.value }))}
                        className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={form.frequency === f.value
                          ? { background: `${form.color}20`, color: form.color, border: `1px solid ${form.color}40` }
                          : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="material-symbols-rounded" style={{ fontSize: "15px", fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day / month picker (context-sensitive) */}
                {form.frequency === "monthly" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-text-secondary">Which day of the month?</label>
                      {form.due_day && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: `${form.color}18`, color: form.color }}>
                          {form.due_day}{["st","nd","rd"][((form.due_day+90)%100-10)%10-1]||"th"} of every month
                        </span>
                      )}
                    </div>
                    <DayPicker value={form.due_day} onChange={(d) => setForm((f) => ({ ...f, due_day: d }))} accent={form.color} />
                    {nextDuePreview && (
                      <p className="mt-2 text-[10px] font-semibold" style={{ color: "#7B8FA8" }}>
                        Next due: <span style={{ color: form.color }}>{nextDuePreview}</span>
                      </p>
                    )}
                  </div>
                )}

                {form.frequency === "yearly" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-2">Month</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {MONTH_NAMES.map((m, i) => (
                          <button key={m} type="button" onClick={() => setForm((f) => ({ ...f, due_month: i + 1 }))}
                            className="py-1.5 rounded-xl text-xs font-semibold transition-all"
                            style={form.due_month === i + 1
                              ? { background: `${form.color}20`, color: form.color, border: `1px solid ${form.color}40` }
                              : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.07)" }}>
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-2">Day</label>
                      <DayPicker value={form.due_day} onChange={(d) => setForm((f) => ({ ...f, due_day: d }))} accent={form.color} maxDay={31} />
                    </div>
                    {nextDuePreview && (
                      <p className="text-[10px] font-semibold" style={{ color: "#7B8FA8" }}>
                        Next due: <span style={{ color: form.color }}>{nextDuePreview}</span>
                      </p>
                    )}
                  </div>
                )}

                {form.frequency === "weekly" && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-2">Day of week</label>
                    <div className="grid grid-cols-7 gap-1">
                      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
                        <button key={d} type="button" onClick={() => setForm((f) => ({ ...f, due_day: i }))}
                          className="py-1.5 rounded-xl text-[10px] font-bold transition-all"
                          style={form.due_day === i
                            ? { background: `${form.color}20`, color: form.color, border: `1px solid ${form.color}40` }
                            : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.07)" }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {form.frequency === "daily" && (
                  <p className="text-xs font-semibold px-3 py-2 rounded-xl" style={{ background: `${form.color}10`, color: form.color }}>
                    Transaction will be created every day.
                  </p>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Title *</label>
                  <input type="text" className="w-full px-3 py-2.5 text-sm" style={inputStyle}
                    placeholder="e.g. Netflix, Rent, Electricity…" value={form.title} onChange={set("title")} maxLength={80} />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold" style={{ color: form.color }}>₹</span>
                    <input type="number" step="0.01" min="0.01" className="w-full pl-8 pr-4 py-2.5 text-sm font-bold"
                      style={inputStyle} placeholder="0.00" value={form.amount} onChange={set("amount")} />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Category</label>
                  <CategorySelect categories={categories} value={form.category_id} onChange={(id) => setForm((f) => ({ ...f, category_id: id }))} />
                </div>

                {/* Payment method */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Paid via</label>
                  <PaymentMethodSelect methods={paymentMethods} value={form.payment_method_id} onChange={(id) => setForm((f) => ({ ...f, payment_method_id: id }))} />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2">Color & Icon</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_COLORS.map((c) => (
                      <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
                        className="w-7 h-7 rounded-full transition-all active:scale-90"
                        style={{ background: c, boxShadow: form.color === c ? `0 0 0 2px #0D1117, 0 0 0 4px ${c}` : "none" }} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {RECURRING_ICONS.map((ic) => (
                      <button key={ic} type="button" onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                        style={form.icon === ic
                          ? { background: `${form.color}20`, border: `1px solid ${form.color}50` }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="material-symbols-rounded" style={{ fontSize: "16px", color: form.icon === ic ? form.color : "#7B8FA8", fontVariationSettings: "'FILL' 1" }}>{ic}</span>
                      </button>
                    ))}
                  </div>
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
                  style={{ background: `linear-gradient(135deg, ${form.color} 0%, ${form.color}BB 100%)`, boxShadow: `0 4px 15px ${form.color}44` }}>
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 shrink-0 animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                      Saving…
                    </span>
                  ) : isEditing ? "Save Changes" : "Add Recurring"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecurringFormModal;
