import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";
import { BUDGETS_KEY } from "./budget-query";

export const TRANSACTIONS_KEY = "transactions";

// ── Helpers ────────────────────────────────────────────────────────────────
function monthBounds(year, month) {
  // month is 1-based
  const pad = (n) => String(n).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${year}-${pad(month)}-01`,
    end: `${year}-${pad(month)}-${pad(lastDay)}`,
  };
}

// ── Fetch ──────────────────────────────────────────────────────────────────
async function fetchTransactions(userId, { year, month } = {}) {
  let query = supabase
    .from("transactions")
    .select("*, category:categories(id, name, color, icon), payment_method:payment_methods(id, name, type, last4, color, icon)")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (year != null && month != null) {
    const { start, end } = monthBounds(year, month);
    query = query.gte("date", start).lte("date", end);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export function useTransactions(filters = {}) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, userId, filters],
    queryFn: () => fetchTransactions(userId, filters),
    enabled: !!userId,
  });
}

// Computed stats from a transactions array (all positive amounts = expense)
export function computeStats(transactions = []) {
  if (!transactions.length) return { total: 0, avgDaily: 0, largest: null };

  const now = new Date();
  const daysElapsed = Math.max(now.getDate(), 1);
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const largest = transactions.reduce(
    (max, t) => (Number(t.amount) > Number(max?.amount ?? 0) ? t : max),
    null
  );

  return {
    total,
    avgDaily: total / daysElapsed,
    largest,
  };
}

// ── Create ─────────────────────────────────────────────────────────────────
export function useAddTransaction() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, amount, category_id, payment_method_id, date, notes }) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          title,
          amount: Math.abs(Number(amount)), // always store positive
          category_id: category_id || null,
          payment_method_id: payment_method_id || null,
          date,
          notes: notes || null,
          user_id: session.user.id,
        })
        .select("*, category:categories(id, name, color, icon), payment_method:payment_methods(id, name, type, last4, color, icon)")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      qc.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}

// ── Update ─────────────────────────────────────────────────────────────────
export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, amount, category_id, payment_method_id, date, notes }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update({
          title,
          amount: Math.abs(Number(amount)),
          category_id: category_id || null,
          payment_method_id: payment_method_id || null,
          date,
          notes: notes || null,
        })
        .eq("id", id)
        .select("*, category:categories(id, name, color, icon), payment_method:payment_methods(id, name, type, last4, color, icon)")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      qc.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────
export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      qc.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}
