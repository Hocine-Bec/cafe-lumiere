import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { IMAGES } from '@/utils/images';

export function AboutTeaser() {
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
                src={IMAGES.cafeInterior}
                alt="Inside Café Lumière"
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
              {t('home.ourStory')}
            </p>
            <h2 className="font-serif text-4xl font-bold text-charcoal md:text-5xl leading-tight">
              {t('home.storyTitle')}
            </h2>
            <div className="flex flex-col gap-4 font-sans text-charcoal-light leading-relaxed">
              <p>{t('home.storyP1')}</p>
              <p>{t('home.storyP2')}</p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 font-sans text-copper font-medium hover:gap-3 transition-all w-fit"
            >
              {t('home.learnMore')} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
