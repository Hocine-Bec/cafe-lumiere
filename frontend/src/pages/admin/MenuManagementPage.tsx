import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { LayoutList, GripVertical } from 'lucide-react';
import type { AxiosError } from 'axios';
import { menuItemsApi, categoriesApi } from '@/services/api';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MenuItemTable } from '@/components/admin/MenuItemTable';
import { MenuItemFormModal } from '@/components/admin/MenuItemFormModal';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { DraggableMenuList } from '@/components/admin/DraggableMenuList';
import { cn } from '@/utils/cn';
import type { MenuItemResponse, ApiError } from '@/types';

type Tab = 'items' | 'categories';
type ViewMode = 'table' | 'reorder';

export default function MenuManagementPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [itemModal, setItemModal] = useState<{ open: boolean; item?: MenuItemResponse }>({ open: false });

  const { data: menuItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['admin', 'menuItems'],
    queryFn: menuItemsApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: menuItemsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'menuItems'] });
      toast.success('Item created');
      setItemModal({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof menuItemsApi.update>[1] }) =>
      menuItemsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'menuItems'] });
      toast.success('Item updated');
      setItemModal({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to update'),
  });

  const handleItemSubmit = (data: Parameters<typeof menuItemsApi.create>[0]) => {
    if (itemModal.item) {
      updateMutation.mutate({ id: itemModal.item.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'items', label: 'Menu Items' },
    { key: 'categories', label: 'Categories' },
  ];

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Menu Management"
        action={activeTab === 'items' ? { label: 'Add Item', onClick: () => setItemModal({ open: true }) } : undefined}
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-warm-gray-light mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.key
                ? 'border-copper text-copper'
                : 'border-transparent text-warm-gray hover:text-charcoal'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'items' && (
        <>
          {/* View mode toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex rounded-lg border border-warm-gray-light overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                  viewMode === 'table' ? 'bg-copper text-warm-white' : 'text-charcoal-light hover:bg-cream'
                )}
              >
                <LayoutList className="h-3.5 w-3.5" />
                Table
              </button>
              <button
                onClick={() => setViewMode('reorder')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                  viewMode === 'reorder' ? 'bg-copper text-warm-white' : 'text-charcoal-light hover:bg-cream'
                )}
              >
                <GripVertical className="h-3.5 w-3.5" />
                Reorder
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <MenuItemTable
              items={menuItems}
              isLoading={itemsLoading}
              onEdit={item => setItemModal({ open: true, item })}
            />
          ) : (
            <DraggableMenuList items={menuItems} />
          )}
        </>
      )}

      {activeTab === 'categories' && <CategoryManager />}

      <MenuItemFormModal
        isOpen={itemModal.open}
        onClose={() => setItemModal({ open: false })}
        onSubmit={handleItemSubmit}
        item={itemModal.item}
        categories={categories}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
