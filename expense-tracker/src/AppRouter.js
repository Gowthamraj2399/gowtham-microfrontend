import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Routes, Route, Router, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/dashboard";
import EmiPage from "./pages/emi";
import MutualFundsPage from "./pages/mutual-funds";
import GoalsPage from "./pages/goals";
import RecurringPaymentsPage from "./pages/recurring-payments";
import TransactionsPage from "./pages/transactions";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/not-found";
import { authQueryKey, fetchSession } from "./lib/auth-query";

const queryClient = new QueryClient();

function AuthGuard({ children }) {
  const location = useLocation();
  const pathname = location.pathname || "/";
  const { data: session, isLoading } = useQuery({
    queryKey: authQueryKey,
    queryFn: fetchSession,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex items-center gap-2 text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!session) {
    window.location.href = "/auth/signin?returnTo=expense-tracker";
    return null;
  }

  // Root path: redirect to dashboard
  if (pathname === "/" || pathname === "") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ({ history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });
    return unlisten;
  }, [history]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router location={location} navigator={history} basename="expense-tracker">
        <AuthGuard>
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
        </AuthGuard>
      </Router>
    </QueryClientProvider>
  );
};
