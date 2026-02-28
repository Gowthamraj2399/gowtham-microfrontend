import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Sidebar from "./Sidebar";
import type { UserRole } from "../types";

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  role: UserRole;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  open,
  onClose,
  role,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open) return null;

  const drawer = (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl lg:hidden flex flex-col"
        role="dialog"
        aria-label="Navigation menu"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 overflow-y-auto">
          <Sidebar role={role} variant="drawer" onNavigate={onClose} />
        </div>
      </div>
    </>
  );

  return createPortal(drawer, document.body);
};

export default SidebarDrawer;
