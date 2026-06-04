import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

export const CATEGORIES_KEY = "categories";

// ── Fetch ──────────────────────────────────────────────────────────────────
async function fetchCategories(userId) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data;
}

export function useCategories() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: [CATEGORIES_KEY, userId],
    queryFn: () => fetchCategories(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ── Create ─────────────────────────────────────────────────────────────────
export function useAddCategory() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description, color, icon }) => {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, description, color, icon, user_id: session.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] }),
  });
}

// ── Update ─────────────────────────────────────────────────────────────────
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, description, color, icon }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({ name, description, color, icon })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] }),
  });
}

// ── Delete ─────────────────────────────────────────────────────────────────
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] }),
  });
}
