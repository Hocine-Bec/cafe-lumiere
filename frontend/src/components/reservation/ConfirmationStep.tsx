import { useFormContext } from 'react-hook-form';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReservationFormData } from './ReservationForm';

interface ConfirmationStepProps {
  onBack: () => void;
  isSubmitting: boolean;
}

export function ConfirmationStep({ onBack, isSubmitting }: ConfirmationStepProps) {
  const { watch } = useFormContext<ReservationFormData>();
  const { t } = useLanguage();
  const values = watch();

  const rows: [string, string][] = [
    [t('reservation.date'), values.date],
    [t('reservation.time'), values.time],
    [t('reservation.partySize'), `${values.partySize} ${values.partySize === 1 ? t('reservation.guest') : t('reservation.guests')}`],
    [t('reservation.name'), values.customerName],
    [t('reservation.phone'), values.phone],
    ...(values.email ? [[t('reservation.email'), values.email] as [string, string]] : []),
    ...(values.specialRequests ? [[t('reservation.specialRequests'), values.specialRequests] as [string, string]] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary card */}
      <div className="rounded-xl border border-warm-gray-light bg-cream p-6">
        <h3 className="font-serif text-lg font-semibold text-charcoal mb-4">
          {t('reservation.summary')}
        </h3>
        <dl className="flex flex-col gap-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <dt className="text-warm-gray">{label}</dt>
              <dd className="font-medium text-charcoal text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 rounded-md border border-warm-gray-light px-7 py-3 text-sm font-medium text-charcoal transition-colors hover:border-copper hover:text-copper disabled:opacity-50"
        >
          {t('reservation.back')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-copper px-7 py-3 font-medium text-warm-white transition-colors hover:bg-copper-dark disabled:opacity-50"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          {t('reservation.confirmReservation')}
        </button>
      </div>
    </div>
  );
}
