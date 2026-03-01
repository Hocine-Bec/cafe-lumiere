import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { MenuItemResponse } from '@/types';
import { IMAGES } from '@/utils/images';

const FALLBACK_IMAGES = [IMAGES.coffee1, IMAGES.coffee2, IMAGES.pastry1, IMAGES.pastry2];

interface MenuItemModalProps {
  item: MenuItemResponse | null;
  onClose: () => void;
}

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { language } = useLanguage();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 top-1/2 z-50 max-w-lg mx-auto -translate-y-1/2 rounded-2xl bg-warm-white shadow-2xl overflow-hidden md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-charcoal/20 p-1.5 text-warm-white hover:bg-charcoal/40 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={item.imageUrl || FALLBACK_IMAGES[0]}
                alt={language === 'ar' ? item.nameAr : item.nameEn}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  {language === 'ar' ? item.nameAr : item.nameEn}
                </h2>
                <p className="font-sans text-xl font-bold text-copper shrink-0">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <span className="mt-3 inline-block rounded-full bg-copper/10 px-3 py-1 text-xs font-medium text-copper">
                {language === 'ar' ? item.categoryNameAr : item.categoryNameEn}
              </span>

              <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
                {language === 'ar' ? item.descriptionAr : item.descriptionEn}
              </p>

              {!item.isAvailable && (
                <p className="mt-4 text-sm font-medium text-warm-gray">
                  This item is currently unavailable.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
