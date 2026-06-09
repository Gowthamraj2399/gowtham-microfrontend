import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

export const PARTNER_KEY = "partner_connection";

// Readable 8-char code e.g. "ABCD-EF23"
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/I/1 for clarity
  let raw = "";
  for (let i = 0; i < 8; i++) raw += chars[Math.floor(Math.random() * chars.length)];
  return raw.slice(0, 4) + "-" + raw.slice(4);
}

function normalizeCode(code) {
  return code.replace(/-/g, "").toUpperCase().trim();
}

// ── Fetch connection state ─────────────────────────────────────────────────
async function fetchPartnerState(userId) {
  const { data, error } = await supabase
    .from("partner_connections")
    .select("*")
    .or(`inviter_id.eq.${userId},invitee_id.eq.${userId}`)
    .in("status", ["pending", "active"]);

  if (error) throw error;

  const active  = (data || []).find((r) => r.status === "active") ?? null;
  const pending = (data || []).find((r) => r.status === "pending" && r.inviter_id === userId) ?? null;
  return { active, pending };
}

export function usePartnerConnection() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  return useQuery({
    queryKey: [PARTNER_KEY, userId],
    queryFn: () => fetchPartnerState(userId),
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
}

// Helper: derive partnerId and partnerName from the connection
export function usePartnerInfo() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data } = usePartnerConnection();
  if (!data?.active) return { partnerId: null, partnerName: null, connectionId: null };
  const conn = data.active;
  const isInviter = conn.inviter_id === userId;
  return {
    partnerId:    isInviter ? conn.invitee_id   : conn.inviter_id,
    partnerName:  isInviter ? conn.invitee_name : conn.inviter_name,
    connectionId: conn.id,
  };
}

// ── Create invite ──────────────────────────────────────────────────────────
export function useCreateInvite() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const userId = session.user.id;
      // Cancel any existing pending invite first
      await supabase
        .from("partner_connections")
        .delete()
        .eq("inviter_id", userId)
        .eq("status", "pending");

      const code = generateCode();
      const { data, error } = await supabase
        .from("partner_connections")
        .insert({
          inviter_id:   userId,
          invite_code:  normalizeCode(code),
          inviter_name: session.user.user_metadata?.full_name || session.user.email,
          status:       "pending",
        })
        .select()
        .single();
      if (error) throw error;
      // Return with display format
      return { ...data, display_code: code };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PARTNER_KEY] }),
  });
}

// ── Cancel pending invite ──────────────────────────────────────────────────
export function useCancelInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("partner_connections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PARTNER_KEY] }),
  });
}

// ── Accept invite by code (via RPC) ───────────────────────────────────────
export function useAcceptInvite() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rawCode) => {
      const code = normalizeCode(rawCode);
      const userId   = session.user.id;
      const userName = session.user.user_metadata?.full_name || session.user.email;

      const { error } = await supabase.rpc("accept_partner_invite", {
        p_code:      code,
        p_user_id:   userId,
        p_user_name: userName,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PARTNER_KEY] }),
  });
}

// ── Disconnect ─────────────────────────────────────────────────────────────
export function useDisconnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId) => {
      const { error } = await supabase
        .from("partner_connections")
        .delete()
        .eq("id", connectionId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PARTNER_KEY] }),
  });
}

// ── Partner's categories ───────────────────────────────────────────────────
export function usePartnerCategories(partnerId) {
  return useQuery({
    queryKey: ["partner_categories", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", partnerId)
        .order("name");
      if (error) throw error;
      return (data ?? []).map((c) => ({ ...c, _isPartner: true }));
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Partner's EMIs ─────────────────────────────────────────────────────────
export function usePartnerEmis(partnerId) {
  return useQuery({
    queryKey: ["partner_emis", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emis")
        .select("*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)")
        .eq("user_id", partnerId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map((e) => ({ ...e, _isPartner: true }));
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Partner's recurring payments ───────────────────────────────────────────
export function usePartnerRecurring(partnerId) {
  return useQuery({
    queryKey: ["partner_recurring", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_payments")
        .select("*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)")
        .eq("user_id", partnerId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, _isPartner: true }));
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
}
export function usePartnerPaymentMethods(partnerId) {
  return useQuery({
    queryKey: ["partner_payment_methods", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", partnerId)
        .order("is_default", { ascending: false })
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Partner's transactions for a month ────────────────────────────────────
export function usePartnerTransactions(partnerId, { year, month } = {}) {
  return useQuery({
    queryKey: ["partner_transactions", partnerId, year, month],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select(
          "*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)"
        )
        .eq("user_id", partnerId)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (year != null && month != null) {
        const pad = (n) => String(n).padStart(2, "0");
        const lastDay = new Date(year, month, 0).getDate();
        query = query
          .gte("date", `${year}-${pad(month)}-01`)
          .lte("date", `${year}-${pad(month)}-${pad(lastDay)}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((t) => ({ ...t, _isPartner: true }));
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Partner's budgets with current-month spending ─────────────────────────
export function usePartnerBudgetsWithSpending(partnerId, year, month) {
  return useQuery({
    queryKey: ["partner_budgets_spending", partnerId, year, month],
    queryFn: async () => {
      const pad = (n) => String(n).padStart(2, "0");
      const lastDay = new Date(year, month, 0).getDate();
      const start = `${year}-${pad(month)}-01`;
      const end   = `${year}-${pad(month)}-${pad(lastDay)}`;

      const [{ data: budgets, error: bErr }, { data: txs, error: txErr }] = await Promise.all([
        supabase
          .from("budgets")
          .select("*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)")
          .eq("user_id", partnerId)
          .order("created_at"),
        supabase
          .from("transactions")
          .select("category_id, amount")
          .eq("user_id", partnerId)
          .gte("date", start)
          .lte("date", end),
      ]);
      if (bErr) throw bErr;
      if (txErr) throw txErr;

      const spending = {};
      for (const tx of txs ?? []) {
        if (tx.category_id) spending[tx.category_id] = (spending[tx.category_id] || 0) + Number(tx.amount);
      }

      return (budgets ?? []).map((b) => {
        const spent = spending[b.category_id] || 0;
        return { ...b, spent, remaining: b.monthly_amount - spent, pct: Math.min((spent / b.monthly_amount) * 100, 100), over: spent > b.monthly_amount };
      });
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 2,
  });
}
