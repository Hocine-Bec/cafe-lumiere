import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { MenuItemResponse, CategoryResponse } from '@/types';

const schema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  nameEn: z.string().min(1, 'English name is required').max(200),
  nameAr: z.string().min(1, 'Arabic name is required').max(200),
  descriptionEn: z.string().max(1000).default(''),
  descriptionAr: z.string().max(1000).default(''),
  price: z.coerce.number({ error: 'Price must be a number' }).min(0),
  imageUrl: z.string().max(500).default(''),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  displayOrder: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof schema>;

interface MenuItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  item?: MenuItemResponse;
  categories: CategoryResponse[];
  isLoading?: boolean;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none',
        checked ? 'bg-copper' : 'bg-warm-gray-light'
      )}
    >
      <span className={cn(
        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5',
        checked ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
      )} />
    </button>
  );
}

export function MenuItemFormModal({ isOpen, onClose, onSubmit, item, categories, isLoading }: MenuItemFormModalProps) {
  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isAvailable: true, isFeatured: false, displayOrder: 0, price: 0 },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (isOpen) {
      reset(item
        ? {
            categoryId: item.categoryId,
            nameEn: item.nameEn, nameAr: item.nameAr,
            descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
            price: item.price, imageUrl: item.imageUrl,
            isAvailable: item.isAvailable, isFeatured: item.isFeatured,
            displayOrder: item.displayOrder,
          }
        : { categoryId: '', nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
            price: 0, imageUrl: '', isAvailable: true, isFeatured: false, displayOrder: 0 }
      );
    }
  }, [isOpen, item, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-2xl rounded-xl bg-white shadow-xl my-8"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-light">
              <h2 className="font-semibold text-charcoal">{item ? 'Edit Menu Item' : 'New Menu Item'}</h2>
              <button onClick={onClose} className="text-warm-gray hover:text-charcoal transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="categoryId" className="text-sm font-medium text-charcoal">Category</label>
                <select
                  id="categoryId"
                  className={cn(
                    'w-full rounded-md border bg-cream px-3.5 py-2.5 text-sm text-charcoal',
                    'focus:outline-none focus:ring-2 focus:ring-copper focus:border-copper transition-colors',
                    errors.categoryId ? 'border-error' : 'border-warm-gray-light'
                  )}
                  {...register('categoryId')}
                >
                  <option value="">Select category…</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-xs text-error">{errors.categoryId.message}</p>}
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <Input id="nameEn" label="Name (English)" placeholder="e.g. Espresso" error={errors.nameEn?.message} {...register('nameEn')} />
                <Input id="nameAr" label="Name (Arabic)" placeholder="e.g. إسبريسو" error={errors.nameAr?.message} {...register('nameAr')} />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <Textarea id="descriptionEn" label="Description (English)" placeholder="Describe the item…" rows={3} {...register('descriptionEn')} />
                <Textarea id="descriptionAr" label="Description (Arabic)" placeholder="صف العنصر…" rows={3} {...register('descriptionAr')} />
              </div>

              {/* Price + Order */}
              <div className="grid grid-cols-2 gap-4">
                <Input id="price" label="Price ($)" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
                <Input id="displayOrder" label="Display Order" type="number" error={errors.displayOrder?.message} {...register('displayOrder')} />
              </div>

              {/* Image URL + preview */}
              <div>
                <Input id="imageUrl" label="Image URL" placeholder="https://…" {...register('imageUrl')} />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mt-2 h-20 w-20 rounded-lg object-cover border border-warm-gray-light"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-8">
                <Controller name="isAvailable" control={control} render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Toggle checked={field.value} onChange={field.onChange} />
                    <span className="text-sm font-medium text-charcoal">Available</span>
                  </div>
                )} />
                <Controller name="isFeatured" control={control} render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Toggle checked={field.value} onChange={field.onChange} />
                    <span className="text-sm font-medium text-charcoal">Featured</span>
                  </div>
                )} />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Save</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
