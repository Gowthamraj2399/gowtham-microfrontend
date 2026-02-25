import React from "react";
import TransactionStatsCard from "../../components/transactions/TransactionStatsCard";
import TransactionsTable from "../../components/transactions/TransactionsTable";
import {
  transactionStats,
  transactions,
  filterOptions,
} from "../../config/transactionsConfig";

const TransactionsPage = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 py-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            Transactions History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            View and manage your financial records across all accounts.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold h-10 px-6 rounded-lg transition-all shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Transaction
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {transactionStats.map((stat) => (
          <TransactionStatsCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default TransactionsPage;
