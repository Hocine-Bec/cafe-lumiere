import { motion } from 'framer-motion';
import { Coffee, ChefHat, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const VALUE_ICONS: LucideIcon[] = [Coffee, ChefHat, Heart];
const VALUE_KEYS = [
  { title: 'about.value1Title', desc: 'about.value1Desc' },
  { title: 'about.value2Title', desc: 'about.value2Desc' },
  { title: 'about.value3Title', desc: 'about.value3Desc' },
];

export function ValuesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <h2 className="font-serif text-4xl font-bold text-charcoal md:text-5xl">
            {t('about.valuesTitle')}
          </h2>
          <p className="mt-3 text-warm-gray">{t('about.valuesSubtitle')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {VALUE_KEYS.map(({ title, desc }, idx) => {
            const Icon = VALUE_ICONS[idx];
            return (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex flex-col items-center gap-5 rounded-2xl bg-warm-white p-8 text-center shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-copper/10">
                  <Icon className="h-7 w-7 text-copper" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal">{t(title)}</h3>
                <p className="text-sm leading-relaxed text-charcoal-light">{t(desc)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
