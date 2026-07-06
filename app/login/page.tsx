import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent } from '@/components/ui/card';
import { Visual } from '@/components/ui/visual';

export default function LoginPage() {
  return (
    <main className="office-grid flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <Visual name="logo" alt="OfficeOS" size={56} priority className="rounded-3xl ring-white/10" />
            <h1 className="mt-10 max-w-xl text-5xl font-semibold leading-tight tracking-tight">A secure operating layer for people, assets, inventory, and private office workflows.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/65">OfficeOS keeps access approval-gated, employee data separated, and operational work clear with production-grade privacy boundaries.</p>
          </div>
          <div className="relative grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Approval gated', visual: 'requests' as const },
              { label: 'Private tickets', visual: 'tickets' as const },
              { label: 'Asset history', visual: 'assets' as const }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white/75 backdrop-blur">
                <Visual name={item.visual} alt="" size={38} className="mb-3 rounded-2xl ring-white/10" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md rounded-[2.25rem]">
          <CardContent className="p-8">
            <div className="mx-auto flex justify-center"><Visual name="security" alt="Secure access" size={72} priority className="rounded-[1.75rem]" /></div>
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground">Use your approved company account to continue.</p>
            </div>
            <LoginForm />
            <div className="mt-6 rounded-3xl border border-slate-950/10 bg-white/62 p-4 text-sm text-muted-foreground">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-slate-950" /><p>Pending, rejected, and deactivated accounts remain blocked until an authorized administrator changes their status.</p></div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">Need access? <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/request-access">Request approval</Link></p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
