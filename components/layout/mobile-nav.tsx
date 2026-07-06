'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation, employeeNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Visual } from '@/components/ui/visual';

export function MobileNav({ variant }: { variant: 'admin' | 'employee' }) {
  const pathname = usePathname();
  const navigation = variant === 'admin' ? adminNavigation : employeeNavigation;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[1.75rem] border border-white/70 bg-white/90 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl lg:hidden">
      <div className="flex items-center gap-1 overflow-x-auto">
        {navigation.slice(0, 5).map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-[76px] flex-1 flex-col items-center gap-1.5 rounded-3xl px-2 py-2 text-[11px] font-medium text-slate-500 transition-all',
                active && 'bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]'
              )}
            >
              <Visual name={item.visual} alt="" size={28} className="rounded-xl" />
              <span className="line-clamp-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
