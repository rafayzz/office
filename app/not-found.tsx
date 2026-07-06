import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-lg text-center">
        <CardContent className="space-y-5 p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">404</div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">This OfficeOS route does not exist or has moved.</p>
          </div>
          <Button asChild>
            <Link href="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
