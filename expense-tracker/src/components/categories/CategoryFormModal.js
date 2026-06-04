import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Curated icon list (Material Symbols names) ─────────────────────────────
export const ICON_OPTIONS = [
  // ─ Food & Dining ──────────────────────────────────
  { name: "restaurant",           label: "Restaurant" },
  { name: "local_cafe",           label: "Café" },
  { name: "fastfood",             label: "Fast Food" },
  { name: "local_grocery_store",  label: "Grocery" },
  { name: "liquor",               label: "Bar" },
  { name: "cake",                 label: "Bakery" },
  { name: "lunch_dining",         label: "Lunch" },
  { name: "local_pizza",          label: "Pizza" },
  { name: "icecream",             label: "Ice Cream" },
  { name: "coffee",               label: "Coffee" },
  { name: "ramen_dining",         label: "Ramen" },
  { name: "outdoor_grill",        label: "BBQ" },
  { name: "sports_bar",           label: "Sports Bar" },
  { name: "local_bar",            label: "Pub" },
  // ─ Transport ──────────────────────────────────────
  { name: "directions_car",       label: "Car" },
  { name: "local_gas_station",    label: "Fuel" },
  { name: "train",                label: "Train" },
  { name: "flight",               label: "Flight" },
  { name: "directions_bus",       label: "Bus" },
  { name: "two_wheeler",          label: "Scooter" },
  { name: "local_taxi",           label: "Taxi" },
  { name: "electric_car",         label: "EV" },
  { name: "directions_boat",      label: "Boat" },
  { name: "pedal_bike",           label: "Bicycle" },
  { name: "motorcycle",           label: "Motorcycle" },
  { name: "subway",               label: "Metro" },
  { name: "airport_shuttle",      label: "Shuttle" },
  { name: "commute",              label: "Commute" },
  // ─ Shopping ───────────────────────────────────────
  { name: "shopping_bag",         label: "Shopping" },
  { name: "storefront",           label: "Store" },
  { name: "checkroom",            label: "Clothing" },
  { name: "diamond",              label: "Luxury" },
  { name: "local_mall",           label: "Mall" },
  { name: "shopping_cart",        label: "Cart" },
  { name: "sell",                 label: "Resale" },
  { name: "redeem",               label: "Gift Card" },
  { name: "watch",                label: "Watch" },
  { name: "style",                label: "Fashion" },
  // ─ Entertainment ──────────────────────────────────
  { name: "movie",                label: "Movies" },
  { name: "sports_esports",       label: "Gaming" },
  { name: "music_note",           label: "Music" },
  { name: "event",                label: "Events" },
  { name: "sports_soccer",        label: "Football" },
  { name: "sports_basketball",    label: "Basketball" },
  { name: "sports_tennis",        label: "Tennis" },
  { name: "sports_cricket",       label: "Cricket" },
  { name: "theater_comedy",       label: "Theatre" },
  { name: "palette",              label: "Art" },
  { name: "headphones",           label: "Audio" },
  { name: "live_tv",              label: "Streaming" },
  { name: "casino",               label: "Casino" },
  { name: "hiking",               label: "Hiking" },
  { name: "pool",                 label: "Swimming" },
  { name: "beach_access",         label: "Beach" },
  { name: "videogame_asset",      label: "Console" },
  { name: "piano",                label: "Piano" },
  // ─ Travel ─────────────────────────────────────────
  { name: "travel_explore",       label: "Travel" },
  { name: "luggage",              label: "Luggage" },
  { name: "hotel",                label: "Hotel" },
  { name: "map",                  label: "Maps" },
  { name: "explore",              label: "Explore" },
  // ─ Home & Utilities ───────────────────────────────
  { name: "bolt",                 label: "Electricity" },
  { name: "water_drop",           label: "Water" },
  { name: "wifi",                 label: "Internet" },
  { name: "home",                 label: "Rent/Home" },
  { name: "local_laundry_service",label: "Laundry" },
  { name: "cleaning_services",    label: "Cleaning" },
  { name: "handyman",             label: "Repairs" },
  { name: "bed",                  label: "Furniture" },
  { name: "tv",                   label: "TV/Cable" },
  { name: "ac_unit",              label: "AC" },
  { name: "garage",               label: "Garage" },
  { name: "yard",                 label: "Garden" },
  { name: "plumbing",             label: "Plumbing" },
  // ─ Health & Wellness ──────────────────────────────
  { name: "health_and_safety",    label: "Health" },
  { name: "local_pharmacy",       label: "Pharmacy" },
  { name: "fitness_center",       label: "Gym" },
  { name: "spa",                  label: "Spa" },
  { name: "medication",           label: "Medicine" },
  { name: "self_improvement",     label: "Meditation" },
  { name: "psychology",           label: "Therapy" },
  { name: "monitor_heart",        label: "Heart Rate" },
  { name: "local_hospital",       label: "Hospital" },
  { name: "vaccines",             label: "Vaccines" },
  // ─ Finance ────────────────────────────────────────
  { name: "credit_card",          label: "Finance" },
  { name: "savings",              label: "Savings" },
  { name: "account_balance",      label: "Banking" },
  { name: "payments",             label: "Payments" },
  { name: "receipt_long",         label: "Bills" },
  { name: "currency_exchange",    label: "Exchange" },
  { name: "trending_up",          label: "Investments" },
  { name: "calculate",            label: "Tax" },
  { name: "wallet",               label: "Wallet" },
  // ─ Education & Work ───────────────────────────────
  { name: "school",               label: "Education" },
  { name: "work",                 label: "Work" },
  { name: "laptop",               label: "Tech" },
  { name: "library_books",        label: "Books" },
  { name: "science",              label: "Science" },
  { name: "engineering",          label: "Engineering" },
  { name: "business_center",      label: "Business" },
  { name: "badge",                label: "Badge" },
  { name: "groups",               label: "Team" },
  { name: "edit_note",            label: "Notes" },
  // ─ Personal & Social ──────────────────────────────
  { name: "pets",                 label: "Pets" },
  { name: "volunteer_activism",   label: "Charity" },
  { name: "photo_camera",         label: "Photography" },
  { name: "phone_android",        label: "Phone" },
  { name: "celebration",          label: "Party" },
  { name: "card_giftcard",        label: "Gifts" },
  { name: "child_care",           label: "Kids" },
  { name: "family_restroom",      label: "Family" },
  { name: "subscriptions",        label: "Subscriptions" },
  { name: "category",             label: "Other" },
];

// ── Color palette ──────────────────────────────────────────────────────────
export const COLOR_OPTIONS = [
  "#8B5CF6", "#6366F1", "#3B82F6", "#06B6D4",
  "#10B981", "#22C55E", "#84CC16", "#EAB308",
  "#F59E0B", "#F97316", "#EF4444", "#EC4899",
  "#A855F7", "#D946EF", "#64748B", "#94A3B8",
];

const DEFAULT_FORM = {
  name: "",
  description: "",
  color: "#8B5CF6",
  icon: "category",
};

const overlayStyle = {
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(6px)",
};
const cardStyle = {
  background: "#0D1117",
  border: "1px solid rgba(255,255,255,0.1)",
};
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "0.75rem",
  color: "#F1F5F9",
  outline: "none",
};

const CategoryFormModal = ({ open, initial = null, onSave, onClose, loading }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [iconSearch, setIconSearch] = useState("");
  const [error, setError] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (open) {
      setForm(initial ? { ...DEFAULT_FORM, ...initial } : DEFAULT_FORM);
      setIconSearch("");
      setError(null);
    }
  }, [open, initial]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const filteredIcons = iconSearch.trim()
    ? ICON_OPTIONS.filter(
        (ic) =>
          ic.name.includes(iconSearch.toLowerCase()) ||
          ic.label.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : ICON_OPTIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    setError(null);
    await onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl flex flex-col"
            style={{ ...cardStyle, maxHeight: "92dvh" }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                {/* Live preview */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${form.color}22` }}
                >
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "18px", color: form.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {form.icon}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white">
                  {initial ? "Edit Category" : "New Category"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#7B8FA8" }}>close</span>
              </button>
            </div>

            {/* Body — scrollable */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto flex-1">
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Name *</label>
                  <input
                    className="w-full px-3 py-2.5 text-sm"
                    style={inputStyle}
                    placeholder="e.g. Food & Dining"
                    value={form.name}
                    onChange={set("name")}
                    maxLength={40}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Description</label>
                  <input
                    className="w-full px-3 py-2.5 text-sm"
                    style={inputStyle}
                    placeholder="Optional short description"
                    value={form.description}
                    onChange={set("description")}
                    maxLength={80}
                  />
                </div>

                {/* Color picker */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, color: c }))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: c,
                          outline: form.color === c ? `2px solid white` : "none",
                          outlineOffset: "2px",
                          transform: form.color === c ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        {form.color === c && (
                          <span className="material-symbols-rounded text-white" style={{ fontSize: "14px" }}>check</span>
                        )}
                      </button>
                    ))}
                    {/* Custom color picker */}
                    <div className="relative w-7 h-7 shrink-0" title="Pick custom color">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-lg"
                      />
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center pointer-events-none"
                        style={{
                          background: !COLOR_OPTIONS.includes(form.color)
                            ? form.color
                            : "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                          outline: !COLOR_OPTIONS.includes(form.color) ? `2px solid white` : "none",
                          outlineOffset: "2px",
                          transform: !COLOR_OPTIONS.includes(form.color) ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        {!COLOR_OPTIONS.includes(form.color) ? (
                          <span className="material-symbols-rounded text-white" style={{ fontSize: "14px", textShadow: "0 0 3px rgba(0,0,0,0.6)" }}>check</span>
                        ) : (
                          <span className="material-symbols-rounded text-white" style={{ fontSize: "13px", textShadow: "0 0 4px rgba(0,0,0,0.9)" }}>colorize</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Icon picker */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">Icon</label>
                  {/* Search */}
                  <div className="relative mb-2">
                    <span
                      className="material-symbols-rounded absolute left-2.5 top-1/2 -translate-y-1/2"
                      style={{ fontSize: "15px", color: "#7B8FA8" }}
                    >
                      search
                    </span>
                    <input
                      className="w-full pl-8 pr-3 py-2 text-xs"
                      style={inputStyle}
                      placeholder="Search icons…"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                    />
                  </div>
                  {/* Grid */}
                  <div
                    className="grid gap-1.5 overflow-y-auto rounded-xl p-2"
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
                      maxHeight: "190px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {filteredIcons.map((ic) => {
                      const active = form.icon === ic.name;
                      return (
                        <button
                          key={ic.name}
                          type="button"
                          title={ic.label}
                          onClick={() => setForm((f) => ({ ...f, icon: ic.name }))}
                          className="flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition-all"
                          style={{
                            background: active ? `${form.color}22` : "transparent",
                            border: active ? `1px solid ${form.color}55` : "1px solid transparent",
                          }}
                        >
                          <span
                            className="material-symbols-rounded"
                            style={{
                              fontSize: "20px",
                              color: active ? form.color : "#7B8FA8",
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            {ic.name}
                          </span>
                          <span
                            className="text-[9px] leading-tight text-center truncate w-full px-0.5"
                            style={{ color: active ? form.color : "#475569" }}
                          >
                            {ic.label}
                          </span>
                        </button>
                      );
                    })}
                    {filteredIcons.length === 0 && (
                      <p className="col-span-full text-center text-xs text-text-secondary py-4">No icons match</p>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-semibold" style={{ color: "#F87171" }}>{error}</p>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-4 flex gap-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${form.color} 0%, ${form.color}BB 100%)`,
                    boxShadow: `0 4px 15px ${form.color}44`,
                  }}
                >
                  {loading ? "Saving…" : initial ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryFormModal;
