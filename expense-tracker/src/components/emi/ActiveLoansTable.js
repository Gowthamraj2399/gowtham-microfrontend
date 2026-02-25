import React from "react";

const ActiveLoansTable = ({ loans }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold">
          Active Loans
        </h2>
        <div className="flex gap-2">
          <button className="p-2 text-slate-500 hover:text-primary dark:text-[#9dabb9] dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className="p-2 text-slate-500 hover:text-primary dark:text-[#9dabb9] dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">sort</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#283039] bg-white dark:bg-[#111418] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-[#1c2127] text-slate-500 dark:text-[#9dabb9] uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-4">Loan Name</th>
              <th className="px-6 py-4">Lender</th>
              <th className="px-6 py-4">Monthly EMI</th>
              <th className="px-6 py-4">Tenure</th>
              <th className="px-6 py-4 w-1/4">Progress</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#283039]">
            {loans.map((loan) => (
              <tr
                key={loan.id}
                className="group hover:bg-gray-50 dark:hover:bg-[#1c2127] transition-colors"
              >
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {loan.loanName}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-[#9dabb9]">
                  {loan.lender}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {loan.monthlyEMI}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-[#9dabb9]">
                  <span className="text-slate-900 dark:text-white font-bold">
                    {loan.paidMonths}
                  </span>{" "}
                  / {loan.totalMonths} months
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-[#283039] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${loan.progressColor} rounded-full`}
                        style={{ width: `${loan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-[#9dabb9]">
                      {Math.round(loan.progress)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-primary dark:text-[#6e7c8c] dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-2">
        <button className="text-sm text-slate-500 dark:text-[#9dabb9] hover:text-primary font-medium flex items-center gap-1 transition-colors">
          Show Closed Loans
          <span className="material-symbols-outlined text-[16px]">
            expand_more
          </span>
        </button>
      </div>
    </div>
  );
};

export default ActiveLoansTable;
