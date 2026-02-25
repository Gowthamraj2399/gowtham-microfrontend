import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarConfig } from "../config/sidebarConfig";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border border-surface-highlight"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmOXAiAvvFr9NvEDhUdcuP2G0qnpoE5DB62CbQXeFFqPgD2TYTErKzyUbqasYkcscWCweHauEtKcBHAYcOza_poOiLOIGSvu_ZzRNmH224lFAtZUhVBTem5Yp8hKJ8_M2v8uRTb9gJawyAiClUTdQ6Sq81ufQdf28Ykq6RAh0M1x7B6dpETNTMpYF3AZFFBVCMls6Pq6xvFJiGimnEZUhKwug6OmhGFgyKQTJCYyrN9lUpOrQ0GQbQtdThecjNewK1toWAal88ilnJ")',
            }}
          ></div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-white">Alex Morgan</p>
            <p className="text-xs text-text-secondary">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
