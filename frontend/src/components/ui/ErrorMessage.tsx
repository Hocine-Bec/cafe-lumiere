import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-error/30 bg-error/5 p-6 text-center">
      <AlertCircle className="h-8 w-8 text-error" />
      <p className="text-sm text-charcoal">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
