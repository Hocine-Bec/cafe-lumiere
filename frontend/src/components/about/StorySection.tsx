import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { IMAGES } from '@/utils/images';

export function StorySection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-warm-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={IMAGES.barista}
                alt="Barista at work"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl border-2 border-copper/30 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-copper">
              {t('about.since')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-charcoal leading-tight">
              {t('about.sanctuaryTitle')}
            </h2>
            <div className="flex flex-col gap-4 font-sans text-charcoal-light leading-relaxed">
              <p>{t('about.p1')}</p>
              <blockquote className="border-l-4 border-copper pl-5 font-serif text-xl italic text-charcoal">
                {t('about.pullQuote')}
              </blockquote>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
