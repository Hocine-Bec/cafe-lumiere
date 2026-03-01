import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import type { ReservationResponse, ContactMessageResponse } from '@/types';

interface RecentActivityProps {
  reservations: ReservationResponse[];
  messages: ContactMessageResponse[];
}

export function RecentActivity({ reservations, messages }: RecentActivityProps) {
  const navigate = useNavigate();

  const recentReservations = [...reservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recent Reservations */}
      <div className="rounded-xl bg-white border border-warm-gray-light shadow-sm">
        <div className="px-5 py-4 border-b border-warm-gray-light flex items-center justify-between">
          <h3 className="font-semibold text-charcoal">Recent Reservations</h3>
          <button onClick={() => navigate('/admin/reservations')} className="text-xs text-copper hover:underline">
            View all
          </button>
        </div>
        <div className="divide-y divide-warm-gray-light">
          {recentReservations.length === 0 ? (
            <p className="px-5 py-4 text-sm text-warm-gray">No reservations yet.</p>
          ) : (
            recentReservations.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{r.customerName}</p>
                  <p className="text-xs text-warm-gray">{r.date} · {r.time} · {r.partySize} guests</p>
                </div>
                <StatusBadge status={r.status} size="sm" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="rounded-xl bg-white border border-warm-gray-light shadow-sm">
        <div className="px-5 py-4 border-b border-warm-gray-light flex items-center justify-between">
          <h3 className="font-semibold text-charcoal">Recent Messages</h3>
          <button onClick={() => navigate('/admin/messages')} className="text-xs text-copper hover:underline">
            View all
          </button>
        </div>
        <div className="divide-y divide-warm-gray-light">
          {recentMessages.length === 0 ? (
            <p className="px-5 py-4 text-sm text-warm-gray">No messages yet.</p>
          ) : (
            recentMessages.map(m => (
              <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                <div className={`h-2 w-2 shrink-0 rounded-full ${m.isRead ? 'bg-transparent' : 'bg-copper'}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${m.isRead ? 'text-charcoal' : 'font-semibold text-charcoal'}`}>
                    {m.name}
                  </p>
                  <p className="text-xs text-warm-gray truncate">{m.subject}</p>
                </div>
                <span className="shrink-0 text-xs text-warm-gray">
                  {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
