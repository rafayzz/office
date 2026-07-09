'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation, employeeNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Visual } from '@/components/ui/visual';

export function Sidebar({ variant }: { variant: 'admin' | 'employee' }) {
  const pathname = usePathname();
  const navigation = variant === 'admin' ? adminNavigation : employeeNavigation;

  return (
    <aside className="hidden min-h-screen w-80 shrink-0 border-r border-white/60 bg-white/45 p-4 backdrop-blur-2xl lg:block">
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <Link
          href={variant === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
          className="group flex items-center gap-3 rounded-3xl px-3 py-3 transition-all hover:bg-slate-950/[0.03]"
        >
          <Visual name="logo" alt="OfficeOS" size={48} priority className="rounded-2xl" />
          <div className="min-w-0">
            <p className="font-semibold tracking-tight text-slate-950">OfficeOS</p>
            <p className="text-xs text-muted-foreground">{variant === 'admin' ? 'Admin Console' : 'Employee Portal'}</p>
          </div>
        </Link>

        <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-3xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-950/[0.04] hover:text-slate-950',
                  active && 'bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] hover:bg-slate-950 hover:text-white'
                )}
              >
                <Visual
                  name={item.visual}
                  alt=""
                  size={34}
                  className={cn('rounded-2xl ring-white/40 transition-transform duration-200 group-hover:scale-105', active && 'ring-white/20')}
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {active ? <span className="h-2 w-2 rounded-full bg-white/70" /> : null}
              </Link>
            );
          })}
        </nav>


      </div>
    </aside>
  );
}
