import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Visual } from '@/components/ui/visual';
import type { VisualName } from '@/lib/visuals';

export function EmptyState({
  icon: Icon,
  visual = 'empty',
  title,
  description,
  actionLabel,
  actionHref
}: {
  icon?: LucideIcon;
  visual?: VisualName;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="border-dashed bg-white/62">
      <CardContent className="flex flex-col items-center justify-center p-10 text-center">
        <Visual name={visual} alt="" size={84} className="rounded-[1.75rem]" />
        {Icon ? <span className="sr-only"><Icon className="h-1 w-1" /></span> : null}
        <h3 className="mt-5 text-base font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        {actionLabel && actionHref ? (
          <Button asChild className="mt-5" variant="outline">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
