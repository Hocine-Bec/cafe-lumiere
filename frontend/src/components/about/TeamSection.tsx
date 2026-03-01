import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { IMAGES } from '@/utils/images';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const team = [
  { name: 'Marco Bianchi', roleKey: 'about.team1Role', bioKey: 'about.team1Bio', image: IMAGES.team1 },
  { name: 'Pierre Dubois', roleKey: 'about.team2Role', bioKey: 'about.team2Bio', image: IMAGES.team2 },
  { name: 'Lucas Ferreira', roleKey: 'about.team3Role', bioKey: 'about.team3Bio', image: IMAGES.team3 },
];

export function TeamSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <h2 className="font-serif text-4xl font-bold text-charcoal md:text-5xl">
            {t('about.teamTitle')}
          </h2>
          <p className="mt-3 text-warm-gray">{t('about.teamSubtitle')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid gap-10 md:grid-cols-3"
        >
          {team.map(({ name, roleKey, bioKey, image }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-copper/20">
                <img src={image} alt={name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-charcoal">{name}</h3>
                <p className="mt-0.5 text-sm font-medium text-copper">{t(roleKey)}</p>
              </div>
              <p className="text-sm leading-relaxed text-charcoal-light">{t(bioKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
