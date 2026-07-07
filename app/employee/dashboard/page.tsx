import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function EmployeeDashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="shell">
        <nav className="nav"><Link className="brand" href="/"><span className="brand-mark"><Building2 size={20} /></span><span>OfficeOS</span></Link><Link className="button button-secondary" href="/login">Sign out</Link></nav>
        <header className="page-head"><div><h1>Good morning</h1><p>Everything you need for your workday is here.</p></div><button className="button button-primary" type="button">Create ticket</button></header>
        <section className="cards">
          <div className="metric-card"><span>Assigned assets</span><strong>4</strong></div>
          <div className="metric-card"><span>Open tickets</span><strong>2</strong></div>
          <div className="metric-card"><span>Announcements</span><strong>5</strong></div>
          <div className="metric-card"><span>Notifications</span><strong>3</strong></div>
        </section>
        <section className="content-grid">
          <div className="content-card"><h2>My assets</h2><div className="activity"><span className="avatar" /><div><strong>MacBook Pro 14-inch</strong><br /><small>Asset OS-1024 · Active</small></div><span className="badge">Assigned</span></div><div className="activity"><span className="avatar" /><div><strong>Studio Display</strong><br /><small>Asset OS-0861 · Active</small></div><span className="badge">Assigned</span></div></div>
          <div className="content-card"><h2>Latest announcement</h2><p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.7 }}>The office will host a team breakfast this Friday at 9:00 AM in the main lounge.</p></div>
        </section>
      </div>
    </main>
  );
}
