import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Router, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/dashboard";
import EmiPage from "./pages/emi";
import MutualFundsPage from "./pages/mutual-funds";
import GoalsPage from "./pages/goals";
import RecurringPaymentsPage from "./pages/recurring-payments";
import TransactionsPage from "./pages/transactions";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/not-found";
import AuthPage from "./pages/auth";
import { AuthProvider, useAuth } from "./lib/AuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-dark">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }
  return session ? children : <Navigate to="/auth/login" replace />;
};

export default ({ history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });
    return unlisten;
  }, [history]);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router location={location} navigator={history} basename="expense-tracker">
          <Routes>
            <Route path="/auth/login" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
};
