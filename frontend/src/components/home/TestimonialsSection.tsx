import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const testimonials = [
  {
    quoteEn: "The best cappuccino I've ever had. The atmosphere is simply magical.",
    quoteAr: 'أفضل كابتشينو تذوقته في حياتي. الأجواء ساحرة ببساطة.',
    name: 'Sarah M.',
    role: 'Regular Guest',
    roleAr: 'زبونة دائمة',
    rating: 5,
  },
  {
    quoteEn: "Perfect spot for a business meeting or a quiet afternoon with a book. Love the pastries!",
    quoteAr: 'المكان المثالي للاجتماعات أو قضاء بعد الظهر بهدوء مع كتاب. أحب معجناتهم!',
    name: 'Ahmed K.',
    role: 'Coffee Enthusiast',
    roleAr: 'عاشق القهوة',
    rating: 5,
  },
  {
    quoteEn: "Café Lumière has become our family's weekend tradition. The kids love the pancakes!",
    quoteAr: 'أصبح مقهى لوميير تقليد عائلتنا في عطل نهاية الأسبوع. الأطفال يحبون الفطائر!',
    name: 'Lina & Omar',
    role: 'Weekend Regulars',
    roleAr: 'زوار دائمون في عطلة الأسبوع',
    rating: 5,
  },
  {
    quoteEn: "The attention to detail here is remarkable. From the decor to the latte art, everything is perfect.",
    quoteAr: 'الاهتمام بالتفاصيل هنا لافت للنظر. من الديكور إلى فن اللاتيه، كل شيء مثالي.',
    name: 'James R.',
    role: 'Food Blogger',
    roleAr: 'مدوّن طعام',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { t, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  const t_ = testimonials[current];

  return (
    <section
      className="py-24 bg-cream-dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-14 text-center font-serif text-4xl font-bold text-charcoal md:text-5xl"
        >
          {t('home.testimonials')}
        </motion.h2>

        <div className="relative flex flex-col items-center">
          <div className="flex gap-1 mb-8">
            {Array.from({ length: t_.rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-copper text-copper" />
            ))}
          </div>

          <div className="min-h-[8rem] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-center"
              >
                <blockquote className="font-serif text-xl italic text-charcoal md:text-2xl leading-relaxed">
                  "{language === 'ar' ? t_.quoteAr : t_.quoteEn}"
                </blockquote>
                <div className="mt-6">
                  <p className="font-sans font-semibold text-charcoal">{t_.name}</p>
                  <p className="font-sans text-sm text-warm-gray">
                    — {language === 'ar' ? t_.roleAr : t_.role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <button
              onClick={prev}
              className="rounded-full border border-warm-gray-light p-2 text-warm-gray transition-colors hover:border-copper hover:text-copper"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'w-6 bg-copper' : 'w-2 bg-warm-gray-light'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="rounded-full border border-warm-gray-light p-2 text-warm-gray transition-colors hover:border-copper hover:text-copper"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
