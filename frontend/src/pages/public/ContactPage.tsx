import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { IMAGES } from '@/utils/images';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src={IMAGES.heroContact}
          alt={t('contact.title')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <h1 className="relative z-10 font-serif text-4xl font-bold text-warm-white md:text-5xl">
          {t('contact.title')}
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="mb-8 font-serif text-3xl font-bold text-charcoal">
              {t('contact.formTitle')}
            </h2>
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <h2 className="mb-8 font-serif text-3xl font-bold text-charcoal">
              {t('contact.infoTitle')}
            </h2>
            <ContactInfo />
          </motion.div>
        </div>
      </div>
    </>
  );
}
