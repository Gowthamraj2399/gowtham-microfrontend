import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecurringPayments, useMarkRecurringPaid } from "../../lib/recurring-query";
import { useEmis, useMarkEmiPaid } from "../../lib/emi-query";
import { getNotificationPermission, requestNotificationPermission } from "../../lib/notifications";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getDiffDays(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.round((today - due) / 86400000); // positive = overdue
}

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

// ── Pay Confirm Sheet ─────────────────────────────────────────────────────────
const PaySheet = ({ item, onConfirm, onCancel, isPending }) => {
  const [paidDate, setPaidDate] = useState(todayStr());

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
      <motion.div className="w-full sm:max-w-xs sm:mx-4 rounded-t-3xl sm:rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)" }}
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>

        <div className="sm:hidden flex justify-center -mb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Icon + title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${item.color || "#8B5CF6"}20`, border: `1px solid ${item.color || "#8B5CF6"}30` }}>
            <span className="material-symbols-rounded" style={{ fontSize: "20px", color: item.color || "#8B5CF6", fontVariationSettings: "'FILL' 1" }}>
              {item.icon || "check_circle"}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">{item.title}</p>
            <p className="text-xs font-semibold" style={{ color: item.color || "#8B5CF6" }}>{fmtCurrency(item.amount ?? item.emi_amount)}</p>
          </div>
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#7B8FA8" }}>When did you pay?</label>
          <input type="date" className="w-full px-3 py-2.5 text-sm"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "0.75rem", color: "#F1F5F9", outline: "none", colorScheme: "dark" }}
            value={paidDate} onChange={(e) => setPaidDate(e.target.value)} max={todayStr()} />
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(paidDate)} disabled={isPending || !paidDate}
            className="flex-1 h-11 rounded-xl text-sm font-bold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 15px rgba(16,185,129,0.35)" }}>
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 shrink-0 animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                Marking…
              </span>
            ) : "Mark as Paid ✓"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Notification Card ─────────────────────────────────────────────────────────
const NotifCard = ({ item, type, onPay }) => {
  const diffDays = getDiffDays(item.next_due_date);
  const isOverdue = diffDays > 0;
  const isToday   = diffDays === 0;
  const color = item.color || (type === "emi" ? "#3B82F6" : "#8B5CF6");
  const amount = type === "emi" ? item.emi_amount : item.amount;

  const dueDateLabel = new Date(item.next_due_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const statusLabel = isOverdue
    ? `${diffDays}d overdue`
    : isToday ? "Due today" : `Due ${dueDateLabel}`;
  const statusColor = isOverdue ? "#F87171" : isToday ? "#FBBF24" : "#A78BFA";
  const statusBg    = isOverdue ? "rgba(239,68,68,0.1)" : isToday ? "rgba(245,158,11,0.12)" : "rgba(139,92,246,0.12)";

  return (
    <motion.div layout className="rounded-2xl overflow-hidden"
      style={{ background: isOverdue ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.03)", border: `1px solid ${isOverdue ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)"}` }}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }}>

      {/* Alert stripe */}
      {isOverdue && <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #EF4444, transparent)" }} />}

      <div className="px-4 py-3.5 flex items-center gap-3">
        {/* Icon */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <span className="material-symbols-rounded" style={{ fontSize: "19px", color, fontVariationSettings: "'FILL' 1" }}>
              {type === "emi" ? "account_balance" : (item.icon || "repeat")}
            </span>
          </div>
          {isOverdue && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "#EF4444", border: "2px solid #0D1117" }}>
              <span className="material-symbols-rounded" style={{ fontSize: "9px", color: "white", fontVariationSettings: "'FILL' 1" }}>priority_high</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{item.title}{type === "emi" ? " EMI" : ""}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ color: statusColor, background: statusBg }}>{statusLabel}</span>
            {item.category && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                style={{ background: `${item.category.color}18`, color: item.category.color }}>
                {item.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Amount + Pay button */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-sm font-black" style={{ color }}>{fmtCurrency(amount)}</span>
          <button onClick={() => onPay(item, type)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "white", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "12px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Pay
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Permission Banner ─────────────────────────────────────────────────────────
const PermissionBanner = ({ onRequest }) => (
  <motion.div className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-5"
    style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
    <span className="material-symbols-rounded shrink-0" style={{ fontSize: "20px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>notifications</span>
    <div className="flex-1">
      <p className="text-xs font-bold text-white">Enable push notifications</p>
      <p className="text-[10px] font-medium text-text-secondary">Get alerts when bills are due — even when the app is closed.</p>
    </div>
    <button onClick={onRequest}
      className="text-xs font-bold px-3 py-1.5 rounded-xl shrink-0"
      style={{ background: "rgba(139,92,246,0.25)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.35)" }}>
      Enable
    </button>
  </motion.div>
);

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="flex flex-col gap-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
    ))}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const NotificationsPage = () => {
  const { data: recurring = [], isLoading: loadingR } = useRecurringPayments();
  const { data: emis = [],      isLoading: loadingE } = useEmis();
  const markPaid    = useMarkRecurringPaid();
  const markEmiPaid = useMarkEmiPaid();
  const [payTarget, setPayTarget] = useState(null); // { item, type }
  const [permState, setPermState] = useState(getNotificationPermission());
  const isLoading = loadingR || loadingE;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  // Last day of current month
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const endOfMonthStr = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth()+1).padStart(2,"0")}-${String(endOfMonth.getDate()).padStart(2,"0")}`;
  const monthLabel = today.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Overdue or due today
  const overdueRecurring = recurring.filter((r) => r.is_active && r.next_due_date <= todayDateStr);
  const overdueEmis      = emis.filter((e) => e.is_active && e.next_due_date <= todayDateStr);
  // Due later this month (after today, up to month end) — hidden only when paid
  const upcomingRecurring = recurring.filter((r) => r.is_active && r.next_due_date > todayDateStr && r.next_due_date <= endOfMonthStr);
  const upcomingEmis      = emis.filter((e) => e.is_active && e.next_due_date > todayDateStr && e.next_due_date <= endOfMonthStr);

  const allOverdue  = overdueRecurring.length + overdueEmis.length;
  const allUpcoming = upcomingRecurring.length + upcomingEmis.length;

  const handleRequestPermission = async () => {
    await requestNotificationPermission();
    setPermState(getNotificationPermission());
  };

  const handlePay = (item, type) => setPayTarget({ item, type });
  const handlePayConfirm = async (paidDate) => {
    if (!payTarget) return;
    const { item, type } = payTarget;
    if (type === "recurring") {
      await markPaid.mutateAsync({ rp: item, paidDate });
    } else if (type === "emi") {
      await markEmiPaid.mutateAsync({ emi: item, paidDate });
    }
    setPayTarget(null);
  };

  return (
    <div className="max-w-[680px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">

      {/* Header */}
      <header className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Alerts</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">Notifications</h1>
          <p className="text-sm mt-1 text-text-secondary">{monthLabel} payments</p>
        </div>
        {allOverdue > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "14px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>warning</span>
            <span className="text-xs font-black" style={{ color: "#F87171" }}>{allOverdue} overdue</span>
          </div>
        )}
      </header>

      {/* Push permission banner */}
      {permState === "default" && <PermissionBanner onRequest={handleRequestPermission} />}
      {permState === "denied" && (
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-5"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <span className="material-symbols-rounded shrink-0" style={{ fontSize: "18px", color: "#F87171" }}>notifications_off</span>
          <p className="text-xs font-medium text-text-secondary">
            Push notifications are blocked. Enable them in your browser settings.
          </p>
        </div>
      )}

      {isLoading ? (
        <Skeleton />
      ) : allOverdue === 0 && allUpcoming === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#34D399", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <p className="text-base font-bold text-white mb-1">All paid for {monthLabel}!</p>
          <p className="text-sm text-text-secondary">Every recurring payment this month has been marked as paid.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Overdue / Due today */}
          {allOverdue > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>warning</span>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#F87171" }}>
                  Overdue · Due Today ({allOverdue})
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="flex flex-col gap-2.5">
                  {overdueRecurring.map((r) => (
                    <NotifCard key={`r-${r.id}`} item={r} type="recurring" onPay={handlePay} />
                  ))}
                  {overdueEmis.map((e) => (
                    <NotifCard key={`e-${e.id}`} item={e} type="emi" onPay={handlePay} />
                  ))}
                </div>
              </AnimatePresence>
            </section>
          )}

          {/* Upcoming (next 7 days) */}
          {allUpcoming > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#A78BFA" }}>
                  Due This Month ({allUpcoming})
                </span>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="flex flex-col gap-2.5">
                  {upcomingRecurring.map((r) => (
                    <NotifCard key={`r-${r.id}`} item={r} type="recurring" onPay={handlePay} />
                  ))}
                  {upcomingEmis.map((e) => (
                    <NotifCard key={`e-${e.id}`} item={e} type="emi" onPay={handlePay} />
                  ))}
                </div>
              </AnimatePresence>
            </section>
          )}
        </div>
      )}

      {/* Pay sheet */}
      <AnimatePresence>
        {payTarget && (
          <PaySheet
            item={payTarget.item}
            onConfirm={handlePayConfirm}
            onCancel={() => setPayTarget(null)}
            isPending={markPaid.isPending || markEmiPaid.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsPage;
