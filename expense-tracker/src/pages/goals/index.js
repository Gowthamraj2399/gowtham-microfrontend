import React from "react";
import { motion } from "framer-motion";
import GoalStatsCard from "../../components/goals/GoalStatsCard";
import GoalCard from "../../components/goals/GoalCard";
import RecentActivity from "../../components/goals/RecentActivity";
import MotivationCard from "../../components/goals/MotivationCard";
import {
  goalStats,
  goals,
  recentActivity,
  motivationData,
} from "../../config/goalsConfig";

const GoalsPage = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Goals</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
            My Financial Goals
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track savings for trips, gadgets, and life events.
          </p>
        </motion.div>
        <button
          className="flex items-center justify-center gap-2 rounded-xl h-10 px-5 text-white text-sm font-bold transition-all active:scale-95 shrink-0"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
          Create New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {goalStats.map((stat, i) => (
          <motion.div key={stat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.07 }}>
            <GoalStatsCard stat={stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Goals & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Goals Column */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Active Goals</h2>
            <button className="text-xs font-semibold" style={{ color: "#A78BFA" }}>View All</button>
          </div>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {/* Sidebar Column: Activity & Motivation */}
        <div className="flex flex-col gap-6">
          <RecentActivity activities={recentActivity} />
          <MotivationCard motivation={motivationData} />
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
