import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionGrid } from '@/components/ui/section-grid';
import { StatCard } from '@/components/ui/stat-card';
import { getReportsData } from '@/lib/data/firestore';

function ReportRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="flex-1 text-sm text-slate-700 font-medium">{label}</span>
      <span className="text-sm font-bold tabular-nums w-8 text-right">{value}</span>
      <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right tabular-nums">{pct}%</span>
    </div>
  );
}

export default async function ReportsPage() {
  const { employees, assets, inventoryItems, tickets, stats } = await getReportsData();

  // Employee breakdown
  const empActive = employees.filter((e) => e.status === 'active').length;
  const empPending = employees.filter((e) => e.status === 'pending').length;
  const empRejected = employees.filter((e) => e.status === 'rejected').length;
  const empDeactivated = employees.filter((e) => e.status === 'deactivated').length;

  // Asset breakdown
  const assetAvailable = assets.filter((a) => a.status === 'Available').length;
  const assetAssigned = assets.filter((a) => a.status === 'Assigned').length;
  const assetMaintenance = assets.filter((a) => a.status === 'Maintenance').length;
  const assetRetired = assets.filter((a) => a.status === 'Retired').length;

  // Inventory breakdown
  const invHealthy = inventoryItems.filter((i) => i.quantity > i.reorderLevel).length;
  const invLow = inventoryItems.filter((i) => i.quantity > 0 && i.quantity <= i.reorderLevel).length;
  const invOut = inventoryItems.filter((i) => i.quantity === 0).length;

  // Ticket breakdown
  const tickOpen = tickets.filter((t) => t.status === 'Open').length;
  const tickInReview = tickets.filter((t) => t.status === 'In review').length;
  const tickWaiting = tickets.filter((t) => t.status === 'Waiting employee').length;
  const tickResolved = tickets.filter((t) => t.status === 'Resolved').length;
  const tickClosed = tickets.filter((t) => t.status === 'Closed').length;

  // Department breakdown
  const deptMap: Record<string, number> = {};
  for (const e of employees) {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  }
  const deptEntries = Object.entries(deptMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <>
      <PageHeader eyebrow="Operational reporting" title="Reports" visual="reports" description="Live data summaries across employees, assets, inventory, and support tickets." />

      <SectionGrid>
        <StatCard title="Total employees" value={employees.length} helper={`${empActive} active`} visual="employees" />
        <StatCard title="Total assets" value={assets.length} helper={`${assetAssigned} assigned`} visual="assets" tone="success" />
        <StatCard title="Inventory items" value={inventoryItems.length} helper={`${invLow + invOut} need attention`} visual="inventory" tone="warning" />
        <StatCard title="Support tickets" value={tickets.length} helper={`${stats.openTickets} open`} visual="tickets" tone="danger" />
      </SectionGrid>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Employees */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Employee status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportRow label="Active" value={empActive} total={employees.length} color="#22c55e" />
            <ReportRow label="Pending approval" value={empPending} total={employees.length} color="#f59e0b" />
            <ReportRow label="Rejected" value={empRejected} total={employees.length} color="#ef4444" />
            <ReportRow label="Deactivated" value={empDeactivated} total={employees.length} color="#94a3b8" />
            <p className="mt-3 text-xs text-slate-400">Total: {employees.length} registered users</p>
          </CardContent>
        </Card>

        {/* Assets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset status breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportRow label="Available" value={assetAvailable} total={assets.length} color="#6366f1" />
            <ReportRow label="Assigned" value={assetAssigned} total={assets.length} color="#22c55e" />
            <ReportRow label="In maintenance" value={assetMaintenance} total={assets.length} color="#f59e0b" />
            <ReportRow label="Retired" value={assetRetired} total={assets.length} color="#94a3b8" />
            <p className="mt-3 text-xs text-slate-400">Total: {assets.length} tracked assets</p>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Inventory stock status</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportRow label="Healthy stock" value={invHealthy} total={inventoryItems.length} color="#22c55e" />
            <ReportRow label="Low stock (at or below reorder level)" value={invLow} total={inventoryItems.length} color="#f59e0b" />
            <ReportRow label="Out of stock" value={invOut} total={inventoryItems.length} color="#ef4444" />
            <p className="mt-3 text-xs text-slate-400">Total: {inventoryItems.length} inventory items</p>
          </CardContent>
        </Card>

        {/* Tickets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Support ticket breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportRow label="Open" value={tickOpen} total={tickets.length} color="#6366f1" />
            <ReportRow label="In review" value={tickInReview} total={tickets.length} color="#f59e0b" />
            <ReportRow label="Waiting employee" value={tickWaiting} total={tickets.length} color="#0ea5e9" />
            <ReportRow label="Resolved" value={tickResolved} total={tickets.length} color="#22c55e" />
            <ReportRow label="Closed" value={tickClosed} total={tickets.length} color="#94a3b8" />
            <p className="mt-3 text-xs text-slate-400">Total: {tickets.length} tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Department distribution — only when there's data */}
      {deptEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Employees by department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {deptEntries.map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700 truncate">{dept}</span>
                  <span className="ml-3 text-sm font-bold tabular-nums text-slate-900">{count}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">{Object.keys(deptMap).length} department{Object.keys(deptMap).length !== 1 ? 's' : ''} total</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
