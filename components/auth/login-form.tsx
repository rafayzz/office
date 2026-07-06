'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { createSession } from '@/app/actions/auth';
import { auth, db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError('');
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    startTransition(async () => {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credential.user.getIdToken(true);
        await createSession(idToken);

        const token = await credential.user.getIdTokenResult(true);
        let role = token.claims.role as string | undefined;
        let status = token.claims.status as string | undefined;

        if (!role || !status) {
          const profile = await getDoc(doc(db, 'users', credential.user.uid));
          role = profile.data()?.role;
          status = profile.data()?.status;
        }

        if (status !== 'active') {
          router.replace('/pending-approval');
          return;
        }

        toast.success('Signed in securely');
        router.replace(role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
      } catch (err) {
        console.error(err);
        setError('Sign in failed. Check your email, password, approval status, and Firebase Admin environment variables.');
      }
    });
  }

  return (
    <form action={onSubmit} className="mt-8 space-y-4">
      <Input name="email" type="email" placeholder="name@company.com" autoComplete="email" required />
      <Input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <Button className="w-full" size="lg" disabled={isPending}>{isPending ? 'Checking secure access...' : 'Continue securely'}</Button>
      <Button asChild className="w-full" variant="outline" size="lg">
        <Link href="/request-access">Request access</Link>
      </Button>
    </form>
  );
}
