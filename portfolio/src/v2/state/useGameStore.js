import { create } from "zustand";
import { districts } from "../data/content";

// The seam between "drivers" (Quick view now, 3D camera later) and the HUD.
// Drivers call setActive(); the HUD only reads. Minimap/menu call
// requestJump(); the active driver listens for `jump` and moves there.

let toastId = 0;

export const useGameStore = create((set, get) => ({
  active: districts[0].id,
  visited: [districts[0].id],
  toasts: [],
  menuOpen: false,
  phoneOpen: false,
  jump: null, // { id, nonce }

  setActive: (id) => {
    const { active, visited } = get();
    if (id === active) return;
    if (!visited.includes(id)) {
      const district = districts.find((d) => d.id === id);
      set({ visited: [...visited, id] });
      if (district?.toast) get().pushToast(district.toast);
    }
    set({ active: id });
  },

  requestJump: (id) => set({ jump: { id, nonce: Date.now() }, menuOpen: false, phoneOpen: false }),

  pushToast: (toast) => {
    const id = ++toastId;
    // One at a time: a newer toast replaces the current one (it animates out).
    set({ toasts: [{ ...toast, id }] });
    setTimeout(() => get().dismissToast(id), 3800);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setMenuOpen: (menuOpen) => set({ menuOpen, phoneOpen: false }),
  setPhoneOpen: (phoneOpen) => set({ phoneOpen, menuOpen: false }),
}));
