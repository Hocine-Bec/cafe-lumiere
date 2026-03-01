import { format } from 'date-fns';
import { Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ContactMessageResponse } from '@/types';

interface MessageDetailProps {
  message: ContactMessageResponse | null;
  onDelete: (id: string) => void;
}

export function MessageDetail({ message, onDelete }: MessageDetailProps) {
  if (!message) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-sm text-warm-gray">Select a message to read</p>
      </div>
    );
  }

  const replyHref = `mailto:${message.email}?subject=Re%3A%20${encodeURIComponent(message.subject)}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-warm-gray-light px-6 py-4">
        <h2 className="text-base font-semibold text-charcoal truncate">{message.subject}</h2>
        <div className="mt-1 flex items-center gap-2 text-sm text-warm-gray">
          <span className="font-medium text-charcoal-light">{message.name}</span>
          <span>·</span>
          <a href={`mailto:${message.email}`} className="hover:text-copper transition-colors">
            {message.email}
          </a>
          <span>·</span>
          <span>{format(new Date(message.createdAt), 'MMM d, yyyy, h:mm a')}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="text-sm text-charcoal whitespace-pre-wrap leading-relaxed">{message.message}</p>
      </div>

      {/* Actions */}
      <div className="border-t border-warm-gray-light px-6 py-4 flex items-center gap-3">
        <a href={replyHref}>
          <Button size="sm" className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            Reply via Email
          </Button>
        </a>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(message.id)}
          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
