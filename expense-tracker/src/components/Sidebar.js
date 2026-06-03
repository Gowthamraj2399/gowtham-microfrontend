import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarConfig } from "../config/sidebarConfig";
import { useAuth } from "../lib/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut } = useAuth();

  const activeItem =
    sidebarConfig.menuItems.find((item) => item.path === location.pathname)
      ?.id || "dashboard";

  const handleMenuClick = (itemId) => {
    const item = sidebarConfig.menuItems.find((item) => item.id === itemId);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-background-dark-alt border-r border-surface-highlight">
      <div className="p-6 pb-2 flex flex-col flex-1 overflow-hidden">
        {/* Logo Section */}
        <div className="flex gap-3 items-center mb-8">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 relative overflow-hidden bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">
              {sidebarConfig.logo.icon}
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-bold leading-normal">
              {sidebarConfig.logo.title}
            </h1>
            <p className="text-text-secondary text-xs font-normal leading-normal">
              {sidebarConfig.logo.subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
          {sidebarConfig.menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center cursor-pointer gap-3 px-3 py-2 rounded-lg transition-colors group ${
                activeItem === item.id
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-text-secondary hover:bg-surface-dark-alt2 hover:text-white"
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  activeItem === item.id
                    ? ""
                    : "group-hover:text-primary transition-colors"
                }`}
              >
                {item.icon}
              </span>
              <p
                className={`text-sm leading-normal ${
                  activeItem === item.id ? "font-bold" : "font-medium"
                }`}
              >
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-auto p-6">
        <div className="flex items-center gap-3 px-2 py-3 border-t border-surface-highlight">
          <div className="bg-primary/20 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">person</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {session?.user?.email ?? "Account"}
            </p>
            <p className="text-xs text-text-secondary">Signed in</p>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="text-text-secondary hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
