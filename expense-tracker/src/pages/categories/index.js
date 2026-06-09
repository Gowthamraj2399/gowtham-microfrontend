import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryFormModal from "../../components/categories/CategoryFormModal";
import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../lib/categories-query";
import { usePartnerCategories } from "../../lib/partner-query";
import { usePartner } from "../../lib/PartnerContext";

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
const DeleteConfirmModal = ({ category, onConfirm, onCancel, loading }) => (
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
          <h3 className="text-sm font-bold text-white">Delete Category?</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            "{category.name}" will be removed. Existing transactions won't be deleted.
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
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Category card ──────────────────────────────────────────────────────────
const CategoryCard = ({ category, onEdit, onDelete, partnerName }) => (
  <motion.div
    variants={itemVariants}
    className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
    style={glassStyle}
    whileHover={{ scale: 1.01 }}
  >
    {/* Icon */}
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${category.color}1A` }}
    >
      <span
        className="material-symbols-rounded"
        style={{ fontSize: "20px", color: category.color, fontVariationSettings: "'FILL' 1" }}
      >
        {category.icon}
      </span>
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-white truncate">{category.name}</p>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: category.color }}
        />
        {category._isPartner && partnerName && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
            style={{ background: "rgba(251,146,60,0.15)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.25)" }}
          >
            {partnerName}
          </span>
        )}
      </div>
      {category.description && (
        <p className="text-xs text-text-secondary truncate mt-0.5">{category.description}</p>
      )}
    </div>

    {/* Actions — hidden for partner categories */}
    {!category._isPartner && (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(category)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(139,92,246,0.1)" }}
          title="Edit"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "15px", color: "#A78BFA", fontVariationSettings: "'FILL' 1" }}>
            edit
          </span>
        </button>
        <button
          onClick={() => onDelete(category)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(239,68,68,0.1)" }}
          title="Delete"
        >
          <span className="material-symbols-rounded" style={{ fontSize: "15px", color: "#F87171", fontVariationSettings: "'FILL' 1" }}>
            delete
          </span>
        </button>
      </div>
    )}
  </motion.div>
);

// ── Page ───────────────────────────────────────────────────────────────────
const CategoriesPage = () => {
  const { data: myCategories = [], isLoading, error } = useCategories();
  const addCategory    = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const { showPartner, partnerId, partnerName } = usePartner();
  const { data: partnerCategories = [] } = usePartnerCategories(showPartner ? partnerId : null);

  const categories = useMemo(() => {
    if (!showPartner || !partnerId) return myCategories;
    return [...myCategories, ...partnerCategories].sort((a, b) => a.name.localeCompare(b.name));
  }, [myCategories, partnerCategories, showPartner, partnerId]);

  const [formOpen, setFormOpen]         = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd  = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (cat) => { setEditTarget(cat); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleSave = async (values) => {
    try {
      if (editTarget) {
        await updateCategory.mutateAsync({ id: editTarget.id, ...values });
      } else {
        await addCategory.mutateAsync(values);
      }
      closeForm();
    } catch (err) {
      console.error("Save category failed:", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete category failed:", err.message);
    }
  };

  const isSaving = addCategory.isPending || updateCategory.isPending;

  return (
    <div className="max-w-[800px] w-full mx-auto px-4 sm:px-6 py-6 pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>
            Configuration
          </p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">Categories</h1>
          <p className="text-text-secondary text-sm mt-1">
            {categories.length} {categories.length === 1 ? "category" : "categories"}{showPartner && partnerId ? ` · Combined with ${partnerName}` : " · Organise your spending"}
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold h-10 px-5 rounded-xl transition-all active:scale-95 shrink-0"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>add</span>
          New Category
        </motion.button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl p-4 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          Failed to load categories: {error.message}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-20"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(139,92,246,0.1)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "32px", color: "#8B5CF6", fontVariationSettings: "'FILL' 1" }}>
              category
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">No categories yet</p>
            <p className="text-xs text-text-secondary mt-1">Create your first category to start tagging expenses.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)", boxShadow: "0 4px 15px rgba(139,92,246,0.35)" }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>add</span>
            Create Category
          </button>
        </motion.div>
      )}

      {/* Categories list */}
      {!isLoading && categories.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2"
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              partnerName={partnerName}
            />
          ))}
        </motion.div>
      )}

      {/* Add / Edit modal */}
      <CategoryFormModal
        open={formOpen}
        initial={editTarget}
        onSave={handleSave}
        onClose={closeForm}
        loading={isSaving}
      />

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            category={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteCategory.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesPage;
