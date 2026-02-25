import React from "react";
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
    <div className="max-w-[1200px] w-full mx-auto px-4 py-6 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            My Financial Goals
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track your savings for trips, gadgets, and life events. Visualize
            your progress and reach your targets faster.
          </p>
        </div>
        <button className="flex min-w-21 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="truncate">Create New Goal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {goalStats.map((stat) => (
          <GoalStatsCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Main Grid: Goals & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Goals Column */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Active Goals</h2>
            <button className="text-sm text-primary font-medium hover:text-white transition-colors">
              View All
            </button>
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
