import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { reservationsApi } from '@/services/api';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/Button';
import type { ReservationResponse, ReservationStatus, ApiError } from '@/types';

interface ReservationDetailModalProps {
  reservation: ReservationResponse | null;
  onClose: () => void;
}

const STATUS_ACTIONS: Record<string, { label: string; status: ReservationStatus; variant: 'primary' | 'danger' }[]> = {
  Pending: [
    { label: 'Confirm', status: 'Confirmed', variant: 'primary' },
    { label: 'Cancel', status: 'Cancelled', variant: 'danger' },
  ],
  Confirmed: [
    { label: 'Mark Complete', status: 'Completed', variant: 'primary' },
    { label: 'Cancel', status: 'Cancelled', variant: 'danger' },
  ],
};

export function ReservationDetailModal({ reservation, onClose }: ReservationDetailModalProps) {
  const qc = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) =>
      reservationsApi.updateStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reservations'] });
      toast.success('Status updated');
      onClose();
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Update failed'),
  });

  if (!reservation) return null;

  const actions = STATUS_ACTIONS[reservation.status] ?? [];
  const whatsappUrl = `https://wa.me/${reservation.phone.replace(/[^0-9]/g, '')}`;

  const rows: [string, string][] = [
    ['Customer', reservation.customerName],
    ['Phone', reservation.phone],
    ['Date', reservation.date],
    ['Time', reservation.time],
    ['Party Size', `${reservation.partySize} ${reservation.partySize === 1 ? 'guest' : 'guests'}`],
    ...(reservation.email ? [['Email', reservation.email] as [string, string]] : []),
    ...(reservation.specialRequests ? [['Special Requests', reservation.specialRequests] as [string, string]] : []),
    ['Created', new Date(reservation.createdAt).toLocaleString()],
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray-light">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-charcoal">Reservation Detail</h2>
              <StatusBadge status={reservation.status} />
            </div>
            <button onClick={onClose} className="text-warm-gray hover:text-charcoal transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <dl className="flex flex-col gap-3 mb-6">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-warm-gray shrink-0">{label}</dt>
                  <dd className="font-medium text-charcoal text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-2">
              {actions.length > 0 && (
                <div className="flex gap-2">
                  {actions.map(action => (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      size="sm"
                      isLoading={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: reservation.id, status: action.status })}
                      className="flex-1"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-4 w-4" />
                Reply on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
