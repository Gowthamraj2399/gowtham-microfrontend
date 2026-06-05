import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import {
  requestNotificationPermission,
  subscribeToPush,
  getNotificationPermission,
} from "../../lib/notifications";

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "1rem",
  padding: "1.5rem",
};
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
  width: "100%",
  padding: "0.625rem 1rem",
  borderRadius: "0.625rem",
  fontSize: "0.875rem",
  outline: "none",
};

function getInitials(nameOrEmail = "") {
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

// ── Toggle component ───────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    className="relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0"
    style={{
      background: checked ? "#8B5CF6" : "rgba(255,255,255,0.12)",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    <span
      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
      style={{ transform: checked ? "translateX(1.5rem)" : "translateX(0.25rem)" }}
    />
  </button>
);

const SettingsPage = () => {
  const { session, signOut } = useAuth();
  const user = session?.user;

  // Profile
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Push notifications
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushMsg, setPushMsg] = useState(null);
  const permission = getNotificationPermission();

  useEffect(() => {
    setPushEnabled(permission === "granted");
  }, [permission]);

  // Sign out
  const [signingOut, setSigningOut] = useState(false);

  // ── Profile save ──────────────────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName.trim() },
    });
    setProfileSaving(false);
    setProfileMsg(error ? { type: "error", text: error.message } : { type: "success", text: "Profile updated!" });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  // ── Push notification toggle ──────────────────────────────────────────────
  const handlePushToggle = async (val) => {
    if (!val) {
      setPushMsg({ type: "info", text: "To disable notifications, revoke permission in your browser settings." });
      setTimeout(() => setPushMsg(null), 4000);
      return;
    }
    if (permission === "denied") {
      setPushMsg({ type: "error", text: "Notifications are blocked. Enable them in your browser site settings." });
      setTimeout(() => setPushMsg(null), 5000);
      return;
    }
    setPushLoading(true);
    setPushMsg(null);
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeToPush(user?.id);
      setPushEnabled(true);
      setPushMsg({ type: "success", text: "Push notifications enabled!" });
    } else {
      setPushMsg({ type: "error", text: "Permission denied. Enable notifications in browser settings." });
    }
    setPushLoading(false);
    setTimeout(() => setPushMsg(null), 4000);
  };

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const nameOrEmail = user?.user_metadata?.full_name || user?.email || "";

  return (
    <div className="max-w-[720px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Account</p>
        <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your profile and app preferences</p>
      </motion.div>

      <div className="flex flex-col gap-5">

        {/* ── Profile ────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} style={cardStyle}>
          <div className="flex items-center gap-4 mb-5">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)" }}
            >
              {getInitials(nameOrEmail)}
            </div>
            <div>
              <p className="text-white font-bold">{nameOrEmail || "—"}</p>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#7B8FA8" }}>Display Name</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#7B8FA8" }}>Email Address</label>
              <input
                type="email"
                style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
                value={user?.email || ""}
                readOnly
              />
            </div>

            {profileMsg && (
              <p className="text-xs font-semibold" style={{ color: profileMsg.type === "success" ? "#22C55E" : "#F87171" }}>
                {profileMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="self-start px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}
            >
              {profileSaving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </motion.div>

        {/* ── Notifications ───────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} style={cardStyle}>
          <h2 className="text-white font-bold text-base mb-4">Notifications</h2>

          <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="text-sm font-medium text-white">Push Notifications</p>
              <p className="text-xs mt-0.5" style={{ color: "#7B8FA8" }}>
                {permission === "denied"
                  ? "Blocked in browser — enable in site settings"
                  : permission === "granted"
                  ? "Receive overdue payment alerts on your device"
                  : "Get alerts for overdue payments and EMIs"}
              </p>
            </div>
            <div className="ml-4 shrink-0">
              {pushLoading ? (
                <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#8B5CF6" }} />
              ) : (
                <Toggle checked={pushEnabled} onChange={handlePushToggle} disabled={permission === "denied"} />
              )}
            </div>
          </div>

          {pushMsg && (
            <p className="text-xs font-semibold mt-3" style={{ color: pushMsg.type === "success" ? "#22C55E" : pushMsg.type === "error" ? "#F87171" : "#A78BFA" }}>
              {pushMsg.text}
            </p>
          )}
        </motion.div>

        {/* ── Account / Sign out ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} style={cardStyle}>
          <h2 className="text-white font-bold text-base mb-4">Account</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Signed in as</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: "#7B8FA8", maxWidth: "220px" }}>{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 shrink-0"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>logout</span>
              {signingOut ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SettingsPage;