import React from "react";

const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const SpendingByCategory = ({ categories }) => {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const max   = categories.length > 0 ? categories[0].amount : 1; // already sorted descending

  if (!categories.length) {
    return (
      <div className="rounded-2xl p-5 flex flex-col gap-4 items-center justify-center py-12" style={glassStyle}>
        <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#7B8FA8" }}>category</span>
        <p className="text-sm text-text-secondary">No transactions this month</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={glassStyle}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Spending by Category</h3>
          <p className="text-xs text-text-secondary mt-0.5">This month · {fmtINR(total)} total</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => {
          const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
          const barPct = max > 0 ? Math.round((cat.amount / max) * 100) : 0;
          return (
            <div key={cat.id || cat.name} className="flex flex-col gap-1.5">
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                    style={{ background: `${cat.color}18`, color: cat.color }}>{pct}%</span>
                  <span className="text-xs font-bold text-white">{fmtINR(cat.amount)}</span>
                </div>
              </div>
              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${cat.color}, ${cat.color}BB)`,
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
