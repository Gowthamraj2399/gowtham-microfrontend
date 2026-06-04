import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Router, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import DashboardPage from "./pages/dashboard";
import EmiPage from "./pages/emi";
import RecurringPaymentsPage from "./pages/recurring-payments";
import TransactionsPage from "./pages/transactions";
import CategoriesPage from "./pages/categories";
import PaymentMethodsPage from "./pages/payment-methods";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/not-found";
import AuthPage from "./pages/auth";
import NotificationsPage from "./pages/notifications";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { useAutoCreateRecurring, useRecurringPayments } from "./lib/recurring-query";
import { useAutoCreateEmiPayments, useEmis } from "./lib/emi-query";
import { triggerOverdueNotifications, requestNotificationPermission } from "./lib/notifications";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] };

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="min-h-full"
      >
        <Routes location={location}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/emi" element={<EmiPage />} />
          <Route path="/recurring-payments" element={<RecurringPaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const MobileHeader = ({ onMenuOpen }) => {
  const location = useLocation();
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/categories": "Categories",
    "/payment-methods": "Accounts & Cards",
    "/emi": "EMI Management",
    "/recurring-payments": "Recurring",
    "/notifications": "Notifications",
    "/settings": "Settings",
  };
  const title = pageTitles[location.pathname] || "SpendTracker";

  return (
    <header
      className="flex md:hidden items-center justify-between px-4 py-3 shrink-0"
      style={{
        background: "rgba(8,11,20,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="material-symbols-rounded text-white" style={{ fontSize: "20px" }}>
          menu
        </span>
      </button>
      <div className="flex items-center gap-2">
        <div
          className="rounded-lg w-7 h-7 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)" }}
        >
          <span className="material-symbols-rounded text-white" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
        </div>
        <span className="text-white font-bold text-sm">{title}</span>
      </div>
      <button
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="material-symbols-rounded text-text-secondary" style={{ fontSize: "20px" }}>
          notifications
        </span>
      </button>
    </header>
  );
};

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center" style={{ background: "#080B14" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              boxShadow: "0 8px 25px rgba(139,92,246,0.4)",
            }}
          >
            <span
              className="material-symbols-rounded text-white animate-spin"
              style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}
            >
              progress_activity
            </span>
          </div>
          <p className="text-text-secondary text-sm font-medium">Loading your finances…</p>
        </div>
      </div>
    );
  }
  return session ? children : <Navigate to="/auth/login" replace />;
};

function useOverdueNotificationTrigger() {
  const { data: recurring = [] } = useRecurringPayments();
  const { data: emis = [] }      = useEmis();
  const hasRun = React.useRef(false);
  useEffect(() => {
    if (hasRun.current || (!recurring.length && !emis.length)) return;
    hasRun.current = true;
    // Request permission silently on first overdue item, then fire
    const today = new Date().toISOString().split("T")[0];
    const hasOverdue = recurring.some((r) => r.is_active && r.next_due_date <= today)
      || emis.some((e) => e.is_active && e.next_due_date <= today);
    if (!hasOverdue) return;
    requestNotificationPermission().then((granted) => {
      if (granted) triggerOverdueNotifications(recurring, emis);
    });
  }, [recurring, emis]);
}

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAutoCreateRecurring();
  useAutoCreateEmiPayments();
  useOverdueNotificationTrigger();

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#080B14" }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatedRoutes />
        </main>
        <BottomNav />
      </div>
    </div>
  );
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
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
};
