import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { TIME_SLOTS, PARTY_SIZE_OPTIONS } from '@/utils/constants';
import { useLanguage } from '@/hooks/useLanguage';
import type { ReservationFormData } from './ReservationForm';

interface DateTimeStepProps {
  onNext: () => void;
}

export function DateTimeStep({ onNext }: DateTimeStepProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ReservationFormData>();
  const { t } = useLanguage();
  const selectedTime = watch('time');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Date */}
      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-sm font-medium text-charcoal">
          {t('reservation.selectDate')}
        </label>
        <input
          id="date"
          type="date"
          min={today}
          className={cn(
            'w-full rounded-md border bg-cream px-3.5 py-2.5 text-sm text-charcoal',
            'focus:outline-none focus:ring-2 focus:ring-copper focus:border-copper transition-colors',
            errors.date ? 'border-error' : 'border-warm-gray-light'
          )}
          {...register('date')}
        />
        {errors.date && <p className="text-xs text-error">{errors.date.message}</p>}
      </div>

      {/* Time slots */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-charcoal">{t('reservation.selectTime')}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setValue('time', slot, { shouldValidate: true })}
              className={cn(
                'rounded-lg border px-2 py-2 text-xs font-medium transition-colors',
                selectedTime === slot
                  ? 'border-copper bg-copper text-warm-white'
                  : 'border-warm-gray-light bg-cream text-charcoal hover:border-copper'
              )}
            >
              {slot}
            </button>
          ))}
        </div>
        {errors.time && <p className="text-xs text-error">{errors.time.message}</p>}
      </div>

      {/* Party size */}
      <div className="flex flex-col gap-2">
        <label htmlFor="partySize" className="text-sm font-medium text-charcoal">
          {t('reservation.partySize')}
        </label>
        <select
          id="partySize"
          className={cn(
            'w-full rounded-md border bg-cream px-3.5 py-2.5 text-sm text-charcoal',
            'focus:outline-none focus:ring-2 focus:ring-copper focus:border-copper transition-colors',
            'border-warm-gray-light'
          )}
          {...register('partySize', { valueAsNumber: true })}
        >
          {PARTY_SIZE_OPTIONS.map(n => (
            <option key={n} value={n}>
              {n} {n === 1 ? t('reservation.guest') : t('reservation.guests')}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-md bg-copper px-7 py-3 font-medium text-warm-white transition-colors hover:bg-copper-dark"
      >
        {t('reservation.next')}
      </button>
    </div>
  );
}
