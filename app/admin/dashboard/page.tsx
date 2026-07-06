import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionGrid } from '@/components/ui/section-grid';
import { StatCard } from '@/components/ui/stat-card';
import { Visual } from '@/components/ui/visual';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { getAdminDashboardData } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const { assets, employeeRequests, inventoryItems, tickets, stats } = await getAdminDashboardData();
  const lowStock = inventoryItems.filter((item) => item.quantity <= item.reorderLevel);
  const attentionAssets = assets.filter((asset) => asset.status === 'Maintenance' || asset.condition === 'Needs repair');

  return (
    <>
      <PageHeader
        eyebrow="Admin overview"
        title="Office operations command center"
        visual="dashboard"
        description="Track access approvals, assigned assets, low-stock inventory, and private employee tickets from one secure console."
        actions={<><Button asChild variant="outline"><Link href="/admin/reports">View reports</Link></Button><Button asChild><Link href="/admin/assets/new">Add asset</Link></Button></>}
      />

      <SectionGrid>
        <StatCard title="Active employees" value={stats.activeEmployees} helper="Approved and active users" visual="employees" />
        <StatCard title="Pending access" value={stats.pendingRequests} helper="Needs admin decision" visual="requests" tone="warning" />
        <StatCard title="Assigned assets" value={stats.assignedAssets} helper="Currently with employees" visual="assets" tone="success" />
        <StatCard title="Open tickets" value={stats.openTickets} helper="Private requests pending" visual="tickets" tone="danger" />
      </SectionGrid>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <StatusTable
          title="Recent employee requests"
          rows={employeeRequests.slice(0, 4)}
          emptyLabel="No access requests yet. New signup requests will appear here."
          viewHref={() => '/admin/employee-requests'}
          columns={[
            { header: 'Name', cell: (row) => <div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.email}</p></div> },
            { header: 'Department', cell: (row) => row.department },
            { header: 'Requested', cell: (row) => formatDate(row.requestedAt) },
            { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }
          ]}
        />

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-950/[0.06] bg-white/42"><CardTitle>Low-stock watchlist</CardTitle><CardDescription>Quantity-based inventory only. QR labels remain limited to assets.</CardDescription></CardHeader>
          <CardContent className="space-y-3 pt-5">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-950/10 bg-white/70 p-4 transition-all hover:bg-white">
                <div className="flex items-center gap-3"><Visual name="lowStock" alt="Low stock" size={44} className="rounded-2xl" /><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.quantity} {item.unit} · reorder at {item.reorderLevel}</p></div></div>
                <Badge variant="warning">Low</Badge>
              </div>
            ))}
            {lowStock.length === 0 ? <p className="text-sm text-muted-foreground">No low-stock items right now.</p> : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatusTable
          title="Assets needing attention"
          rows={attentionAssets}
          emptyLabel="No assets currently need attention."
          viewHref={(row) => `/admin/assets/${row.id}`}
          columns={[
            { header: 'Asset', cell: (row) => <div className="flex items-center gap-3"><Visual name="assets" alt="" size={38} /><div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.assetId}</p></div></div> },
            { header: 'Location', cell: (row) => row.location },
            { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }
          ]}
        />
        <StatusTable
          title="Newest private tickets"
          rows={tickets.slice(0, 3)}
          emptyLabel="No private tickets have been created yet."
          viewHref={(row) => `/admin/tickets/${row.id}`}
          columns={[
            { header: 'Subject', cell: (row) => <div className="flex items-center gap-3"><Visual name="tickets" alt="" size={38} /><div><p className="font-medium">{row.subject}</p><p className="text-xs text-muted-foreground">{row.creatorName}</p></div></div> },
            { header: 'Priority', cell: (row) => <StatusBadge value={row.priority} /> },
            { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }
          ]}
        />
      </div>
    </>
  );
}
