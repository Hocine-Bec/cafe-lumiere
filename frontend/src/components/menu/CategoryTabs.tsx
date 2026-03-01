import { cn } from '@/utils/cn';
import { useLanguage } from '@/hooks/useLanguage';
import type { CategoryResponse } from '@/types';

interface CategoryTabsProps {
  categories: CategoryResponse[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  const { language, t } = useLanguage();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors',
          selected === 'all'
            ? 'bg-copper text-warm-white'
            : 'bg-cream-dark text-charcoal hover:bg-copper/10'
        )}
      >
        {t('menu.all')}
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors',
            selected === cat.id
              ? 'bg-copper text-warm-white'
              : 'bg-cream-dark text-charcoal hover:bg-copper/10'
          )}
        >
          {language === 'ar' ? cat.nameAr : cat.nameEn}
        </button>
      ))}
    </div>
  );
}
