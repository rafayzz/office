'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { adminNavigation, employeeNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Visual } from '@/components/ui/visual';
import { Input } from '@/components/ui/input';

export function CommandPalette({
  open,
  onOpenChange,
  variant
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: 'admin' | 'employee';
}) {
  const [query, setQuery] = useState('');
  const navigation = variant === 'admin' ? adminNavigation : employeeNavigation;

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onOpenChange(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return navigation;
    return navigation.filter((item) => `${item.label} ${item.description ?? ''}`.toLowerCase().includes(value));
  }, [navigation, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/35 p-4 backdrop-blur-sm" onMouseDown={() => onOpenChange(false)}>
      <div
        className="mx-auto mt-20 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/94 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-950/10 p-4">
          <Visual name="command" alt="Command search" size={42} className="rounded-2xl" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, workflows, and secure areas..."
            className="h-12 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <kbd className="rounded-xl border bg-muted px-2 py-1 text-xs text-muted-foreground">Esc</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {filtered.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className={cn('flex items-center gap-3 rounded-3xl p-3 transition-all hover:bg-slate-950/[0.04]')}
            >
              <Visual name={item.visual} alt="" size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description ?? 'Open workspace page'}</p>
              </div>
              <span className="text-xs text-muted-foreground">Open</span>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <Visual name="empty" alt="No results" size={74} />
              <p className="mt-4 text-sm font-semibold">No matching workspace page</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
