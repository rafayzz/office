import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { FirstLoginWalkthrough } from '@/components/onboarding/first-login-walkthrough';
import type { SessionUser } from '@/lib/auth/session';

export function AppShell({ children, variant, user }: { children: ReactNode; variant: 'admin' | 'employee'; user: SessionUser }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar variant={variant} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar variant={variant} user={user} />
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 pb-28 md:px-6 lg:pb-8">
          <div className="reveal-in space-y-6">{children}</div>
        </main>
      </div>
      <MobileNav variant={variant} />
      <FirstLoginWalkthrough variant={variant} name={user.name} />
    </div>
  );
}
