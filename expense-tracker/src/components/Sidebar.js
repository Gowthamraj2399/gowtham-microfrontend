import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarConfig } from "../config/sidebarConfig";
import { useAuth } from "../lib/AuthContext";
import { usePartner } from "../lib/PartnerContext";

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut } = useAuth();
  const { partnerId, partnerName, showPartner, setShowPartner } = usePartner();

  const activeItem =
    sidebarConfig.menuItems.find((item) => item.path === location.pathname)
      ?.id || "dashboard";

  const handleMenuClick = (itemId) => {
    const item = sidebarConfig.menuItems.find((item) => item.id === itemId);
    if (item) {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  const sidebarContent = (
    <aside
      className="w-64 shrink-0 flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #0D1117 0%, #080B14 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="p-5 pb-2 flex flex-col flex-1 overflow-hidden">
        {/* Logo Section */}
        <div className="flex gap-3 items-center mb-8 mt-1">
          <div
            className="rounded-xl size-10 flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.4)",
            }}
          >
            <span
              className="material-symbols-rounded text-white"
              style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
            >
              {sidebarConfig.logo.icon}
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-bold leading-tight tracking-tight">
              {sidebarConfig.logo.title}
            </h1>
            <p className="text-text-secondary text-xs font-medium leading-normal">
              {sidebarConfig.logo.subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary/60 mb-3 px-3">
          Navigation
        </p>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
          {sidebarConfig.menuItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="relative flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(6,182,212,0.08) 100%)",
                        borderLeft: "3px solid #8B5CF6",
                      }
                    : {}
                }
              >
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                )}
                <span
                  className="material-symbols-rounded relative z-10 transition-all duration-200"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    color: isActive ? "#A78BFA" : "#7B8FA8",
                  }}
                >
                  {item.icon}
                </span>
                <p
                  className="text-sm relative z-10 transition-colors duration-200"
                  style={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#E2D9F3" : "#7B8FA8",
                  }}
                >
                  {item.label}
                </p>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#8B5CF6",
                      boxShadow: "0 0 6px #8B5CF6",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partner toggle (desktop sidebar) */}
      {partnerId && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowPartner((p) => !p)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all active:scale-95"
            style={showPartner
              ? { background: "rgba(244,114,182,0.12)", border: "1.5px solid rgba(244,114,182,0.35)" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px", color: showPartner ? "#F472B6" : "#7B8FA8", fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold" style={{ color: showPartner ? "#F472B6" : "#7B8FA8" }}>
                {showPartner ? "Showing combined" : "Show partner"}
              </p>
              <p className="text-[10px]" style={{ color: "#475569" }}>{partnerName || "Partner"}</p>
            </div>
            <span className="material-symbols-rounded" style={{ fontSize: "14px", color: showPartner ? "#F472B6" : "#475569" }}>
              {showPartner ? "toggle_on" : "toggle_off"}
            </span>
          </button>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="rounded-full w-9 h-9 flex items-center justify-center shrink-0 text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            }}
          >
            {(session?.user?.email?.[0] ?? "A").toUpperCase()}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {session?.user?.email ?? "Account"}
            </p>
            <p className="text-[10px] text-text-secondary">Personal Plan</p>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="text-text-secondary hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">{sidebarContent}</div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              style={{ backdropFilter: "blur(4px)" }}
              onClick={onClose}
            />
            <motion.div
              key="sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
