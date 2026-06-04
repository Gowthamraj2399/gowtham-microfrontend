import React from "react";

const EMIPaymentCard = ({ payment }) => {
  const { name, lender, accountNumber, amount, icon, statusText, statusColor, isPaid } = payment;

  const isOverdue = statusText?.toLowerCase().includes("overdue");
  const isDueSoon = statusText?.toLowerCase().includes("due");

  const badgeStyle = isOverdue
    ? { background: "rgba(239,68,68,0.12)", color: "#F87171" }
    : isDueSoon
    ? { background: "rgba(245,158,11,0.12)", color: "#FBBF24" }
    : { background: "rgba(16,185,129,0.12)", color: "#34D399" };

  return (
    <div
      className="flex items-stretch gap-4 rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="w-16 h-16 shrink-0 rounded-xl flex items-center justify-center self-center"
        style={{ background: "rgba(139,92,246,0.12)" }}
      >
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "28px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white text-base font-bold leading-tight">{name}</h3>
            <p className="text-text-secondary text-xs mt-0.5">{lender} · {accountNumber}</p>
          </div>
          <span
            className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold"
            style={badgeStyle}
          >
            {statusText}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">Amount</p>
            <p className="text-white text-xl font-bold">{amount}</p>
          </div>
          <button
            className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl transition-all active:scale-95"
            style={isPaid
              ? { background: "rgba(255,255,255,0.06)", color: "#7B8FA8", cursor: "not-allowed" }
              : {
                  background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                }
            }
            disabled={isPaid}
          >
            {isPaid ? "Auto-Paid" : "Pay Now"}
            <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>
              {isPaid ? "check" : "arrow_forward"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMIPaymentCard;
