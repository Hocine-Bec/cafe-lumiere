import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import type { AxiosError } from 'axios';
import { contactMessagesApi } from '@/services/api';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MessageList } from '@/components/admin/MessageList';
import { MessageDetail } from '@/components/admin/MessageDetail';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { cn } from '@/utils/cn';
import type { ContactMessageResponse, ApiError } from '@/types';

export default function ContactMessagesPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [selected, setSelected] = useState<ContactMessageResponse | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });

  const { data: messages = [] } = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: contactMessagesApi.getAll,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => contactMessagesApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactMessagesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'messages'] });
      toast.success('Message deleted');
      setDeleteDialog({ open: false });
      if (selected?.id === deleteDialog.id) {
        setSelected(null);
        setMobileView('list');
      }
    },
    onError: (e: AxiosError<ApiError>) => toast.error(e.response?.data?.detail ?? 'Failed to delete'),
  });

  function handleSelect(message: ContactMessageResponse) {
    setSelected(message);
    setMobileView('detail');
    if (!message.isRead) {
      markReadMutation.mutate(message.id);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 shrink-0">
        <AdminPageHeader title="Messages" />
      </div>

      <div className="flex flex-1 overflow-hidden mx-6 mb-6 rounded-xl border border-warm-gray-light bg-white shadow-sm">
        {/* Left panel — message list */}
        <div
          className={cn(
            'w-full md:max-w-xs md:shrink-0 border-r border-warm-gray-light flex-col overflow-hidden',
            mobileView === 'detail' ? 'hidden md:flex' : 'flex'
          )}
        >
          <MessageList
            messages={messages}
            selectedId={selected?.id}
            onSelect={handleSelect}
            tab={tab}
            onTabChange={setTab}
          />
        </div>

        {/* Right panel — message detail */}
        <div
          className={cn(
            'flex-col overflow-hidden flex-1',
            mobileView === 'detail' ? 'flex' : 'hidden md:flex'
          )}
        >
          {/* Back button — mobile only */}
          {selected && (
            <button
              onClick={() => setMobileView('list')}
              className="flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium text-copper border-b border-warm-gray-light md:hidden hover:bg-cream transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to messages
            </button>
          )}
          <MessageDetail
            message={selected}
            onDelete={id => setDeleteDialog({ open: true, id })}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={() => deleteDialog.id && deleteMutation.mutate(deleteDialog.id)}
        title="Delete Message"
        message="Are you sure you want to delete this message? This cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
