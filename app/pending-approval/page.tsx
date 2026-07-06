import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Visual } from '@/components/ui/visual';

export default function PendingApprovalPage() {
  return (
    <main className="office-grid flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-lg rounded-[2.25rem] text-center">
        <CardContent className="p-8">
          <div className="mx-auto flex justify-center">
            <Visual name="requests" alt="Pending approval" size={86} priority className="rounded-[1.75rem]" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Access request received</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your account is waiting for administrator approval. You will not be able to access OfficeOS until your status is changed to active.
          </p>
          <div className="mt-6 rounded-3xl border border-slate-950/10 bg-white/62 p-4 text-left text-sm text-muted-foreground">
            <div className="flex gap-3">
              <MailCheck className="mt-0.5 h-4 w-4 text-slate-950" />
              <p>Contact your office administrator if this approval is urgent.</p>
            </div>
          </div>
          <Button asChild className="mt-6 w-full" variant="outline">
            <Link href="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
