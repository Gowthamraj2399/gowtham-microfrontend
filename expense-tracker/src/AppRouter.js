import React, { useState, useEffect } from "react";
import { Routes, Route, Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/dashboard";
import EmiPage from "./pages/emi";
import MutualFundsPage from "./pages/mutual-funds";
import GoalsPage from "./pages/goals";
import RecurringPaymentsPage from "./pages/recurring-payments";
import TransactionsPage from "./pages/transactions";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/not-found";

export default ({ history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    // Listen to history changes and update location state
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });

    return unlisten; // Clean up the listener on unmount
  }, [history]);

  return (
    <div>
      <Router
        location={location}
        navigator={history}
        basename="expense-tracker"
      >
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/emi" element={<EmiPage />} />
              <Route path="/mutual-funds" element={<MutualFundsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route
                path="/recurring-payments"
                element={<RecurringPaymentsPage />}
              />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
};
