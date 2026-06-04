import React from "react";

const EMIItem = ({ title, bank, amount, dueDate, status }) => {
  const [month, day] = dueDate.split(" ");

  return (
    <div
      className="flex items-center justify-between px-4 py-3 transition-all last:border-b-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex flex-col items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{
            background: status === "due-soon"
              ? "rgba(245,158,11,0.12)"
              : "rgba(255,255,255,0.06)",
            color: status === "due-soon" ? "#FBBF24" : "#7B8FA8",
          }}
        >
          <span className="text-[9px] font-bold uppercase">{month}</span>
          <span className="text-sm font-bold leading-tight">{day}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-text-secondary">{bank}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white">{amount}</p>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold"
          style={{
            background: status === "due-soon" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.06)",
            color: status === "due-soon" ? "#FBBF24" : "#7B8FA8",
          }}
        >
          {status === "due-soon" ? "Due Soon" : "Upcoming"}
        </span>
      </div>
    </div>
  );
};

export default EMIItem;
