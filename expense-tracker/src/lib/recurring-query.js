import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";
import { TRANSACTIONS_KEY } from "./transactions-query";

export const RECURRING_KEY = ["recurring_payments"];

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Format a Date object as "YYYY-MM-DD" using LOCAL time (avoids UTC timezone shift). */
function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Clamp a day to the last valid day of a given month/year (handles Feb, 30-day months). */
function clampDay(year, month, day) {
  const last = new Date(year, month, 0).getDate(); // month is 1-indexed here
  return Math.min(day, last);
}

/** Compute the "first due date at or before today" for a recurring payment.
 *  For monthly: uses due_day, starts from current month, goes back if needed.
 *  "If I choose the 1st and today is the 4th" → this month's 1st is the current due date.
 */
export function computeCurrentDueDate(rp) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (rp.frequency === "monthly" && rp.due_day) {
    const day = rp.due_day;
    const d = clampDay(today.getFullYear(), today.getMonth() + 1, day);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), d);
    // If this month's due date is in the future, use last month
    if (thisMonth > today) {
      const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const pd = clampDay(prev.getFullYear(), prev.getMonth() + 1, day);
      return toDateStr(new Date(prev.getFullYear(), prev.getMonth(), pd));
    }
    return toDateStr(thisMonth);
  }

  if (rp.frequency === "yearly" && rp.due_day && rp.due_month) {
    const thisYear = today.getFullYear();
    const d = clampDay(thisYear, rp.due_month, rp.due_day);
    const thisYearDate = new Date(thisYear, rp.due_month - 1, d);
    if (thisYearDate > today) {
      const prevYear = thisYear - 1;
      const pd = clampDay(prevYear, rp.due_month, rp.due_day);
      return toDateStr(new Date(prevYear, rp.due_month - 1, pd));
    }
    return toDateStr(thisYearDate);
  }

  // weekly / daily or legacy: fall back to stored next_due_date
  return rp.next_due_date;
}

/** Advance a due date string by one period. */
export function advanceDate(dateStr, frequency, rp = null) {
  const d = new Date(dateStr + "T00:00:00");
  switch (frequency) {
    case "daily":  d.setDate(d.getDate() + 1); break;
    case "weekly": d.setDate(d.getDate() + 7); break;
    case "monthly": {
      // Advance by one month but pin to due_day if present
      const day = rp?.due_day ?? d.getDate();
      d.setMonth(d.getMonth() + 1);
      const clamped = clampDay(d.getFullYear(), d.getMonth() + 1, day);
      d.setDate(clamped);
      break;
    }
    case "yearly": {
      const day   = rp?.due_day   ?? d.getDate();
      const month = rp?.due_month ? rp.due_month - 1 : d.getMonth();
      d.setFullYear(d.getFullYear() + 1);
      const clamped = clampDay(d.getFullYear(), month + 1, day);
      d.setMonth(month);
      d.setDate(clamped);
      break;
    }
    default: d.setMonth(d.getMonth() + 1);
  }
  return toDateStr(d);
}

/** Given due_day (and optionally due_month), compute next_due_date from today.
 *  Used when adding/editing: give the user the NEXT upcoming due date. */
export function computeNextDueDate(frequency, due_day, due_month) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (frequency === "monthly" && due_day) {
    const d = clampDay(today.getFullYear(), today.getMonth() + 1, due_day);
    const candidate = new Date(today.getFullYear(), today.getMonth(), d);
    if (candidate < today) {
      // next month
      const nm = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nd = clampDay(nm.getFullYear(), nm.getMonth() + 1, due_day);
      return toDateStr(new Date(nm.getFullYear(), nm.getMonth(), nd));
    }
    return toDateStr(candidate);
  }

  if (frequency === "yearly" && due_day && due_month) {
    const thisYear = today.getFullYear();
    const d = clampDay(thisYear, due_month, due_day);
    const candidate = new Date(thisYear, due_month - 1, d);
    if (candidate < today) {
      const ny = thisYear + 1;
      const nd = clampDay(ny, due_month, due_day);
      return toDateStr(new Date(ny, due_month - 1, nd));
    }
    return toDateStr(candidate);
  }

  return toDateStr(today);
}

export function useRecurringPayments() {
  const { session } = useAuth();
  return useQuery({
    queryKey: RECURRING_KEY,
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_payments")
        .select("*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)")
        .eq("user_id", session.user.id)
        .order("next_due_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAddRecurringPayment() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fields) => {
      const { error } = await supabase
        .from("recurring_payments")
        .insert({ ...fields, user_id: session.user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: RECURRING_KEY }),
  });
}

export function useUpdateRecurringPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }) => {
      const { error } = await supabase.from("recurring_payments").update(fields).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: RECURRING_KEY }),
  });
}

export function useDeleteRecurringPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("recurring_payments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: RECURRING_KEY }),
  });
}

// ── Mark a specific recurring payment as paid for a given date ───────────────
export function useMarkRecurringPaid() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rp, paidDate }) => {
      const uid = session.user.id;
      // Idempotency: don't double-insert
      const { count } = await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("recurring_payment_id", rp.id)
        .eq("date", paidDate);
      if (!count) {
        const { error: txErr } = await supabase.from("transactions").insert({
          user_id: uid,
          title: rp.title,
          amount: rp.amount,
          category_id: rp.category_id ?? null,
          payment_method_id: rp.payment_method_id ?? null,
          date: paidDate,
          notes: rp.notes ?? null,
          recurring_payment_id: rp.id,
        });
        if (txErr) throw txErr;
      }
      // Advance next_due_date past paidDate
      let newNextDue = advanceDate(paidDate, rp.frequency, rp);
      const { error: rpErr } = await supabase
        .from("recurring_payments")
        .update({ last_paid_date: paidDate, next_due_date: newNextDue })
        .eq("id", rp.id);
      if (rpErr) throw rpErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RECURRING_KEY });
      qc.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}

// Auto-creates transactions for overdue recurring payments on app load (silent, background).
// Only runs once per session. Does NOT auto-create for manual-pay intent — just marks the
// recurring row's next_due_date so the notification system can surface it.
export function useAutoCreateRecurring() {
  const { session } = useAuth();
  const qc = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!session?.user?.id || hasRun.current) return;
    hasRun.current = true;
    const uid = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = toDateStr(today);

    (async () => {
      const { data: all } = await supabase
        .from("recurring_payments")
        .select("*")
        .eq("user_id", uid)
        .eq("is_active", true);

      if (!all?.length) return;

      let anyUpdated = false;
      for (const rp of all) {
        // Compute the actual current due date based on due_day/due_month
        const currentDue = computeCurrentDueDate(rp);

        // Update if stored next_due_date doesn't match the current period's due date
        // AND the current period has NOT already been paid (last_paid_date >= currentDue)
        const currentPeriodAlreadyPaid = rp.last_paid_date && rp.last_paid_date >= currentDue;
        if (rp.next_due_date !== currentDue && !currentPeriodAlreadyPaid) {
          await supabase
            .from("recurring_payments")
            .update({ next_due_date: currentDue })
            .eq("id", rp.id);
          anyUpdated = true;
        }
      }

      if (anyUpdated) qc.invalidateQueries({ queryKey: RECURRING_KEY });
    })();
  }, [session?.user?.id]);
}
