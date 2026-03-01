import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-charcoal">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full rounded-md border bg-cream px-3.5 py-2.5 text-sm text-charcoal',
          'placeholder:text-warm-gray',
          'focus:outline-none focus:ring-2 focus:ring-copper focus:border-copper',
          'transition-colors',
          error
            ? 'border-error focus:ring-error focus:border-error'
            : 'border-warm-gray-light',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error">{error}</p>
      )}
    </div>
  );
}
