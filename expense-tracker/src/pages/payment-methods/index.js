import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentMethodFormModal, { PAYMENT_TYPES } from "../../components/payment-methods/PaymentMethodFormModal";
import {
  usePaymentMethods,
  useAddPaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from "../../lib/payment-methods-query";

const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

// ── Delete confirmation modal ──────────────────────────────────────────────
const DeleteConfirmModal = ({ method, onConfirm, onCancel, loading }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
      style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.1)" }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(239,68,68,0.15)" }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>
            delete
          </span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Remove Payment Method?</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            "{method.name}" will be removed. Existing transactions won't be deleted.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 4px 15px rgba(239,68,68,0.3)" }}
        >
          {loading ? "Removing…" : "Remove"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Payment method card ────────────────────────────────────────────────────
const PaymentMethodCard = ({ method, onEdit, onDelete }) => {
  const typeInfo = PAYMENT_TYPES.find((t) => t.value === method.type) || PAYMENT_TYPES[0];
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
      style={glassStyle}
      whileHover={{ scale: 1.01 }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${method.color}1A` }}
      >
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "22px", color: method.color, fontVariationSettings: "'FILL' 1" }}
        >
          {method.icon}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-white truncate">{method.name}</p>
          {method.is_default && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: `${method.color}22`, color: method.color }}
            >
              DEFAULT
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: "rgba(255,255,255,0.06)", color: "#7B8FA8" }}
          >
            {typeInfo.label}
          </span>
          {method.last4 && (
            <span className="text-xs text-text-secondary">
              •••• {method.last4}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(method)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(139,92,246,0.1)" }}
          title="Edit"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "15px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>
            edit
          </span>
        </button>
        <button
          onClick={() => onDelete(method)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(239,68,68,0.1)" }}
          title="Remove"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "15px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>
            delete
          </span>
        </button>
      </div>
    </motion.div>
  );
};

// ── Summary chips ──────────────────────────────────────────────────────────
const SummaryChips = ({ methods }) => {
  const counts = PAYMENT_TYPES.map((t) => ({
    ...t,
    count: methods.filter((m) => m.type === t.value).length,
  })).filter((t) => t.count > 0);

  return (
    <div className="flex flex-wrap gap-2">
      {counts.map((t) => (
        <div
          key={t.value}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30` }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>
            {t.icon}
          </span>
          {t.count} {t.label}{t.count > 1 ? "s" : ""}
        </div>
      ))}
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────
const PaymentMethodsPage = () => {
  const { data: methods = [], isLoading, error } = usePaymentMethods();
  const addMethod    = useAddPaymentMethod();
  const updateMethod = useUpdatePaymentMethod();
  const deleteMethod = useDeletePaymentMethod();

  const [formOpen, setFormOpen]         = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd  = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (m) => { setEditTarget(m); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleSave = async (values) => {
    try {
      if (editTarget) {
        await updateMethod.mutateAsync({ id: editTarget.id, ...values });
      } else {
        await addMethod.mutateAsync(values);
      }
      closeForm();
    } catch (err) {
      console.error("Save payment method failed:", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMethod.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete payment method failed:", err.message);
    }
  };

  const isSaving = addMethod.isPending || updateMethod.isPending;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6 flex flex-col gap-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Payment Methods</h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Track which account or card you spend from
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
            <span className="hidden sm:inline">Add Method</span>
          </button>
        </div>

        {/* Summary chips */}
        {methods.length > 0 && <SummaryChips methods={methods} />}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl px-4 py-3 text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}
          >
            Failed to load payment methods: {error.message}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && methods.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16 gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.1)" }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#8B5CF6", fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">No payment methods yet</p>
              <p className="text-xs text-text-secondary mt-1">
                Add your bank accounts, cards, and wallets to track where you spend.
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
              Add your first method
            </button>
          </motion.div>
        )}

        {/* List */}
        {!isLoading && methods.length > 0 && (
          <motion.div
            className="flex flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Group by type */}
            {PAYMENT_TYPES.filter((t) => methods.some((m) => m.type === t.value)).map((type) => (
              <div key={type.value} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "13px", color: type.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {type.icon}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: type.color }}
                  >
                    {type.label}s
                  </span>
                </div>
                {methods
                  .filter((m) => m.type === type.value)
                  .map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
              </div>
            ))}
          </motion.div>
        )}

      {/* Modals */}
      <AnimatePresence>
        {formOpen && (
          <PaymentMethodFormModal
            open={formOpen}
            initial={editTarget}
            onSave={handleSave}
            onClose={closeForm}
            loading={isSaving}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            method={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteMethod.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethodsPage;
