import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Menu', to: '/admin/menu', icon: UtensilsCrossed },
  { label: 'Reservations', to: '/admin/reservations', icon: CalendarCheck },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
];

export function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col bg-charcoal text-warm-gray-light">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-charcoal-light">
        <span className="font-serif text-lg font-semibold text-warm-white">
          Café Lumière
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors mb-1',
                isActive
                  ? 'bg-copper text-warm-white'
                  : 'hover:bg-charcoal-light hover:text-warm-white'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-charcoal-light p-4">
        {user && (
          <p className="mb-2 text-xs text-warm-gray-dark truncate">
            {user.fullName}
          </p>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-warm-gray-light hover:bg-charcoal-light hover:text-warm-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
