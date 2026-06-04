import React from "react";

const DataManagement = ({ options, onAction }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#A78BFA" }}
      >
        Data Management
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAction && onAction(option.id)}
            className="w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="material-symbols-rounded text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1", color: "#A78BFA" }}
            >
              {option.icon}
            </span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataManagement;
