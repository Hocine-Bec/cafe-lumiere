import { cn } from '@/utils/cn';
import { useLanguage } from '@/hooks/useLanguage';

interface ProgressIndicatorProps {
  currentStep: number; // 1-indexed
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const { t } = useLanguage();
  const STEPS = [t('reservation.step1'), t('reservation.step2'), t('reservation.step3')];

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, idx) => {
        const step = idx + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={idx} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  isDone
                    ? 'border-copper bg-copper text-warm-white'
                    : isActive
                      ? 'border-copper bg-warm-white text-copper'
                      : 'border-warm-gray-light bg-warm-white text-warm-gray'
                )}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-copper' : 'text-warm-gray'
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-2 mb-5 h-px w-12 sm:w-20 transition-colors',
                  step < currentStep ? 'bg-copper' : 'bg-warm-gray-light'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
