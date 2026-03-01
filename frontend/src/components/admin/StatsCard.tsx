import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
  pulse?: boolean;
}

export function StatsCard({ title, value, icon: Icon, iconColor, iconBg, subtitle, pulse }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white border border-warm-gray-light p-5 flex items-center gap-4 shadow-sm">
      <div className={cn('relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full', iconBg)}>
        <Icon className={cn('h-6 w-6', iconColor)} />
        {pulse && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-copper animate-ping" />
        )}
      </div>
      <div>
        <motion.p
          key={value}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-charcoal"
        >
          {value}
        </motion.p>
        <p className="text-sm text-warm-gray mt-0.5">{subtitle ?? title}</p>
      </div>
    </div>
  );
}
