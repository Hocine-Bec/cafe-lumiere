import { useLanguage } from '@/hooks/useLanguage';
import { ReservationForm } from '@/components/reservation/ReservationForm';
import { IMAGES } from '@/utils/images';

export default function ReservationPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="relative h-64 flex items-center justify-center overflow-hidden">
        <img
          src={IMAGES.heroReservation}
          alt={t('reservation.title')}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 text-center">
          <h1 className="font-serif text-4xl font-bold text-warm-white md:text-5xl">
            {t('reservation.title')}
          </h1>
          <p className="mt-2 font-sans text-warm-gray-light">
            {t('reservation.subtitle')}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <ReservationForm />
      </div>
    </>
  );
}
