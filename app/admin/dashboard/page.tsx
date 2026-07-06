import Link from 'next/link';

const activities = [
  ['New access request', 'Maya Chen · Design', 'Pending'],
  ['Asset assigned', 'MacBook Pro · Jordan Lee', 'Complete'],
  ['Ticket updated', 'Printer issue · Floor 3', 'Open']
];

export default function AdminDashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="shell">
        <nav className="nav"><Link className="brand" href="/"><span className="brand-mark">O</span><span>OfficeOS</span></Link><Link className="button button-secondary" href="/login">Sign out</Link></nav>
        <header className="page-head"><div><h1>Admin overview</h1><p>Your workspace is healthy and ready for the day.</p></div><button className="button button-primary" type="button">Add employee</button></header>
        <section className="cards">
          <div className="metric-card"><span>Active employees</span><strong>48</strong></div>
          <div className="metric-card"><span>Assigned assets</span><strong>126</strong></div>
          <div className="metric-card"><span>Open tickets</span><strong>7</strong></div>
          <div className="metric-card"><span>Low stock items</span><strong>3</strong></div>
        </section>
        <section className="content-grid">
          <div className="content-card"><h2>Recent activity</h2>{activities.map(([title, detail, status]) => <div className="activity" key={title}><span className="avatar" /><div><strong>{title}</strong><br /><small>{detail}</small></div><span className="badge">{status}</span></div>)}</div>
          <div className="content-card"><h2>Workspace pulse</h2><div className="chart">{[36, 54, 46, 78, 64, 89, 74].map((height, index) => <div className="bar" key={index} style={{ height: `${height}%` }} />)}</div></div>
        </section>
      </div>
    </main>
  );
}
