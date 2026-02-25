import React from "react";
import RecurringStatsCard from "../../components/recurring-payments/RecurringStatsCard";
import PaymentsTable from "../../components/recurring-payments/PaymentsTable";
import {
  recurringStats,
  recurringPayments,
  filterOptions,
} from "../../config/recurringPaymentsConfig";

const RecurringPaymentsPage = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 py-6 pb-20">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
              Recurring Payments
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage your subscriptions, bills, and EMIs efficiently.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-6 h-12 text-white text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-600 transition-colors">
            <span className="material-symbols-outlined">add</span>
            <span>Add New Payment</span>
          </button>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recurringStats.map((stat) => (
            <RecurringStatsCard key={stat.id} stat={stat} />
          ))}
        </section>

        {/* Payments Table with Filters */}
        <PaymentsTable
          payments={recurringPayments}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default RecurringPaymentsPage;
