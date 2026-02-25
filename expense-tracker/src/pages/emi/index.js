import React from "react";
import EMIStatsCard from "../../components/emi/EMIStatsCard";
import EMIPaymentCard from "../../components/emi/EMIPaymentCard";
import ActiveLoansTable from "../../components/emi/ActiveLoansTable";
import {
  emiStats,
  upcomingPayments,
  activeLoans,
} from "../../config/emiConfig";

const EmiPage = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 py-6 pb-20">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            EMI Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track payments, manage loans, and visualize your debt-free journey.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-surface-highlight border border-gray-200 dark:border-transparent text-slate-700 dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-surface-highlight transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              calendar_month
            </span>
            <span className="truncate">Calendar View</span>
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="truncate">Add Loan</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {emiStats.map((stat) => (
          <EMIStatsCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Upcoming Payments Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold">
            Upcoming Payments
          </h2>
          <a
            className="text-primary text-sm font-bold hover:underline"
            href="#"
          >
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingPayments.map((payment) => (
            <EMIPaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      </div>

      {/* Active Loans Table */}
      <ActiveLoansTable loans={activeLoans} />
    </div>
  );
};

export default EmiPage;
