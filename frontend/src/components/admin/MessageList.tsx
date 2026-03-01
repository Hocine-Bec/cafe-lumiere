import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';
import type { ContactMessageResponse } from '@/types';

interface MessageListProps {
  messages: ContactMessageResponse[];
  selectedId?: string;
  onSelect: (message: ContactMessageResponse) => void;
  tab: 'all' | 'unread';
  onTabChange: (tab: 'all' | 'unread') => void;
}

export function MessageList({ messages, selectedId, onSelect, tab, onTabChange }: MessageListProps) {
  const filtered = tab === 'unread' ? messages.filter(m => !m.isRead) : messages;
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-warm-gray-light">
        {(['all', 'unread'] as const).map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={cn(
              'flex-1 py-3 text-sm font-medium capitalize transition-colors',
              tab === t ? 'text-copper border-b-2 border-copper -mb-px' : 'text-warm-gray hover:text-charcoal'
            )}
          >
            {t === 'all' ? 'All' : 'Unread'}
            {t === 'unread' && messages.filter(m => !m.isRead).length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-copper text-warm-white text-xs h-4 min-w-4 px-1">
                {messages.filter(m => !m.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto divide-y divide-warm-gray-light">
        {sorted.length === 0 ? (
          <p className="p-6 text-sm text-warm-gray text-center">No messages.</p>
        ) : (
          sorted.map(m => (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              className={cn(
                'w-full text-left px-4 py-3 transition-colors flex items-start gap-3',
                selectedId === m.id ? 'bg-cream-dark' : 'hover:bg-cream'
              )}
            >
              <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', m.isRead ? 'bg-transparent' : 'bg-copper')} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={cn('text-sm truncate', m.isRead ? 'text-charcoal' : 'font-semibold text-charcoal')}>
                    {m.name}
                  </p>
                  <span className="shrink-0 text-xs text-warm-gray">
                    {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-warm-gray truncate">{m.subject}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
