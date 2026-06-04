import React from "react";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const FREQ_LABEL = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" };

const RecurringItem = (rp) => {
  const color   = rp.color || "#8B5CF6";
  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = rp.next_due_date ? new Date(rp.next_due_date + "T00:00:00") : null;
  const diffDays = dueDate ? Math.round((dueDate - today) / 86400000) : null;
  const isOverdue = diffDays !== null && diffDays < 0;

  const nextLabel = dueDate
    ? dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "--";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18` }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "18px", color, fontVariationSettings: "'FILL' 1" }}
          >
            {rp.icon || "repeat"}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{rp.title}</p>
          <p className="text-xs text-text-secondary">
            {FREQ_LABEL[rp.frequency] || rp.frequency} · {isOverdue ? (
              <span style={{ color: "#F87171" }}>{Math.abs(diffDays)}d overdue</span>
            ) : nextLabel}
          </p>
        </div>
      </div>
      <p className="text-sm font-bold" style={{ color: isOverdue ? "#F87171" : color }}>{fmtINR(rp.amount)}</p>
    </div>
  );
};

export default RecurringItem;
