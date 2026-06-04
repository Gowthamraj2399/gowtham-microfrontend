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
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Bills</p>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
              Recurring Payments
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Manage your subscriptions, bills, and EMIs efficiently.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-xl h-10 px-5 text-white text-sm font-bold transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
            Add New Payment
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
