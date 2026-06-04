import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

export const PAYMENT_METHODS_KEY = "payment_methods";

// ── Fetch ──────────────────────────────────────────────────────────────────
async function fetchPaymentMethods(userId) {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("name");
  if (error) throw error;
  return data;
}

export function usePaymentMethods() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: [PAYMENT_METHODS_KEY, userId],
    queryFn: () => fetchPaymentMethods(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Create ─────────────────────────────────────────────────────────────────
export function useAddPaymentMethod() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, type, last4, color, icon, is_default }) => {
      const { data, error } = await supabase
        .from("payment_methods")
        .insert({ name, type, last4: last4 || null, color, icon, is_default: !!is_default, user_id: session.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PAYMENT_METHODS_KEY] }),
  });
}

// ── Update ─────────────────────────────────────────────────────────────────
export function useUpdatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, type, last4, color, icon, is_default }) => {
      const { data, error } = await supabase
        .from("payment_methods")
        .update({ name, type, last4: last4 || null, color, icon, is_default: !!is_default })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PAYMENT_METHODS_KEY] }),
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────
export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PAYMENT_METHODS_KEY] }),
  });
}
