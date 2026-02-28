import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authQueryKey, fetchSession, getDisplayName } from "../lib/auth-query";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types";

const isSubmissionsPath = (pathname: string) =>
  pathname === "/submissions" || pathname.startsWith("/project/");

interface SidebarProps {
  role: UserRole;
  /** When "drawer", sidebar is visible (no hidden lg:flex). Used inside SidebarDrawer. */
  variant?: "default" | "drawer";
  /** Called when user navigates (e.g. nav link click). Used to close drawer. */
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, variant = "default", onNavigate }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const { data: session } = useQuery({
    queryKey: authQueryKey,
    queryFn: fetchSession,
  });
  const displayName = getDisplayName(session ?? null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin", { replace: true });
  };
  const navItems =
    role === "creator"
      ? [
          { name: "Galleries", icon: "dashboard", path: "/" },
          { name: "Submissions", icon: "inbox", path: "/submissions" },
        ]
      : [
          { name: "My events", icon: "event_available", path: "/user/events" },
          { name: "My favorites", icon: "favorite", path: "/user/bookmarks" },
        ];

  const isDrawer = variant === "drawer";
  return (
    <aside
      className={`w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col ${isDrawer ? "flex" : "hidden lg:flex"}`}
    >
      <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">photo_camera</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight">Studio Pro</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {role === "creator" ? "Professional Admin" : "Event photos"}
          </p>
          {displayName && (
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300 truncate" title={displayName}>
              {displayName}
            </p>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            isActive={
              role === "creator" && item.path === "/submissions"
                ? (_, loc) => isSubmissionsPath(loc.pathname)
                : undefined
            }
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-primary"
              }`
            }
            onClick={isDrawer ? onNavigate : undefined}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-gray-800">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-gray-400 font-semibold text-sm hover:text-red-500 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
