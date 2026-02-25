import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="max-w-300 w-full mx-auto px-6 py-8 pb-20">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            Welcome to FinanceTracker
          </h1>
          <p className="text-slate-500 dark:text-text-secondary text-sm mt-1">
            Manage your personal finances with ease.
          </p>
          <div className="mt-8">
            <p className="text-lg">
              Active Menu:{" "}
              <span className="font-bold text-primary">{activeMenuItem}</span>
            </p>
            <p className="text-sm text-slate-500 dark:text-text-secondary mt-2">
              Click on different menu items in the sidebar to see the active
              state change.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
