import { AnimatePresence } from 'framer-motion';
import { MenuCard } from './MenuCard';
import { useLanguage } from '@/hooks/useLanguage';
import type { MenuItemResponse } from '@/types';

interface MenuGridProps {
  items: MenuItemResponse[];
  onItemClick: (item: MenuItemResponse) => void;
}

export function MenuGrid({ items, onItemClick }: MenuGridProps) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-sans text-warm-gray">{t('menu.empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => (
          <MenuCard key={item.id} item={item} index={idx} onClick={onItemClick} />
        ))}
      </AnimatePresence>
    </div>
  );
}
