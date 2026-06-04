import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";
import { TRANSACTIONS_KEY } from "./transactions-query";

export const EMI_KEY = ["emis"];

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function advanceMonth(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const origDay = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(origDay, lastDay));
  return toDateStr(d);
}

export function useEmis() {
  const { session } = useAuth();
  return useQuery({
    queryKey: EMI_KEY,
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emis")
        .select("*, category:categories(id,name,color,icon), payment_method:payment_methods(id,name,type,last4,color,icon)")
        .eq("user_id", session.user.id)
        .order("next_due_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAddEmi() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fields) => {
      const { error } = await supabase.from("emis").insert({ ...fields, user_id: session.user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EMI_KEY }),
  });
}

export function useUpdateEmi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }) => {
      const { error } = await supabase.from("emis").update(fields).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EMI_KEY }),
  });
}

export function useDeleteEmi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("emis").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EMI_KEY }),
  });
}

// No-op — EMI installments are now paid manually from the Notifications page.
// Overdue EMIs (next_due_date ≤ today) are surfaced there instead of auto-created.
export function useAutoCreateEmiPayments() {}

// ── Mark one EMI installment as paid ─────────────────────────────────────────
export function useMarkEmiPaid() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ emi, paidDate }) => {
      const uid = session.user.id;
      // Idempotency: don't double-insert for same emi + date
      const { count } = await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("emi_id", emi.id)
        .eq("date", paidDate);
      if (!count) {
        const { error: txErr } = await supabase.from("transactions").insert({
          user_id: uid,
          title: `${emi.title} – EMI`,
          amount: emi.emi_amount,
          category_id: emi.category_id ?? null,
          payment_method_id: emi.payment_method_id ?? null,
          date: paidDate,
          notes: emi.notes ?? null,
          emi_id: emi.id,
        });
        if (txErr) throw txErr;
      }
      const newPaidCount = (emi.paid_count || 0) + 1;
      const newNextDue = advanceMonth(emi.next_due_date);
      const isComplete = newPaidCount >= emi.tenure_months;
      const { error: emiErr } = await supabase.from("emis").update({
        paid_count: newPaidCount,
        last_paid_date: paidDate,
        next_due_date: isComplete ? emi.next_due_date : newNextDue,
        is_active: !isComplete,
      }).eq("id", emi.id);
      if (emiErr) throw emiErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMI_KEY });
      qc.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}

// ── Create a new EMI with bulk backfill of past paid installments ──────────────
export function useAddEmiWithHistory() {
  const { session } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ emiFields, paidInstallments, nextDueDate }) => {
      const uid = session.user.id;
      // 1. Insert the EMI row (next_due_date will be corrected below)
      const { data: emi, error: emiErr } = await supabase
        .from("emis")
        .insert({ ...emiFields, user_id: uid, paid_count: 0, next_due_date: emiFields.start_date })
        .select()
        .single();
      if (emiErr) throw emiErr;
      // 2. Bulk-insert transactions for confirmed paid installments
      if (paidInstallments.length > 0) {
        const txns = paidInstallments.map((inst) => ({
          user_id: uid,
          title: `${emiFields.title} – EMI`,
          amount: emiFields.emi_amount,
          category_id: emiFields.category_id ?? null,
          payment_method_id: emiFields.payment_method_id ?? null,
          date: inst.date,
          notes: emiFields.notes ?? null,
          emi_id: emi.id,
        }));
        const { error: txErr } = await supabase.from("transactions").insert(txns);
        if (txErr) throw txErr;
      }
      // 3. Update EMI: paid_count, last_paid_date, correct next_due_date
      const paidCount = paidInstallments.length;
      const isComplete = paidCount >= emiFields.tenure_months;
      const lastPaid = paidInstallments.length > 0
        ? paidInstallments[paidInstallments.length - 1].date : null;
      const { error: updateErr } = await supabase.from("emis").update({
        paid_count: paidCount,
        last_paid_date: lastPaid,
        next_due_date: isComplete ? emiFields.start_date : nextDueDate,
        is_active: !isComplete,
      }).eq("id", emi.id);
      if (updateErr) throw updateErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMI_KEY });
      qc.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}
