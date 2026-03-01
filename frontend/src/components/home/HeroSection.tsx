import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { IMAGES } from '@/utils/images';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      >
        <img
          src={IMAGES.heroHome}
          alt="Café Lumière interior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/20" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-sm uppercase tracking-[0.3em] text-copper-light"
        >
          {t('home.est')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-5xl font-bold text-warm-white md:text-7xl lg:text-8xl"
        >
          Café Lumière
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="font-sans text-lg font-light text-warm-gray-light md:text-xl"
        >
          {t('home.tagline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Link
            to="/menu"
            className="inline-flex items-center justify-center rounded-md bg-copper px-7 py-3 text-base font-medium text-warm-white transition-colors hover:bg-copper-dark"
          >
            {t('home.viewMenu')}
          </Link>
          <Link
            to="/reservation"
            className="inline-flex items-center justify-center rounded-md border border-warm-white px-7 py-3 text-base font-medium text-warm-white transition-colors hover:bg-warm-white/10"
          >
            {t('home.reserve')}
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-warm-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
