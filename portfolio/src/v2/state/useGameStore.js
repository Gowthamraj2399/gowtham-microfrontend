import { create } from "zustand";
import { districts } from "../data/content";

// The seam between "drivers" (Quick view or 3D camera) and the HUD.
// Drivers call setActive(); the HUD only reads. Minimap/menu call
// requestJump(); the active driver listens for `jump` and moves there.

let toastId = 0;

export const useGameStore = create((set, get) => ({
  mode: null, // "world" | "quick", chosen on mount by pickMode()
  active: districts[0].id,
  visited: [districts[0].id],
  toasts: [],
  menuOpen: false,
  phoneOpen: false,
  sheet: null, // district id whose details are open (3D world)
  jump: null, // { id, nonce }
  roam: false, // free-roam driving (3D world only)
  car: null, // { mx, my, heading } in map space, for the minimap while roaming
  started: false, // 3D world: past the title screen (scrolled, pressed start or drive)

  start: () => set({ started: true }),

  // Coming into the 3D city from the Quick view part-way down: skip the title.
  setMode: (mode) =>
    set((s) => ({
      mode,
      menuOpen: false,
      sheet: null,
      roam: false,
      car: null,
      started: s.started || s.active !== districts[0].id,
    })),
  setRoam: (roam) =>
    set((s) => ({ roam, car: null, menuOpen: false, phoneOpen: false, sheet: null, started: s.started || roam })),
  setCar: (car) => set({ car }),

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

  requestJump: (id) =>
    set({ jump: { id, nonce: Date.now() }, menuOpen: false, phoneOpen: false, sheet: null, started: true }),

  pushToast: (toast) => {
    const id = ++toastId;
    // One at a time: a newer toast replaces the current one (it animates out).
    set({ toasts: [{ ...toast, id }] });
    setTimeout(() => get().dismissToast(id), 3800);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setMenuOpen: (menuOpen) => set({ menuOpen, phoneOpen: false }),
  setPhoneOpen: (phoneOpen) => set({ phoneOpen, menuOpen: false, sheet: null }),
  openSheet: (sheet) => set({ sheet, menuOpen: false, phoneOpen: false }),
  closeSheet: () => set({ sheet: null }),
}));
