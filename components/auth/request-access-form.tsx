'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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

    startTransition(async () => {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });

        const base = {
          uid: credential.user.uid,
          name,
          email,
          department,
          role: 'employee',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', credential.user.uid), {
          ...base,
          title: 'Employee',
          location: 'Not added',
          phone: '',
          manager: ''
        });

        await setDoc(doc(db, 'employeeRequests', credential.user.uid), {
          uid: credential.user.uid,
          name,
          email,
          department,
          roleRequested: 'employee',
          reason,
          status: 'pending',
          requestedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        });

        await signOut(auth);
        toast.success('Access request submitted');
        router.replace('/pending-approval?submitted=1');
      } catch (err) {
        console.error(err);
        setError('Request could not be submitted. Confirm Firebase Auth email/password is enabled and Firestore rules are deployed.');
      }
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name"><Input name="name" placeholder="Your full name" required minLength={2} /></Field>
      <Field label="Company email"><Input name="email" type="email" placeholder="name@company.com" required /></Field>
      <Field label="Password"><Input name="password" type="password" placeholder="Create a secure password" required minLength={8} /></Field>
      <Field label="Department">
        <Select name="department" defaultValue="" required>
          <option value="" disabled>Select department</option>
          <option>Operations</option><option>Engineering</option><option>Finance</option><option>HR</option><option>Support</option><option>Marketing</option><option>Administration</option>
        </Select>
      </Field>
      <div className="sm:col-span-2"><Field label="Why do you need access?"><Textarea name="reason" placeholder="Briefly explain your access need..." required minLength={10} /></Field></div>
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
        <Button asChild variant="outline"><Link href="/pending-approval">Review approval status</Link></Button>
        <Button disabled={isPending}>{isPending ? 'Submitting request...' : 'Submit request'}</Button>
      </div>
    </form>
  );
}
