import React from "react";

const EMIPaymentCard = ({ payment }) => {
  const {
    name,
    lender,
    accountNumber,
    amount,
    icon,
    status,
    statusText,
    statusColor,
    isPaid,
  } = payment;

  return (
    <div className="flex items-stretch gap-4 rounded-xl bg-white dark:bg-[#1c2127] p-4 shadow-sm border border-gray-100 dark:border-[#283039]">
      <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-100 dark:bg-[#283039] flex items-center justify-center overflow-hidden">
        <span className="material-symbols-outlined text-slate-400 text-4xl">
          {icon}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
              {name}
            </h3>
            <p className="text-slate-500 dark:text-[#9dabb9] text-sm mt-1">
              {lender} • {accountNumber}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            {statusText}
          </span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-slate-400 dark:text-[#6e7c8c] text-xs uppercase font-bold">
              Amount
            </p>
            <p className="text-slate-900 dark:text-white text-xl font-bold">
              {amount}
            </p>
          </div>
          <button
            className={`flex items-center gap-1 text-xs font-bold py-2 px-4 rounded-lg transition-colors ${
              isPaid
                ? "bg-gray-100 dark:bg-[#283039] text-slate-500 dark:text-[#9dabb9] cursor-not-allowed opacity-70"
                : "bg-primary hover:bg-blue-600 text-white"
            }`}
            disabled={isPaid}
          >
            {isPaid ? "Auto-Paid" : "Pay Now"}
            <span className="material-symbols-outlined text-[16px]">
              {isPaid ? "check" : "arrow_forward"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMIPaymentCard;
