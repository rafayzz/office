import { ReactNode } from 'react';
import { Visual } from '@/components/ui/visual';
import type { VisualName } from '@/lib/visuals';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  visual = 'dashboard'
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  visual?: VisualName;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-6">
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-slate-950/[0.04] blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 gap-4">
          <Visual name={visual} alt="" size={58} priority className="hidden rounded-3xl md:inline-flex" />
          <div className="space-y-2">
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p> : null}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h1>
              {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
            </div>
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
