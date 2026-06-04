import React from "react";
import GoalItem from "./GoalItem";

const GoalsList = ({ goals }) => {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white">Savings Goals</h3>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ background: "rgba(139,92,246,0.15)", color: "#A78BFA" }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
        </button>
      </div>
      {goals.map((goal) => (
        <GoalItem key={goal.id} {...goal} />
      ))}
    </div>
  );
};

export default GoalsList;
