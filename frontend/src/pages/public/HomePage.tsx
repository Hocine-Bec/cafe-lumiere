import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedMenuSection } from '@/components/home/FeaturedMenuSection';
import { AboutTeaser } from '@/components/home/AboutTeaser';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { LocationSection } from '@/components/home/LocationSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedMenuSection />
      <AboutTeaser />
      <TestimonialsSection />
      <LocationSection />
    </>
  );
}
