import React, { useState } from "react";

const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "0.75rem",
  color: "#F1F5F9",
  outline: "none",
};

// Normalise both static-config rows and real Supabase rows into one shape
function normalise(tx) {
  const cat = tx.category && typeof tx.category === "object" ? tx.category : null;
  const pm  = tx.payment_method && typeof tx.payment_method === "object" ? tx.payment_method : null;
  const amt = Math.abs(Number(tx.amount));
  // Date: ISO YYYY-MM-DD → friendly string
  const dateStr = tx.date
    ? new Date(tx.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : tx.date;
  return {
    ...tx,
    _amt:       amt,
    _dateStr:   dateStr,
    _catName:   cat?.name  ?? (typeof tx.category === "string" ? tx.category : "Uncategorised"),
    _catColor:  cat?.color ?? "#8B5CF6",
    _catIcon:   cat?.icon  ?? tx.icon ?? "payments",
    _notes:     tx.notes || tx.description || "",
    _pmName:    pm?.name  ?? null,
    _pmColor:   pm?.color ?? "#7B8FA8",
    _pmIcon:    pm?.icon  ?? null,
    _pmLast4:   pm?.last4 ?? null,
    _isPartner: !!tx._isPartner,
  };
}

// ── Mobile transaction card ────────────────────────────────────────────────
const MobileTransactionCard = ({ transaction, onEdit, onDelete, isLast }) => (
  <div
    className="px-3.5 py-2.5 flex items-center gap-2.5"
    style={!isLast ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}}
  >
    {/* Icon */}
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${transaction._catColor}15` }}
    >
      <span
        className="material-symbols-rounded"
        style={{ fontSize: "17px", color: transaction._catColor, fontVariationSettings: "'FILL' 1" }}
      >
        {transaction._catIcon}
      </span>
    </div>

    {/* Center: title + meta row */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold text-white truncate leading-snug">{transaction.title}</p>
        {transaction._isPartner && (
          <span className="text-[9px] font-bold px-1 py-0.5 rounded shrink-0" style={{ background: "rgba(244,114,182,0.15)", color: "#F472B6" }}>Partner</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
        <span className="text-[10px]" style={{ color: "#7B8FA8" }}>{transaction._dateStr}</span>
        {transaction._catName !== "Uncategorised" && (
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: `${transaction._catColor}15`, color: transaction._catColor }}
          >
            {transaction._catName}
          </span>
        )}
        {transaction._pmName && (
          <span className="text-[10px] truncate" style={{ color: transaction._pmColor }}>
            {transaction._pmLast4 ? `•••• ${transaction._pmLast4}` : transaction._pmName}
          </span>
        )}
      </div>
    </div>

    {/* Right: amount + action buttons stacked */}
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <span className="text-sm font-bold" style={{ color: "#F87171" }}>-₹{transaction._amt.toFixed(2)}</span>
      {!transaction._isPartner && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(transaction)}
            className="w-6 h-6 rounded-md flex items-center justify-center active:scale-90 transition-all"
            style={{ background: "rgba(139,92,246,0.12)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "12px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>edit</span>
          </button>
          <button
            onClick={() => onDelete?.(transaction)}
            className="w-6 h-6 rounded-md flex items-center justify-center active:scale-90 transition-all"
            style={{ background: "rgba(239,68,68,0.09)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "12px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>delete</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

const TransactionsTable = ({ transactions, filterOptions, categories = [], selectedCategory = "All", onCategoryChange, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const rows = transactions.map(normalise);

  // Build category pills from real transaction data
  const usedCategories = Array.from(
    new Map(
      rows
        .filter((tx) => tx._catName !== "Uncategorised")
        .map((tx) => [tx._catName, { name: tx._catName, color: tx._catColor }])
    ).values()
  );

  const filteredTransactions = rows.filter((transaction) => {
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction._notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction._catName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      transaction._catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const footerRow = (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-xs text-text-secondary">
        Showing <span className="font-bold text-white">{filteredTransactions.length}</span> results
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <span
            className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2"
            style={{ fontSize: "18px", color: "#7B8FA8" }}
          >
            search
          </span>
          <input
            className="w-full py-2.5 pl-10 pr-4 text-sm placeholder:text-text-secondary"
            style={inputStyle}
            placeholder="Search transactions…"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {usedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange("All")}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={selectedCategory === "All"
                ? { background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "white" }
                : { background: "rgba(255,255,255,0.05)", color: "#7B8FA8", border: "1px solid rgba(255,255,255,0.07)" }
              }
            >
              All
            </button>
            {usedCategories.map(({ name, color }) => (
              <button
                key={name}
                onClick={() => onCategoryChange(name)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={selectedCategory === name
                  ? { background: color, color: "white" }
                  : { background: `${color}18`, color: color, border: `1px solid ${color}30` }
                }
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile card list (hidden on md+) ── */}
      <div className="flex flex-col md:hidden rounded-2xl overflow-hidden" style={glassStyle}>
        {filteredTransactions.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-text-secondary">No transactions found</p>
        ) : (
          filteredTransactions.map((tx, i) => (
            <MobileTransactionCard
              key={tx.id}
              transaction={tx}
              onEdit={onEdit}
              onDelete={onDelete}
              isLast={i === filteredTransactions.length - 1}
            />
          ))
        )}
        {footerRow}
      </div>

      {/* ── Desktop table (hidden below md) ── */}
      <div className="hidden md:block w-full overflow-hidden rounded-2xl" style={glassStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <tr>
                {["Date", "Description", "Category", "Paid Via", "Amount", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: "#7B8FA8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-text-secondary">
                    No transactions found
                  </td>
                </tr>
              ) : filteredTransactions.map((transaction, i) => (
                <tr
                  key={transaction.id}
                  className="group transition-all"
                  style={i < filteredTransactions.length - 1
                    ? { borderBottom: "1px solid rgba(255,255,255,0.05)" }
                    : {}}
                >
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap text-xs">
                    {transaction._dateStr}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${transaction._catColor}18` }}
                      >
                        <span
                          className="material-symbols-rounded"
                          style={{ fontSize: "18px", color: transaction._catColor, fontVariationSettings: "'FILL' 1" }}
                        >
                          {transaction._catIcon}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-white">{transaction.title}</p>
                          {transaction._isPartner && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: "rgba(244,114,182,0.15)", color: "#F472B6" }}>Partner</span>
                          )}
                        </div>
                        {transaction._notes && (
                          <p className="text-xs text-text-secondary">{transaction._notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {transaction._catName !== "Uncategorised" ? (
                      <span
                        className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-bold"
                        style={{ background: `${transaction._catColor}18`, color: transaction._catColor }}
                      >
                        {transaction._catName}
                      </span>
                    ) : (
                      <span className="text-xs text-text-secondary">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {transaction._pmName ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                          style={{ background: `${transaction._pmColor}22` }}
                        >
                          <span
                            className="material-symbols-rounded"
                            style={{ fontSize: "12px", color: transaction._pmColor, fontVariationSettings: "'FILL' 1" }}
                          >
                            {transaction._pmIcon}
                          </span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: transaction._pmColor }}>
                          {transaction._pmLast4 ? `•••• ${transaction._pmLast4}` : transaction._pmName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-text-secondary">—</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3.5 text-sm font-bold text-right whitespace-nowrap"
                    style={{ color: "#F87171" }}
                  >
                    -₹{transaction._amt.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {!transaction._isPartner && (
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => onEdit?.(transaction)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                          style={{ background: "rgba(139,92,246,0.12)" }}
                          title="Edit"
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: "14px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>edit</span>
                        </button>
                        <button
                          onClick={() => onDelete?.(transaction)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                          style={{ background: "rgba(239,68,68,0.12)" }}
                          title="Delete"
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: "14px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footerRow}
      </div>
    </div>
  );
};

export default TransactionsTable;
