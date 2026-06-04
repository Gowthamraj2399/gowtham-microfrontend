import React from "react";

const DangerZone = ({ onClearData, onDeleteAccount }) => {
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#F87171" }}
      >
        Danger Zone
      </h3>
      <div className="space-y-3">
        <button
          onClick={onClearData}
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#F87171",
          }}
        >
          Clear All Data
        </button>
        <button
          onClick={onDeleteAccount}
          className="w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all"
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
            boxShadow: "0 4px 15px rgba(239,68,68,0.35)",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DangerZone;
