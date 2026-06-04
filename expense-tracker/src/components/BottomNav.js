import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { sidebarConfig } from "../config/sidebarConfig";
import { useRecurringPayments } from "../lib/recurring-query";
import { useEmis } from "../lib/emi-query";

// Show only top 5 nav items in bottom bar
const BOTTOM_NAV_IDS = ["dashboard", "transactions", "emi", "recurring-payments", "notifications"];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: recurring = [] } = useRecurringPayments();
  const { data: emis = [] }      = useEmis();

  const today = new Date().toISOString().split("T")[0];
  const overdueCount = recurring.filter((r) => r.is_active && r.next_due_date <= today).length
    + emis.filter((e) => e.is_active && e.next_due_date <= today).length;

  const items = sidebarConfig.menuItems.filter((item) =>
    BOTTOM_NAV_IDS.includes(item.id)
  );

  const activeId =
    sidebarConfig.menuItems.find((item) => item.path === location.pathname)?.id || "dashboard";

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-1 md:hidden safe-area-pb">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="relative flex flex-col items-center justify-center flex-1 py-2 gap-0.5 group"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-pill"
                className="absolute inset-0 mx-1 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.08) 100%)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`material-symbols-rounded relative z-10 transition-all duration-200 ${
                isActive
                  ? "text-primary-light filled scale-110"
                  : "text-text-secondary group-hover:text-white"
              }`}
              style={{ fontSize: "22px" }}
            >
              {item.icon}
            </span>
            {item.id === "notifications" && overdueCount > 0 && (
              <span className="absolute top-1.5 right-3.5 z-20 flex items-center justify-center"
                style={{ minWidth: "14px", height: "14px", borderRadius: "7px", background: "#EF4444", border: "2px solid #080B14", fontSize: "8px", fontWeight: 900, color: "white", lineHeight: 1, padding: "0 2px" }}>
                {overdueCount > 9 ? "9+" : overdueCount}
              </span>
            )}
            <span
              className={`text-[9px] font-semibold relative z-10 transition-colors duration-200 leading-tight ${
                isActive ? "text-primary-light" : "text-text-secondary"
              }`}
            >
              {item.label.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
