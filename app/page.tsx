import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main>
      <div className="shell">
        <nav className="nav" aria-label="Main navigation">
          <Link className="brand" href="/">
            <span className="brand-mark"><Building2 size={20} /></span>
            <span>OfficeOS</span>
          </Link>
          <div className="nav-links">
            <Link className="button button-secondary" href="/request-access">Request access</Link>
            <Link className="button button-primary" href="/login">Sign in</Link>
          </div>
        </nav>

        <section className="hero">
          <div>
            <span className="eyebrow">● Workspace operations, simplified</span>
            <h1>Run your office from one calm dashboard.</h1>
            <p>
              Manage people, assets, inventory, tickets, announcements, and daily operations without the spreadsheet sprawl.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/login">Open OfficeOS</Link>
              <Link className="button button-secondary" href="/request-access">Join your workspace</Link>
            </div>
          </div>

          <div className="preview" aria-label="OfficeOS dashboard preview">
            <div className="preview-top">
              <div className="dots"><span className="dot" /><span className="dot" /><span className="dot" /></div>
              <span className="status">All systems ready</span>
            </div>
            <div className="dashboard">
              <aside className="sidebar">
                <div className="side-pill active" />
                <div className="side-pill" />
                <div className="side-pill" />
                <div className="side-pill" />
                <div className="side-pill" />
              </aside>
              <div className="main-panel">
                <div className="panel-title" />
                <div className="stats">
                  <div className="stat"><div className="stat-label" /><div className="stat-value" /></div>
                  <div className="stat"><div className="stat-label" /><div className="stat-value" /></div>
                  <div className="stat"><div className="stat-label" /><div className="stat-value" /></div>
                </div>
                <div className="chart">
                  {[34, 54, 42, 75, 62, 88, 72, 96].map((height, index) => (
                    <div className="bar" key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" aria-label="Features">
          <article className="feature"><strong>People and access</strong><span>Approval-based onboarding with clear admin and employee roles.</span></article>
          <article className="feature"><strong>Assets and inventory</strong><span>Track equipment assignments separately from consumable stock.</span></article>
          <article className="feature"><strong>Requests and updates</strong><span>Keep tickets, announcements, and operational activity visible.</span></article>
        </section>
      </div>
    </main>
  );
}
