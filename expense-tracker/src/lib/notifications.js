/**
 * Native Web Push notifications via the browser Notifications API + Service Worker.
 *
 * Background push (works even when app is closed):
 *  - subscribeToPush() registers the browser with the push service and saves
 *    the subscription to Supabase `push_subscriptions` table.
 *  - A Supabase Edge Function (called every 8h by cron-job.org) reads all
 *    subscriptions, checks each user's overdue items, and fires VAPID push.
 *
 * In-app push (fallback while app is open):
 *  - triggerOverdueNotifications() fires local SW notifications once per day
 *    per overdue item, tracked in localStorage.
 */

import { supabase } from "./supabase";

const NOTIF_LOG_KEY = "sp_notif_log"; // { [itemId]: "YYYY-MM-DD" }

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

/** Ask for notification permission. Returns true if granted. */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function getNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
}

/** Read / write the "already notified today" log from localStorage. */
function readLog() {
  try { return JSON.parse(localStorage.getItem(NOTIF_LOG_KEY) || "{}"); }
  catch { return {}; }
}
function writeLog(log) {
  localStorage.setItem(NOTIF_LOG_KEY, JSON.stringify(log));
}

/** Fire a native notification (via SW if available, else plain Notification API). */
async function fireNotification({ id, title, body, icon = "/icons/icon-192x192.png", tag }) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  // Prefer SW showNotification (works in background)
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.showNotification(title, { body, icon, tag, badge: icon, vibrate: [200, 100, 200] });
      return;
    }
  }
  // Fallback: plain Notification
  new Notification(title, { body, icon, tag });
}

/**
 * Check overdue items and fire one native notification per overdue item per day.
 * Call this on app load after data is ready.
 *
 * @param {Array} recurringPayments - from useRecurringPayments()
 * @param {Array} emis              - from useEmis()
 */
export async function triggerOverdueNotifications(recurringPayments = [], emis = []) {
  if (Notification.permission !== "granted") return;

  const today = todayStr();
  const todayDate = new Date(today + "T00:00:00");
  const log = readLog();
  const updated = { ...log };

  // Clean old entries (> 7 days ago) so localStorage doesn't grow
  const cutoff = new Date(todayDate);
  cutoff.setDate(cutoff.getDate() - 7);
  for (const key of Object.keys(updated)) {
    if (updated[key] < cutoff.toISOString().split("T")[0]) delete updated[key];
  }

  // Overdue recurring payments
  for (const rp of recurringPayments) {
    if (!rp.is_active) continue;
    if (rp.next_due_date > today) continue; // not overdue
    const logKey = `rp_${rp.id}`;
    if (updated[logKey] === today) continue; // already notified today

    const dueDate = new Date(rp.next_due_date + "T00:00:00");
    const diffDays = Math.round((todayDate - dueDate) / 86400000);
    const dueLabelParts = diffDays === 0 ? "is due today" : `is ${diffDays} day${diffDays > 1 ? "s" : ""} overdue`;

    await fireNotification({
      id: rp.id,
      title: `💸 ${rp.title} ${dueLabelParts}`,
      body: `₹${Number(rp.amount).toLocaleString("en-IN")} recurring payment. Tap to mark as paid.`,
      tag: `rp-${rp.id}`,
    });
    updated[logKey] = today;
  }

  // Overdue EMIs
  for (const emi of emis) {
    if (!emi.is_active) continue;
    if (emi.next_due_date > today) continue;
    const logKey = `emi_${emi.id}`;
    if (updated[logKey] === today) continue;

    const dueDate = new Date(emi.next_due_date + "T00:00:00");
    const diffDays = Math.round((todayDate - dueDate) / 86400000);
    const dueLabelParts = diffDays === 0 ? "is due today" : `is ${diffDays} day${diffDays > 1 ? "s" : ""} overdue`;

    await fireNotification({
      id: emi.id,
      title: `🏦 ${emi.title} EMI ${dueLabelParts}`,
      body: `₹${Number(emi.emi_amount).toLocaleString("en-IN")}/month. Tap to view.`,
      tag: `emi-${emi.id}`,
    });
    updated[logKey] = today;
  }

  writeLog(updated);
}

// ── Background push subscription ─────────────────────────────────────────────

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * Subscribe the browser to Web Push and persist the subscription to Supabase.
 * Safe to call on every app load — it's idempotent (upsert on endpoint).
 * @param {string} userId  - auth.users id
 */
export async function subscribeToPush(userId) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  const publicKey = process.env.VITE_VAPID_PUBLIC_KEY;
  if (!publicKey) return;

  try {
    const reg = await navigator.serviceWorker.ready;

    // Reuse existing subscription or create a new one
    let pushSub = await reg.pushManager.getSubscription();
    if (!pushSub) {
      pushSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    const json = pushSub.toJSON();
    await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
      { onConflict: "endpoint" }
    );
  } catch (err) {
    // Permission denied or browser doesn't support — fail silently
    console.warn("Push subscription failed:", err.message);
  }
}
