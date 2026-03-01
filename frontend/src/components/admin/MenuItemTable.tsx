import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Star } from 'lucide-react';
import type { AxiosError } from 'axios';
import { menuItemsApi } from '@/services/api';
import { DataTable, type Column } from './DataTable';
import { ConfirmDialog } from './ConfirmDialog';
import { cn } from '@/utils/cn';
import type { MenuItemResponse, ApiError } from '@/types';

interface MenuItemTableProps {
  items: MenuItemResponse[];
  isLoading: boolean;
  onEdit: (item: MenuItemResponse) => void;
}

export function MenuItemTable({ items, isLoading, onEdit }: MenuItemTableProps) {
  const qc = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuItemsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'menuItems'] });
      toast.success('Item deleted');
      setDeleteDialog({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to delete'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ item, field }: { item: MenuItemResponse; field: 'isAvailable' | 'isFeatured' }) =>
      menuItemsApi.update(item.id, {
        categoryId: item.categoryId, nameEn: item.nameEn, nameAr: item.nameAr,
        descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
        price: item.price, imageUrl: item.imageUrl, displayOrder: item.displayOrder,
        isAvailable: field === 'isAvailable' ? !item.isAvailable : item.isAvailable,
        isFeatured: field === 'isFeatured' ? !item.isFeatured : item.isFeatured,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'menuItems'] }),
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Update failed'),
  });

  const columns: Column<MenuItemResponse>[] = [
    {
      key: 'image',
      header: 'Image',
      width: '64px',
      render: item => (
        item.imageUrl
          ? <img src={item.imageUrl} alt={item.nameEn} className="h-10 w-10 rounded-md object-cover" />
          : <div className="h-10 w-10 rounded-md bg-cream-dark flex items-center justify-center text-warm-gray text-xs">—</div>
      ),
    },
    {
      key: 'nameEn',
      header: 'Name',
      sortable: true,
      sortValue: item => item.nameEn,
      render: item => (
        <div>
          <p className="font-medium text-charcoal">{item.nameEn}</p>
          <p className="text-xs text-warm-gray">{item.nameAr}</p>
        </div>
      ),
    },
    {
      key: 'categoryNameEn',
      header: 'Category',
      sortable: true,
      sortValue: item => item.categoryNameEn,
      render: item => <span className="text-sm text-charcoal-light">{item.categoryNameEn}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      sortValue: item => item.price,
      render: item => <span className="font-medium">${item.price.toFixed(2)}</span>,
    },
    {
      key: 'isAvailable',
      header: 'Available',
      render: item => (
        <button
          onClick={() => toggleMutation.mutate({ item, field: 'isAvailable' })}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none',
            item.isAvailable ? 'bg-copper' : 'bg-warm-gray-light'
          )}
        >
          <span className={cn(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5',
            item.isAvailable ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
          )} />
        </button>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      render: item => (
        <button onClick={() => toggleMutation.mutate({ item, field: 'isFeatured' })}>
          <Star className={cn('h-5 w-5', item.isFeatured ? 'fill-copper text-copper' : 'text-warm-gray-light')} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: item => (
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-warm-gray hover:text-copper transition-colors rounded"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, id: item.id })}
            className="p-1.5 text-warm-gray hover:text-error transition-colors rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={items}
        columns={columns}
        isLoading={isLoading}
        getKey={item => item.id}
        emptyMessage="No menu items yet. Add your first item!"
      />
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={() => deleteDialog.id && deleteMutation.mutate(deleteDialog.id)}
        title="Delete Menu Item"
        message="Are you sure you want to delete this item? This cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
