import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RequestAccessForm } from '@/components/auth/request-access-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Visual } from '@/components/ui/visual';

export default function RequestAccessPage() {
  return (
    <main className="office-grid flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-2xl rounded-[2.25rem]">
        <CardHeader className="p-8 pb-0">
          <Button asChild variant="ghost" className="mb-4 w-fit px-0"><Link href="/login"><ArrowLeft className="h-4 w-4" /> Back to login</Link></Button>
          <div className="flex items-start gap-4">
            <Visual name="requests" alt="Access request" size={58} priority className="rounded-3xl" />
            <div>
              <CardTitle className="text-2xl">Request OfficeOS access</CardTitle>
              <CardDescription className="mt-2">Create your company account. It stays pending until an administrator approves it.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8"><RequestAccessForm /></CardContent>
      </Card>
    </main>
  );
}
