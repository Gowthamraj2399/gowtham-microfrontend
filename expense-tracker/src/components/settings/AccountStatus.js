import React from "react";

const AccountStatus = ({ status }) => {
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
        Account Status
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: "#7B8FA8" }}>Member Since</span>
          <span className="text-sm font-medium text-white">{status.memberSince}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: "#7B8FA8" }}>Account Type</span>
          <span className="text-sm font-medium" style={{ color: "#A78BFA" }}>
            {status.accountType}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: "#7B8FA8" }}>Storage Used</span>
          <span className="text-sm font-medium text-white">
            {status.storageUsed} / {status.storageTotal}
          </span>
        </div>
      </div>
      <div
        className="mt-4 h-2 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${status.storagePercentage}%`,
            background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default AccountStatus;
