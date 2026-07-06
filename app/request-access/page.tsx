import Link from 'next/link';

export default function RequestAccessPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <Link className="brand" href="/"><span className="brand-mark">O</span><span>OfficeOS</span></Link>
        <h1>Request access</h1>
        <p>Send your details to the workspace administrator for approval.</p>
        <form>
          <div className="field"><label htmlFor="name">Full name</label><input id="name" type="text" autoComplete="name" placeholder="Your name" /></div>
          <div className="field"><label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" placeholder="you@company.com" /></div>
          <div className="field"><label htmlFor="department">Department</label><input id="department" type="text" placeholder="Operations" /></div>
          <div className="auth-actions"><button className="button button-primary" type="button">Submit request</button></div>
        </form>
        <div className="auth-note">Already approved? <Link href="/login"><strong>Sign in</strong></Link></div>
      </section>
    </main>
  );
}
