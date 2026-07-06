import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionGrid } from '@/components/ui/section-grid';
import { StatCard } from '@/components/ui/stat-card';
import { Visual } from '@/components/ui/visual';
import { getReportsData } from '@/lib/data/firestore';

export default async function ReportsPage() {
  const { employees, assets, inventoryItems, tickets, stats } = await getReportsData();
  const activeAssets = assets.filter((asset) => asset.status === 'Assigned').length;
  const healthyInventory = inventoryItems.filter((item) => item.quantity > item.reorderLevel).length;
  const privateTickets = tickets.length;
  return (
    <>
      <PageHeader eyebrow="Operational reporting" title="Reports" visual="reports" description="Focused summaries for leadership without overbuilt analytics in the MVP." />
      <SectionGrid><StatCard title="Employees" value={employees.length} helper={`${stats.activeEmployees} active`} visual="employees" /><StatCard title="Assets" value={assets.length} helper={`${activeAssets} assigned`} visual="assets" tone="success" /><StatCard title="Inventory items" value={inventoryItems.length} helper={`${healthyInventory} healthy stock`} visual="inventory" tone="warning" /><StatCard title="Tickets" value={privateTickets} helper={`${stats.openTickets} open`} visual="tickets" tone="danger" /></SectionGrid>
      <div className="grid gap-5 lg:grid-cols-2">
        {[
          { id: 'employees', title: 'Employee summary', body: 'Active, pending, rejected, and deactivated user states are separated for secure access decisions.', visual: 'employees' as const },
          { id: 'assets', title: 'Asset summary', body: 'Trackable assets preserve assignment history, warranty fields, and optional QR labels.', visual: 'assets' as const },
          { id: 'inventory', title: 'Inventory summary', body: 'Quantity-based stock focuses on reorder levels, location, unit, condition, and notes. QR is intentionally excluded.', visual: 'inventory' as const },
          { id: 'tickets', title: 'Ticket summary', body: 'Private employee tickets remain visible only to the creator and administrators.', visual: 'tickets' as const }
        ].map((section) => (<Card key={section.id} id={section.id} className="card-hover"><CardHeader className="flex-row items-start gap-4 space-y-0"><Visual name={section.visual} alt="" size={48} /><div><CardTitle>{section.title}</CardTitle><CardDescription>{section.body}</CardDescription></div></CardHeader><CardContent><div className="h-3 rounded-full bg-slate-950/[0.06]"><div className="h-3 w-2/3 rounded-full bg-slate-950" /></div></CardContent></Card>))}
      </div>
    </>
  );
}
