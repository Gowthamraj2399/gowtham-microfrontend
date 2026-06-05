import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

export const BUDGETS_KEY = "budgets";

function monthBounds(year, month) {
  const pad = (n) => String(n).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${year}-${pad(month)}-01`,
    end: `${year}-${pad(month)}-${pad(lastDay)}`,
  };
}

// ── Fetch raw budgets ──────────────────────────────────────────────────────
async function fetchBudgets(userId) {
  const { data, error } = await supabase
    .from("budgets")
    .select(
      "*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)"
    )
    .eq("user_id", userId)
    .order("created_at");
  if (error) throw error;
  return data;
}

export function useBudgets() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: [BUDGETS_KEY, userId],
    queryFn: () => fetchBudgets(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Fetch budgets with current-month spending ──────────────────────────────
async function fetchBudgetsWithSpending(userId, year, month) {
  const { start, end } = monthBounds(year, month);
  const [budgets, txRes] = await Promise.all([
    fetchBudgets(userId),
    supabase
      .from("transactions")
      .select("category_id, amount")
      .eq("user_id", userId)
      .gte("date", start)
      .lte("date", end),
  ]);
  if (txRes.error) throw txRes.error;

  const spendingByCategory = {};
  for (const tx of txRes.data || []) {
    if (tx.category_id) {
      spendingByCategory[tx.category_id] =
        (spendingByCategory[tx.category_id] || 0) + Number(tx.amount);
    }
  }

  return budgets.map((b) => {
    const spent = spendingByCategory[b.category_id] || 0;
    return {
      ...b,
      spent,
      remaining: b.monthly_amount - spent,
      pct: Math.min((spent / b.monthly_amount) * 100, 100),
      over: spent > b.monthly_amount,
    };
  });
}

export function useBudgetsWithSpending(year, month) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: [BUDGETS_KEY, "spending", userId, year, month],
    queryFn: () => fetchBudgetsWithSpending(userId, year, month),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Create ─────────────────────────────────────────────────────────────────
export function useAddBudget() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ category_id, monthly_amount, payment_method_id }) => {
      const { data, error } = await supabase
        .from("budgets")
        .insert({
          category_id,
          monthly_amount: Number(monthly_amount),
          payment_method_id: payment_method_id || null,
          user_id: session.user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [BUDGETS_KEY] }),
  });
}

// ── Update ─────────────────────────────────────────────────────────────────
export function useUpdateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, category_id, monthly_amount, payment_method_id }) => {
      const { data, error } = await supabase
        .from("budgets")
        .update({
          category_id,
          monthly_amount: Number(monthly_amount),
          payment_method_id: payment_method_id || null,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [BUDGETS_KEY] }),
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────
export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [BUDGETS_KEY] }),
  });
}
