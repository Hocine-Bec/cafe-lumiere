import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { menuItemsApi, categoriesApi } from '@/services/api';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { MenuSkeleton } from '@/components/menu/MenuSkeleton';
import { MenuItemModal } from '@/components/menu/MenuItemModal';
import { IMAGES } from '@/utils/images';
import { DEMO_MENU_ITEMS, DEMO_CATEGORIES } from '@/utils/demoData';
import type { MenuItemResponse } from '@/types';

export default function MenuPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeItem, setActiveItem] = useState<MenuItemResponse | null>(null);

  const { data: apiItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: menuItemsApi.getAll,
  });

  const { data: apiCategories } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: categoriesApi.getActive,
  });

  // Fall back to demo data when API returns nothing
  const menuItems = (apiItems && apiItems.length > 0) ? apiItems : (!itemsLoading ? DEMO_MENU_ITEMS : []);
  const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : DEMO_CATEGORIES;

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter(item => item.categoryId === selectedCategory);

  return (
    <>
      {/* Hero banner */}
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src={IMAGES.heroMenu}
          alt={t('menu.title')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <h1 className="relative z-10 font-serif text-4xl font-bold text-warm-white md:text-5xl">
          {t('menu.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {itemsLoading ? (
          <MenuSkeleton />
        ) : (
          <MenuGrid items={filteredItems} onItemClick={setActiveItem} />
        )}
      </div>

      <MenuItemModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
