import React from "react";
import { motion } from "framer-motion";
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
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>
            Loans
          </p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
            EMI Management
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track payments, manage loans, and visualize your debt-free journey.
          </p>
        </motion.div>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 text-sm font-semibold text-text-secondary transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>calendar_month</span>
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-xl h-10 px-4 text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
            Add Loan
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {emiStats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
          >
            <EMIStatsCard stat={stat} />
          </motion.div>
        ))}
      </div>

      {/* Upcoming Payments Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.22 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Upcoming Payments</h2>
          <a className="text-xs font-semibold hover:underline" style={{ color: "#A78BFA" }} href="#">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingPayments.map((payment) => (
            <EMIPaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      </motion.div>

      {/* Active Loans Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <ActiveLoansTable loans={activeLoans} />
      </motion.div>
    </div>
  );
};

export default EmiPage;
