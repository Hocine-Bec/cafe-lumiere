import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { menuItemsApi } from '@/services/api';
import type { MenuItemResponse } from '@/types';

function SortableItem({ item }: { item: MenuItemResponse }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-3 rounded-lg border border-warm-gray-light bg-white px-4 py-3 shadow-sm"
    >
      <button {...attributes} {...listeners} className="text-warm-gray-light hover:text-warm-gray cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="h-5 w-5" />
      </button>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.nameEn} className="h-9 w-9 rounded-md object-cover shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-charcoal truncate">{item.nameEn}</p>
        <p className="text-xs text-warm-gray">{item.categoryNameEn} · ${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

interface DraggableMenuListProps {
  items: MenuItemResponse[];
}

export function DraggableMenuList({ items: initialItems }: DraggableMenuListProps) {
  const qc = useQueryClient();
  const [items, setItems] = useState(
    [...initialItems].sort((a, b) => a.displayOrder - b.displayOrder)
  );

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof menuItemsApi.update>[1] }) =>
      menuItemsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'menuItems'] }),
    onError: () => {
      toast.error('Failed to save order');
      setItems([...initialItems].sort((a, b) => a.displayOrder - b.displayOrder));
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === String(active.id));
    const newIndex = items.findIndex(i => i.id === String(over.id));
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    // Update changed items
    reordered.forEach((item, idx) => {
      if (item.displayOrder !== idx) {
        updateMutation.mutate({
          id: item.id,
          data: {
            categoryId: item.categoryId, nameEn: item.nameEn, nameAr: item.nameAr,
            descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
            price: item.price, imageUrl: item.imageUrl,
            isAvailable: item.isAvailable, isFeatured: item.isFeatured,
            displayOrder: idx,
          },
        });
      }
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 max-w-xl">
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
          {items.length === 0 && (
            <p className="text-sm text-warm-gray text-center py-8">No items to reorder.</p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
