import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import type { MenuItemResponse } from '@/types';

interface MenuCardProps {
  item: MenuItemResponse;
  index: number;
  onClick: (item: MenuItemResponse) => void;
}

export function MenuCard({ item, index: _index, onClick }: MenuCardProps) {
  const { language, t } = useLanguage();
  const name = language === 'ar' ? item.nameAr : item.nameEn;
  const description = language === 'ar' ? item.descriptionAr : item.descriptionEn;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(item)}
      className="rounded-2xl bg-warm-white overflow-hidden shadow-sm text-left w-full cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={item.imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50">
            <span className="rounded-full bg-warm-white/90 px-3 py-1 text-xs font-medium text-warm-gray-dark">
              {t('menu.unavailable')}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-charcoal">{name}</h3>
        <p className="mt-1.5 text-sm text-warm-gray line-clamp-2">{description}</p>
        <p className="mt-3 font-sans text-base font-bold text-copper">${item.price.toFixed(2)}</p>
      </div>
    </motion.button>
  );
}
