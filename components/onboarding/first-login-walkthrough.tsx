'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Visual } from '@/components/ui/visual';

const copy = {
  admin: {
    title: 'Welcome to your operations console',
    description: 'Start by approving employee access, adding trackable assets, then loading quantity-based inventory. Sensitive tickets stay private between employees and admins.',
    steps: ['Approve access requests', 'Create assets and assign ownership', 'Load office inventory stock', 'Review tickets, reports, and settings']
  },
  employee: {
    title: 'Welcome to your employee portal',
    description: 'Your workspace is focused on your assigned assets, private tickets, company announcements, and profile details.',
    steps: ['Review your assigned assets', 'Create private tickets when needed', 'Read published announcements', 'Keep your profile details accurate']
  }
};

export function FirstLoginWalkthrough({ variant, name }: { variant: 'admin' | 'employee'; name?: string }) {
  const [open, setOpen] = useState(false);
  const storageKey = `officeos-walkthrough-${variant}`;

  useEffect(() => {
    if (window.localStorage.getItem(storageKey) !== 'done') setOpen(true);
  }, [storageKey]);

  if (!open) return null;

  const item = copy[variant];

  function close() {
    window.localStorage.setItem(storageKey, 'done');
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl overflow-hidden rounded-[2.25rem] border-white/70 bg-white/95 shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[220px_1fr] md:p-7">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-5 text-white">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <Visual name={variant === 'admin' ? 'dashboard' : 'profile'} alt="OfficeOS welcome" size={140} priority className="relative mx-auto rounded-[2rem] ring-white/10" />
            <p className="relative mt-5 text-sm text-white/70">First-time walkthrough</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{name ? `Hello ${name}` : 'OfficeOS'}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
            <div className="mt-5 grid gap-3">
              {item.steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-slate-950/10 bg-white/80 p-3 text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-950 text-xs font-semibold text-white">{index + 1}</span>
                  <span className="font-medium text-slate-700">{step}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" onClick={close}>Enter workspace</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
