import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import type { AxiosError } from 'axios';
import { reservationsApi } from '@/services/api';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ReservationTable } from '@/components/admin/ReservationTable';
import { ReservationDetailModal } from '@/components/admin/ReservationDetailModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { ReservationResponse, ReservationStatus, ApiError } from '@/types';

const STATUS_OPTIONS: { label: string; value: ReservationStatus | '' }[] = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Completed', value: 'Completed' },
];

const inputClass = 'rounded-md border border-warm-gray-light bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-copper focus:border-copper transition-colors';

export default function ReservationManagementPage() {
  const qc = useQueryClient();
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [search, setSearch] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<ReservationResponse | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['admin', 'reservations'],
    queryFn: reservationsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reservationsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reservations'] });
      toast.success('Reservation deleted');
      setDeleteDialog({ open: false });
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to delete'),
  });

  const filtered = reservations
    .filter(r => !dateFilter || r.date === dateFilter)
    .filter(r => !statusFilter || r.status === statusFilter)
    .filter(r => !search || r.customerName.toLowerCase().includes(search.toLowerCase()));

  const hasFilters = dateFilter || statusFilter || search;

  return (
    <div className="p-6">
      <AdminPageHeader title="Reservations" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className={inputClass}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ReservationStatus | '')}
          className={inputClass}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name…"
          className={inputClass}
        />
        {hasFilters && (
          <button
            onClick={() => { setDateFilter(''); setStatusFilter(''); setSearch(''); }}
            className="flex items-center gap-1 text-xs text-warm-gray hover:text-charcoal transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      <ReservationTable
        reservations={filtered}
        isLoading={isLoading}
        onView={setSelectedReservation}
        onDelete={id => setDeleteDialog({ open: true, id })}
      />

      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={() => deleteDialog.id && deleteMutation.mutate(deleteDialog.id)}
        title="Delete Reservation"
        message="Are you sure you want to delete this reservation? This cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
