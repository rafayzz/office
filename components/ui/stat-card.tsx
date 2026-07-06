import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Visual } from '@/components/ui/visual';
import type { VisualName } from '@/lib/visuals';
import { cn } from '@/lib/utils';

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  visual = 'reports',
  tone = 'neutral'
}: {
  title: string;
  value: string | number;
  helper: string;
  icon?: LucideIcon;
  visual?: VisualName;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const accentClass = {
    neutral: 'from-slate-950/[0.08] to-transparent',
    success: 'from-emerald-500/[0.12] to-transparent',
    warning: 'from-amber-500/[0.16] to-transparent',
    danger: 'from-red-500/[0.12] to-transparent'
  }[tone];

  return (
    <Card className="card-hover relative overflow-hidden">
      <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-b', accentClass)} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
          </div>
          <Visual name={visual} alt="" size={54} className="rounded-3xl" />
          {Icon ? <span className="sr-only"><Icon className="h-1 w-1" /></span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
