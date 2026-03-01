import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { AxiosError } from 'axios';
import { categoriesApi } from '@/services/api';
import { CategoryFormModal } from './CategoryFormModal';
import { ConfirmDialog } from './ConfirmDialog';
import type { ApiError, CategoryResponse } from '@/types';

export function CategoryManager() {
  const qc = useQueryClient();
  const [formModal, setFormModal] = useState<{ open: boolean; category?: CategoryResponse }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category created');
      setFormModal({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof categoriesApi.update>[1] }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category updated');
      setFormModal({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category deleted');
      setDeleteDialog({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => {
      toast.error(e.response?.data?.detail ?? 'Cannot delete — category may have menu items');
      setDeleteDialog({ open: false });
    },
  });

  const handleSubmit = (data: Parameters<typeof categoriesApi.create>[0]) => {
    if (formModal.category) {
      updateMutation.mutate({ id: formModal.category.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-white border border-warm-gray-light animate-pulse" />
      ))}
    </div>;
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add button card */}
        <button
          onClick={() => setFormModal({ open: true })}
          className="flex items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-warm-gray-light text-warm-gray hover:border-copper hover:text-copper transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Add Category</span>
        </button>

        {categories.map(cat => (
          <div key={cat.id} className="rounded-xl bg-white border border-warm-gray-light p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-charcoal truncate">{cat.nameEn}</p>
                <p className="text-sm text-warm-gray truncate">{cat.nameAr}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setFormModal({ open: true, category: cat })}
                  className="p-1.5 text-warm-gray hover:text-copper transition-colors rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteDialog({ open: true, id: cat.id })}
                  className="p-1.5 text-warm-gray hover:text-error transition-colors rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-warm-gray">
              <span>{cat.menuItemCount} items</span>
              <span>·</span>
              <span>Order: {cat.displayOrder}</span>
              <span>·</span>
              <span className={cat.isActive ? 'text-green-700' : 'text-red-600'}>
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CategoryFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false })}
        onSubmit={handleSubmit}
        category={formModal.category}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={() => deleteDialog.id && deleteMutation.mutate(deleteDialog.id)}
        title="Delete Category"
        message="Are you sure? This cannot be undone. Categories with menu items cannot be deleted."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
