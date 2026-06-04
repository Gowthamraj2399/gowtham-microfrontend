import React from "react";

const Notifications = ({ notifications, notificationOptions, onToggle }) => {
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
      <h2 className="text-white font-bold text-lg mb-4">Notifications</h2>
      <div className="space-y-1">
        {notificationOptions.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs mt-1" style={{ color: "#7B8FA8" }}>
                {item.description}
              </p>
            </div>
            <button
              onClick={() => onToggle(item.key)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0 ml-4"
              style={{
                background: notifications[item.key]
                  ? "#8B5CF6"
                  : "rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{
                  transform: notifications[item.key]
                    ? "translateX(1.5rem)"
                    : "translateX(0.25rem)",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
