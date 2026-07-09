import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { RequestAccessForm } from '@/components/auth/request-access-form';

export default function RequestAccessPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card" style={{ maxWidth: '560px' }}>
        <Link className="brand" href="/"><span className="brand-mark"><Building2 size={20} /></span><span>OfficeOS</span></Link>
        <h1>Request access</h1>
        <p>Create your account and send your details to the workspace administrator for approval.</p>
        <RequestAccessForm />
        <div className="auth-note">Already approved? <Link href="/login"><strong>Sign in</strong></Link></div>
      </section>
    </main>
  );
}
