import React from "react";

const ActiveLoansTable = ({ loans }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">Active Loans</h2>
        <div className="flex gap-1">
          <button
            className="p-2 rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#7B8FA8" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>filter_list</span>
          </button>
          <button
            className="p-2 rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#7B8FA8" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>sort</span>
          </button>
        </div>
      </div>
      <div
        className="overflow-x-auto rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <table className="w-full text-left text-sm min-w-[640px]">
          <thead style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <tr>
              {["Loan Name", "Lender", "Monthly EMI", "Tenure", "Progress", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#7B8FA8" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, i) => (
              <tr
                key={loan.id}
                className="group transition-all"
                style={i < loans.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : {}}
              >
                <td className="px-5 py-4 font-bold text-white">{loan.loanName}</td>
                <td className="px-5 py-4 text-text-secondary">{loan.lender}</td>
                <td className="px-5 py-4 font-bold text-white">{loan.monthlyEMI}</td>
                <td className="px-5 py-4 text-text-secondary">
                  <span className="text-white font-bold">{loan.paidMonths}</span> / {loan.totalMonths} mo
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)", minWidth: 80 }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${loan.progress}%`,
                          background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-text-secondary w-8 shrink-0">
                      {Math.round(loan.progress)}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button
                    className="transition-all hover:scale-110"
                    style={{ color: "#7B8FA8" }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: "20px" }}>chevron_right</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          className="text-xs font-semibold flex items-center gap-1 transition-colors"
          style={{ color: "#7B8FA8" }}
        >
          Show Closed Loans
          <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>expand_more</span>
        </button>
      </div>
    </div>
  );
};

export default ActiveLoansTable;
