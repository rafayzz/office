'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { createSession } from '@/app/actions/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent, targetRoute: string) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await createSession(idToken);
      router.push(targetRoute);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <Link className="brand" href="/"><span className="brand-mark">O</span><span>OfficeOS</span></Link>
        <h1>Welcome back</h1>
        <p>Sign in with your approved workspace account.</p>
        <form onSubmit={(e) => handleLogin(e, '/employee/dashboard')}>
          <div className="field">
            <label htmlFor="email">Work email</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <div className="auth-actions">
            <button type="submit" className="button button-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Continue as employee'}
            </button>
            <button type="button" className="button button-secondary" onClick={(e) => handleLogin(e, '/admin/dashboard')} disabled={isLoading}>
              Preview admin dashboard
            </button>
          </div>
        </form>
        <div className="auth-note">Need an account? <Link href="/request-access"><strong>Request access</strong></Link></div>
      </section>
    </main>
  );
}
