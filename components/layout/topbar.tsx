'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import { clearSession } from '@/app/actions/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';
import { Visual } from '@/components/ui/visual';
import { CommandPalette } from '@/components/layout/command-palette';
import type { SessionUser } from '@/lib/auth/session';

export function Topbar({ variant, user }: { variant: 'admin' | 'employee'; user: SessionUser }) {
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function logout() {
    startTransition(async () => {
      await signOut(auth).catch(() => undefined);
      await clearSession();
      router.replace('/login');
    });
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 px-4 py-3 backdrop-blur-2xl md:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="group relative hidden h-12 flex-1 items-center gap-3 rounded-3xl border border-slate-950/10 bg-white/72 px-3 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all hover:border-slate-950/20 hover:bg-white md:flex"
          >
            <Visual name="search" alt="Search" size={34} className="rounded-2xl" />
            <span className="text-sm text-muted-foreground">Search employees, assets, inventory, tickets...</span>
            <span className="ml-auto hidden items-center gap-1 rounded-xl border bg-muted px-2 py-1 text-xs text-muted-foreground lg:flex">Ctrl K</span>
          </button>

          <Badge variant={variant === 'admin' ? 'default' : 'secondary'}>{variant === 'admin' ? 'Admin' : 'Employee'}</Badge>
          <Button variant="outline" size="icon" aria-label="Notifications" className="rounded-2xl bg-white/75">
            <Visual name="notification" alt="Notifications" size={28} className="rounded-xl shadow-none" />
          </Button>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-950/10 bg-white/80 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-xs font-semibold text-white shadow-sm">{initials(user.name || user.email || 'User')}</div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{user.name || user.email || 'OfficeOS User'}</p>
              <p className="mt-1 text-xs text-muted-foreground">{user.title || user.department || (variant === 'admin' ? 'Administrator' : 'Employee')}</p>
            </div>
          </div>
          <Button onClick={logout} disabled={isPending} variant="ghost" size="icon" aria-label="Logout" className="rounded-2xl">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} variant={variant} />
    </>
  );
}
