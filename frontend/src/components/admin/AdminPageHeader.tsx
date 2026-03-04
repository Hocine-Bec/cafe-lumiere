import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminPageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function AdminPageHeader({ title, action }: AdminPageHeaderProps) {
  const Icon = action?.icon ?? Plus;
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-charcoal">{title}</h1>
      {action && (
        <Button onClick={action.onClick} size="sm">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{action.label}</span>
        </Button>
      )}
    </div>
  );
}
