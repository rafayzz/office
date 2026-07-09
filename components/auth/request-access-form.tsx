'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, deleteUser, signOut, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  const message = err instanceof Error ? err.message : String(err);

  if (code === 'auth/email-already-in-use') return 'This email is already registered. Try signing in instead.';
  if (code === 'auth/operation-not-allowed') return 'Email/password sign-up is not enabled. Contact your administrator.';
  if (code === 'auth/configuration-not-found') return 'Firebase Auth is not configured. Contact your administrator.';
  if (code === 'auth/weak-password') return 'Password must be at least 8 characters.';
  if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
  if (code === 'permission-denied' || code === 'firestore/permission-denied') return 'Firestore permission denied — check your security rules are deployed.';
  if (message) return message;
  return 'An unknown error occurred. Please try again.';
}

export function RequestAccessForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError('');
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const department = String(formData.get('department') || '').trim();
    const reason = String(formData.get('reason') || '').trim();

    if (!name || !email || !password || !department || !reason) {
      setError('All fields are required.');
      return;
    }

    startTransition(async () => {
      let createdUser = null;
      try {
        // Step 1: Create Firebase Auth user
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        createdUser = credential.user;
        await updateProfile(createdUser, { displayName: name });

        const uid = createdUser.uid;
        const now = serverTimestamp();

        // Step 2: Write user profile
        await setDoc(doc(db, 'users', uid), {
          uid,
          name,
          email,
          department,
          role: 'employee',
          status: 'pending',
          title: 'Employee',
          location: 'Not added',
          phone: '',
          manager: '',
          createdAt: now,
          updatedAt: now
        });

        // Step 3: Write access request (doc ID must equal uid — enforced by Firestore rules)
        await setDoc(doc(db, 'employeeRequests', uid), {
          uid,
          name,
          email,
          department,
          roleRequested: 'employee',
          reason,
          status: 'pending',
          requestedAt: now,
          createdAt: now
        });

        // Step 4: Sign out so they can't access protected routes while pending
        await signOut(auth);
        toast.success('Access request submitted — awaiting admin approval.');
        router.replace('/pending-approval?submitted=1');
      } catch (err) {
        console.error('[RequestAccess]', err);

        // If user was created in Auth but Firestore failed, clean up the orphaned Auth account
        // so they can retry without hitting "email already in use"
        if (createdUser) {
          try { await deleteUser(createdUser); } catch { /* best-effort cleanup */ }
          try { await signOut(auth); } catch { /* best-effort */ }
        }

        setError(friendlyError(err));
      }
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name">
        <Input name="name" placeholder="Your full name" required minLength={2} />
      </Field>
      <Field label="Company email">
        <Input name="email" type="email" placeholder="name@company.com" required />
      </Field>
      <Field label="Password">
        <Input name="password" type="password" placeholder="Create a secure password (8+ chars)" required minLength={8} />
      </Field>
      <Field label="Department">
        <Select name="department" defaultValue="" required>
          <option value="" disabled>Select department</option>
          <option>Operations</option>
          <option>Engineering</option>
          <option>Finance</option>
          <option>HR</option>
          <option>Support</option>
          <option>Marketing</option>
          <option>Administration</option>
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Why do you need access?">
          <Textarea name="reason" placeholder="Briefly explain your access need..." required minLength={10} />
        </Field>
      </div>

      {error ? (
        <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold mb-1">Could not submit request</p>
          <p className="text-red-700">{error}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/pending-approval">Review approval status</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting…' : 'Submit request'}
        </Button>
      </div>
    </form>
  );
}
