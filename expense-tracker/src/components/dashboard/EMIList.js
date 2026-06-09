import React from "react";
import EMIItem from "./EMIItem";

const EMIList = ({ emis, total }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="px-4 py-3 flex justify-between items-center"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-bold text-white">Upcoming EMIs</h3>
        <div className="flex items-center gap-3">
          {total && <p className="text-xs text-text-secondary">Total: {total}</p>}
          <button className="text-xs font-semibold" style={{ color: "#A78BFA" }}>
            View All
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        {emis.map((emi) => (
          <EMIItem key={emi.id} {...emi} />
        ))}
      </div>
    </div>
  );
};

export default EMIList;
