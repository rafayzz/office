import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <Link className="brand" href="/"><span className="brand-mark">O</span><span>OfficeOS</span></Link>
        <h1>Welcome back</h1>
        <p>Sign in with your approved workspace account.</p>
        <form>
          <div className="field"><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" placeholder="you@company.com" /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" /></div>
          <div className="auth-actions">
            <Link className="button button-primary" href="/employee/dashboard">Continue as employee</Link>
            <Link className="button button-secondary" href="/admin/dashboard">Preview admin dashboard</Link>
          </div>
        </form>
        <div className="auth-note">Need an account? <Link href="/request-access"><strong>Request access</strong></Link></div>
      </section>
    </main>
  );
}
