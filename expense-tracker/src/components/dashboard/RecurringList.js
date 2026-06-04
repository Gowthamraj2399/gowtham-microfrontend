import React from "react";
import RecurringItem from "./RecurringItem";

const RecurringList = ({ title, total, items }) => {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-text-secondary">Total: {total}</p>
      </div>
      {items.map((item) => (
        <RecurringItem key={item.id} {...item} />
      ))}
    </div>
  );
};

export default RecurringList;
