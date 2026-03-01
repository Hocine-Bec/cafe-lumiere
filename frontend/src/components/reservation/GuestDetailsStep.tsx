import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReservationFormData } from './ReservationForm';

interface GuestDetailsStepProps {
  onBack: () => void;
  onNext: () => void;
}

export function GuestDetailsStep({ onBack, onNext }: GuestDetailsStepProps) {
  const { register, formState: { errors } } = useFormContext<ReservationFormData>();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <Input
        id="customerName"
        label={t('reservation.fullName')}
        placeholder={t('reservation.placeholderName')}
        error={errors.customerName?.message}
        {...register('customerName')}
      />
      <Input
        id="phone"
        label={t('reservation.phoneLabel')}
        placeholder={t('reservation.placeholderPhone')}
        type="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Input
        id="email"
        label={t('reservation.emailOptional')}
        placeholder={t('reservation.placeholderEmail')}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Textarea
        id="specialRequests"
        label={t('reservation.specialRequests')}
        placeholder={t('reservation.placeholderRequests')}
        rows={4}
        error={errors.specialRequests?.message}
        {...register('specialRequests')}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-md border border-warm-gray-light px-7 py-3 text-sm font-medium text-charcoal transition-colors hover:border-copper hover:text-copper"
        >
          {t('reservation.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-md bg-copper px-7 py-3 font-medium text-warm-white transition-colors hover:bg-copper-dark"
        >
          {t('reservation.review')}
        </button>
      </div>
    </div>
  );
}
