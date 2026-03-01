import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { menuItemsApi } from '@/services/api';
import { useLanguage } from '@/hooks/useLanguage';
import { DEMO_FEATURED_ITEMS } from '@/utils/demoData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-warm-white overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-warm-gray-light" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 bg-warm-gray-light rounded w-2/3" />
        <div className="h-4 bg-warm-gray-light rounded w-full" />
        <div className="h-4 bg-warm-gray-light rounded w-4/5" />
        <div className="h-5 bg-warm-gray-light rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}

export function FeaturedMenuSection() {
  const { language, t } = useLanguage();
  const { data: apiItems, isLoading } = useQuery({
    queryKey: ['menuItems', 'featured'],
    queryFn: menuItemsApi.getFeatured,
  });

  // Use real data when available, otherwise fall back to demo items
  const items = (apiItems && apiItems.length > 0) ? apiItems : (!isLoading ? DEMO_FEATURED_ITEMS : []);

  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <h2 className="font-serif text-4xl font-bold text-charcoal md:text-5xl">
            {t('home.specialties')}
          </h2>
          <p className="mt-3 font-sans text-warm-gray">
            {t('home.specialtiesSubtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="rounded-2xl bg-warm-white overflow-hidden shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={item.imageUrl}
                    alt={language === 'ar' ? item.nameAr : item.nameEn}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-charcoal">
                    {language === 'ar' ? item.nameAr : item.nameEn}
                  </h3>
                  <p className="mt-1.5 text-sm text-warm-gray line-clamp-2">
                    {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>
                  <p className="mt-3 font-sans text-base font-bold text-copper">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="mt-12 text-center"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-sans text-copper font-medium hover:gap-3 transition-all"
          >
            {t('home.viewFullMenu')} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
