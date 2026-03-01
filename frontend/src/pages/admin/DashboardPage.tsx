import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { CalendarDays, Clock, UtensilsCrossed, MessageSquare } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { ReservationChart } from '@/components/admin/ReservationChart';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { reservationsApi, menuItemsApi, contactMessagesApi } from '@/services/api';

export default function DashboardPage() {
  const { data: reservations = [] } = useQuery({
    queryKey: ['admin', 'reservations'],
    queryFn: reservationsApi.getAll,
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['admin', 'menuItems'],
    queryFn: menuItemsApi.getAll,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: contactMessagesApi.getAll,
  });

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayCount = reservations.filter(r => r.date === todayStr).length;
  const pendingCount = reservations.filter(r => r.status === 'Pending').length;
  const unreadCount = messages.filter(m => !m.isRead).length;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      label: format(date, 'EEE'),
      count: reservations.filter(r => r.date === dateStr).length,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Today's Reservations"
          value={todayCount}
          icon={CalendarDays}
          iconColor="text-copper"
          iconBg="bg-copper/10"
          subtitle="reservations today"
        />
        <StatsCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          subtitle="pending reservations"
        />
        <StatsCard
          title="Menu Items"
          value={menuItems.length}
          icon={UtensilsCrossed}
          iconColor="text-sage"
          iconBg="bg-sage/10"
          subtitle="total menu items"
        />
        <StatsCard
          title="Unread Messages"
          value={unreadCount}
          icon={MessageSquare}
          iconColor="text-copper"
          iconBg="bg-copper/10"
          subtitle="unread messages"
          pulse={unreadCount > 0}
        />
      </div>

      {/* Chart */}
      <ReservationChart data={last7Days} />

      {/* Recent Activity */}
      <RecentActivity reservations={reservations} messages={messages} />
    </div>
  );
}
