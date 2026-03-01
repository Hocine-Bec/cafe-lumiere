import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { MapView } from '@/components/ui/MapView';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export function LocationSection() {
  const { t } = useLanguage();

  const hours = [
    { key: 'home.monFri', time: '7:00 AM – 10:00 PM' },
    { key: 'home.saturday', time: '8:00 AM – 11:00 PM' },
    { key: 'home.sunday', time: '8:00 AM – 9:00 PM' },
  ];

  return (
    <section className="py-24 bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="mb-14 text-center font-serif text-4xl font-bold text-charcoal md:text-5xl"
        >
          {t('home.visitUs')}
        </motion.h2>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="overflow-hidden rounded-2xl shadow-sm"
          >
            <MapView lat={48.8552} lng={2.3542} height="380px" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="flex flex-col gap-7"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
                <MapPin className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-sans font-semibold text-charcoal">{t('home.address')}</p>
                <p className="mt-1 text-sm text-charcoal-light whitespace-pre-line">
                  {t('home.addressValue')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
                <Phone className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-sans font-semibold text-charcoal">{t('home.phone')}</p>
                <a
                  href="tel:+14155551234"
                  className="mt-1 text-sm text-charcoal-light hover:text-copper transition-colors"
                >
                  +1 (415) 555-1234
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
                <Mail className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-sans font-semibold text-charcoal">{t('home.email')}</p>
                <a
                  href="mailto:hello@cafelumiere.com"
                  className="mt-1 text-sm text-charcoal-light hover:text-copper transition-colors"
                >
                  hello@cafelumiere.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper/10">
                <Clock className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-sans font-semibold text-charcoal">{t('home.hours')}</p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {hours.map(({ key, time }) => (
                    <div key={key} className="flex justify-between gap-6 text-sm">
                      <span className="text-charcoal-light">{t(key)}</span>
                      <span className="font-medium text-charcoal">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
