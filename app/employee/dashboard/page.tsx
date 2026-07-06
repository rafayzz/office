import Link from 'next/link';
import { Plus } from 'lucide-react';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionGrid } from '@/components/ui/section-grid';
import { StatCard } from '@/components/ui/stat-card';
import { Visual } from '@/components/ui/visual';
import { getEmployeeDashboardData } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function EmployeeDashboardPage() {
  const { profile, assets, tickets, announcements } = await getEmployeeDashboardData();
  return (
    <>
      <PageHeader eyebrow="Employee portal" title={`Welcome, ${profile.name}`} visual="profile" description="View your assigned assets, private tickets, announcements, and profile without admin-level data exposure." actions={<Button asChild><Link href="/employee/tickets/new"><Plus className="h-4 w-4" /> New private ticket</Link></Button>} />
      <SectionGrid><StatCard title="My assets" value={assets.length} helper="Currently assigned to you" visual="assets" /><StatCard title="My tickets" value={tickets.length} helper="Private to you and admins" visual="tickets" tone="warning" /><StatCard title="Announcements" value={announcements.length} helper="Published company updates" visual="announcements" tone="success" /></SectionGrid>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <StatusTable title="Assigned assets" rows={assets.slice(0, 4)} emptyLabel="No assets are currently assigned to you." viewHref={(row) => `/employee/my-assets#${row.id}`} columns={[{ header: 'Asset', cell: (row) => <div className="flex items-center gap-3"><Visual name="assets" alt="" size={38} /><div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.assetId}</p></div></div> }, { header: 'Condition', cell: (row) => <StatusBadge value={row.condition} /> }, { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }]} />
        <Card><CardHeader><CardTitle>Latest announcements</CardTitle><CardDescription>Published updates from the admin team.</CardDescription></CardHeader><CardContent className="space-y-3">{announcements.slice(0, 3).map((item) => <div key={item.id} className="rounded-2xl border bg-card p-4"><p className="text-sm font-medium">{item.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.body}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(item.publishedAt || item.createdAt)}</p></div>)}{announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements yet.</p> : null}</CardContent></Card>
      </div>
      <StatusTable title="My recent private tickets" rows={tickets.slice(0, 5)} emptyLabel="You have not created any tickets yet." viewHref={(row) => `/employee/tickets/${row.id}`} columns={[{ header: 'Subject', cell: (row) => <div><p className="font-medium">{row.subject}</p><p className="text-xs text-muted-foreground">{row.category}</p></div> }, { header: 'Priority', cell: (row) => <StatusBadge value={row.priority} /> }, { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }, { header: 'Updated', cell: (row) => formatDate(row.updatedAt) }]} />
    </>
  );
}
