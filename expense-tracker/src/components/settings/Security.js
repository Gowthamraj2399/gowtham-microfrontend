import React from "react";

const Security = ({ securityOptions, onSecurityAction }) => {
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
      <h2 className="text-white font-bold text-lg mb-4">Security</h2>
      <div className="space-y-3">
        {securityOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSecurityAction && onSecurityAction(option.id)}
            className="w-full text-left px-4 py-3 rounded-lg transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{option.title}</p>
                <p className="text-xs mt-1" style={{ color: "#7B8FA8" }}>
                  {option.description}
                </p>
              </div>
              <span
                className="material-symbols-rounded"
                style={{ color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
              >
                {option.icon}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Security;
