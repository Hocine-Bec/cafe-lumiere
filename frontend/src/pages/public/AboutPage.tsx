import { useLanguage } from '@/hooks/useLanguage';
import { StorySection } from '@/components/about/StorySection';
import { ValuesSection } from '@/components/about/ValuesSection';
import { TeamSection } from '@/components/about/TeamSection';
import { IMAGES } from '@/utils/images';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src={IMAGES.heroAbout}
          alt={t('about.title')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <h1 className="relative z-10 font-serif text-4xl font-bold text-warm-white md:text-5xl">
          {t('about.title')}
        </h1>
      </div>

      <StorySection />
      <ValuesSection />
      <TeamSection />
    </>
  );
}
