import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Eye, Trash2, MessageCircle } from 'lucide-react';
import type { AxiosError } from 'axios';
import { reservationsApi } from '@/services/api';
import { DataTable, type Column } from './DataTable';
import { StatusBadge } from './StatusBadge';
import type { ReservationResponse, ReservationStatus, ApiError } from '@/types';

const STATUS_NEXT: Record<string, { label: string; status: ReservationStatus; color: string }[]> = {
  Pending: [
    { label: 'Confirm', status: 'Confirmed', color: 'text-green-700 hover:bg-green-50' },
    { label: 'Cancel', status: 'Cancelled', color: 'text-red-600 hover:bg-red-50' },
  ],
  Confirmed: [
    { label: 'Complete', status: 'Completed', color: 'text-blue-700 hover:bg-blue-50' },
    { label: 'Cancel', status: 'Cancelled', color: 'text-red-600 hover:bg-red-50' },
  ],
};

interface ReservationTableProps {
  reservations: ReservationResponse[];
  isLoading: boolean;
  onView: (r: ReservationResponse) => void;
  onDelete: (id: string) => void;
}

export function ReservationTable({ reservations, isLoading, onView, onDelete }: ReservationTableProps) {
  const qc = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReservationStatus }) =>
      reservationsApi.updateStatus(id, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['admin', 'reservations'] });
      const prev = qc.getQueryData<ReservationResponse[]>(['admin', 'reservations']);
      qc.setQueryData<ReservationResponse[]>(['admin', 'reservations'], old =>
        old?.map(r => r.id === id ? { ...r, status } : r) ?? []
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['admin', 'reservations'], ctx.prev);
      toast.error('Failed to update status');
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin', 'reservations'] }),
  });

  const columns: Column<ReservationResponse>[] = [
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      sortValue: r => r.customerName,
      render: r => <span className="font-medium">{r.customerName}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: r => <span className="text-charcoal-light text-xs">{r.phone}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      sortValue: r => r.date,
      render: r => r.date,
    },
    {
      key: 'time',
      header: 'Time',
      render: r => r.time,
    },
    {
      key: 'partySize',
      header: 'Guests',
      sortable: true,
      sortValue: r => r.partySize,
      render: r => r.partySize,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      sortValue: r => r.status,
      render: r => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: r => {
        const actions = STATUS_NEXT[r.status] ?? [];
        return (
          <div className="flex items-center gap-1">
            <button onClick={() => onView(r)} className="p-1.5 text-warm-gray hover:text-copper transition-colors rounded" title="View">
              <Eye className="h-4 w-4" />
            </button>
            <a
              href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-warm-gray hover:text-[#25D366] transition-colors rounded"
              title="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            {actions.map(action => (
              <button
                key={action.status}
                onClick={() => statusMutation.mutate({ id: r.id, status: action.status })}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${action.color}`}
                disabled={statusMutation.isPending}
              >
                {action.label}
              </button>
            ))}
            <button onClick={() => onDelete(r.id)} className="p-1.5 text-warm-gray hover:text-error transition-colors rounded" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={reservations}
      columns={columns}
      isLoading={isLoading}
      getKey={r => r.id}
      emptyMessage="No reservations match your filters."
    />
  );
}
