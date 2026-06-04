import React from "react";

const RecentActivity = ({ activities }) => {
  const formatCurrency = (amount) => `$${amount}`;

  return (
    <div
      className="flex flex-col rounded-2xl p-5 h-fit"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Recent Contributions</h3>
        <button
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "#7B8FA8" }}
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "20px" }}
          >
            more_horiz
          </span>
        </button>
      </div>
      <div className="flex flex-col">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 py-3"
            style={{
              opacity: activity.isOld ? 0.5 : 1,
              borderBottom: idx < activities.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <div
              className="flex items-center justify-center size-9 rounded-xl shrink-0"
              style={{ background: "rgba(139,92,246,0.12)" }}
            >
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "18px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}
              >
                {activity.icon}
              </span>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-white">{activity.goalName}</p>
                <p className="text-sm font-bold" style={{ color: "#34D399" }}>+{formatCurrency(activity.amount)}</p>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-full py-2 text-xs font-semibold text-text-secondary rounded-xl transition-all"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        View All History
      </button>
    </div>
  );
};

export default RecentActivity;
