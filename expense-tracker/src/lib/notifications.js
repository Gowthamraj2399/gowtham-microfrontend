/**
 * Native Web Push notifications via the browser Notifications API + Service Worker.
 * No external service needed — entirely free, works offline as a PWA.
 *
 * How it works:
 *  1. On first open we request Notification permission.
 *  2. On every app load we check overdue recurring + EMI items.
 *  3. We fire a native notification for each unpaid overdue item ONCE per day
 *     (tracked in localStorage so we don't spam).
 *  4. If the SW supports push, we register for background push too (optional future upgrade).
 */

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
