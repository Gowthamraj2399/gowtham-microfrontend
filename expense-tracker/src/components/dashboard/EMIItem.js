import React from "react";
import { LOAN_TYPES } from "../emi/EMIFormModal";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const EMIItem = (emi) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = emi.next_due_date
    ? new Date(emi.next_due_date + "T00:00:00")
    : null;

  const monthLabel = dueDate
    ? dueDate.toLocaleDateString("en-IN", { month: "short" })
    : "--";
  const dayLabel = dueDate ? dueDate.getDate() : "--";
  const diffDays = dueDate ? Math.round((dueDate - today) / 86400000) : null;
  const isOverdue  = diffDays !== null && diffDays < 0;
  const isDueSoon  = diffDays !== null && diffDays >= 0 && diffDays <= 3;

  const loanType = LOAN_TYPES.find((t) => t.value === emi.loan_type) ?? LOAN_TYPES[2];
  const accentColor = isOverdue ? "#F87171" : isDueSoon ? "#FBBF24" : "#7B8FA8";
  const accentBg    = isOverdue ? "rgba(239,68,68,0.1)" : isDueSoon ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.06)";

  const statusLabel = isOverdue
    ? `${Math.abs(diffDays)}d overdue`
    : isDueSoon
    ? diffDays === 0 ? "Due today" : `Due in ${diffDays}d`
    : "Upcoming";

  const remaining = emi.tenure_months - (emi.paid_count || 0);

  return (
    <div
      className="flex items-center justify-between px-4 py-3 transition-all last:border-b-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex flex-col items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ background: accentBg, color: accentColor }}
        >
          <span className="text-[9px] font-bold uppercase">{monthLabel}</span>
          <span className="text-sm font-bold leading-tight">{dayLabel}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{emi.title}</p>
          <p className="text-xs text-text-secondary">{loanType.label} · {remaining} EMI{remaining !== 1 ? "s" : ""} left</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white">{fmtINR(emi.emi_amount)}</p>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold"
          style={{ background: accentBg, color: accentColor }}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
};

export default EMIItem;
