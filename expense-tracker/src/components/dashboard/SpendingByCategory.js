import React from "react";

const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const SpendingByCategory = ({ categories }) => {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={glassStyle}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Spending by Category</h3>
          <p className="text-xs text-text-secondary mt-0.5">This month · ${total.toLocaleString()} total</p>
        </div>
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: "rgba(139,92,246,0.12)", color: "#A78BFA" }}
        >
          Budget
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const pct = Math.round((cat.amount / cat.budget) * 100);
          const overBudget = cat.amount > cat.budget;
          return (
            <div key={cat.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${cat.color}1A` }}
                  >
                    <span
                      className="material-symbols-rounded"
                      style={{ fontSize: "14px", color: cat.color, fontVariationSettings: "'FILL' 1" }}
                    >
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-white">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">${cat.amount.toLocaleString()}</span>
                  <span className="text-xs text-text-secondary ml-1">/ ${cat.budget}</span>
                  {overBudget && (
                    <span
                      className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}
                    >
                      Over
                    </span>
                  )}
                </div>
              </div>
              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    background: overBudget
                      ? "linear-gradient(90deg, #F87171, #EF4444)"
                      : `linear-gradient(90deg, ${cat.color}, ${cat.color}BB)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingByCategory;
