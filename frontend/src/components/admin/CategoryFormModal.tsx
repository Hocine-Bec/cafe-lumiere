import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { CategoryResponse } from '@/types';

const schema = z.object({
  nameEn: z.string().min(1, 'English name is required').max(200),
  nameAr: z.string().min(1, 'Arabic name is required').max(200),
  displayOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  category?: CategoryResponse;
  isLoading?: boolean;
}

export function CategoryFormModal({ isOpen, onClose, onSubmit, category, isLoading }: CategoryFormModalProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, displayOrder: 0 },
  });

  useEffect(() => {
    if (isOpen) {
      reset(category
        ? { nameEn: category.nameEn, nameAr: category.nameAr, displayOrder: category.displayOrder, isActive: category.isActive }
        : { nameEn: '', nameAr: '', displayOrder: 0, isActive: true }
      );
    }
  }, [isOpen, category, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-light">
              <h2 className="font-semibold text-charcoal">{category ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={onClose} className="text-warm-gray hover:text-charcoal transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Input id="nameEn" label="Name (English)" placeholder="e.g. Coffee" error={errors.nameEn?.message} {...register('nameEn')} />
                <Input id="nameAr" label="Name (Arabic)" placeholder="e.g. قهوة" error={errors.nameAr?.message} {...register('nameAr')} />
              </div>
              <Input id="displayOrder" label="Display Order" type="number" error={errors.displayOrder?.message} {...register('displayOrder')} />

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal">Active</span>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none',
                        field.value ? 'bg-copper' : 'bg-warm-gray-light'
                      )}
                    >
                      <span className={cn(
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5',
                        field.value ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
                      )} />
                    </button>
                  </div>
                )}
              />

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
