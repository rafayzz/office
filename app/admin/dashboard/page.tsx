import Link from 'next/link';
import { Users, Package, Ticket, AlertTriangle, ArrowRight, ClipboardList } from 'lucide-react';
import { getAdminDashboardData } from '@/lib/data/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/data/status-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const { employees, employeeRequests, assets, inventoryItems, tickets, stats } = await getAdminDashboardData();

  const lowStockItems = inventoryItems.filter((i) => i.quantity <= i.reorderLevel);
  const pendingRequests = employeeRequests.filter((r) => r.status === 'pending');
  const recentTickets = tickets.slice(0, 5);
  const recentRequests = employeeRequests.slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Admin console"
        title="Admin overview"
        description={`${stats.activeEmployees} active employee${stats.activeEmployees !== 1 ? 's' : ''} · ${stats.assignedAssets} assigned asset${stats.assignedAssets !== 1 ? 's' : ''} · ${stats.openTickets} open ticket${stats.openTickets !== 1 ? 's' : ''}`}
        actions={
          <Button asChild>
            <Link href="/admin/employees">View employees</Link>
          </Button>
        }
      />

      {/* Real stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats.activeEmployees}</p>
              <p className="text-xs text-muted-foreground">Active employees</p>
              {pendingRequests.length > 0 && (
                <Link href="/admin/employee-requests" className="text-xs text-amber-600 font-medium hover:underline">
                  {pendingRequests.length} pending approval
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <Package className="h-5 w-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats.assignedAssets}</p>
              <p className="text-xs text-muted-foreground">Assigned assets</p>
              <p className="text-xs text-muted-foreground">{assets.length} total tracked</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
              <Ticket className="h-5 w-5 text-amber-600" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats.openTickets}</p>
              <p className="text-xs text-muted-foreground">Open tickets</p>
              <p className="text-xs text-muted-foreground">{tickets.length} total</p>
            </div>
          </CardContent>
        </Card>

        <Card className={lowStockItems.length > 0 ? 'border-amber-200' : ''}>
          <CardContent className="flex items-center gap-4 p-5">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${lowStockItems.length > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
              <AlertTriangle className={`h-5 w-5 ${lowStockItems.length > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{lowStockItems.length}</p>
              <p className="text-xs text-muted-foreground">Low / out of stock</p>
              <p className="text-xs text-muted-foreground">{inventoryItems.length} total items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent employee requests — real data */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent access requests</CardTitle>
            <Link href="/admin/employee-requests" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <EmptyState visual="requests" title="No requests" description="Employee access requests will appear here." />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{req.name}</p>
                      <p className="text-xs text-muted-foreground">{req.email} · {req.department}</p>
                    </div>
                    <StatusBadge value={req.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent tickets — real data */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent tickets</CardTitle>
            <Link href="/admin/tickets" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <EmptyState visual="tickets" title="No tickets" description="Support tickets from employees will appear here." />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.creatorName} · {formatDate(ticket.updatedAt)}</p>
                    </div>
                    <StatusBadge value={ticket.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low stock alert — real data, only shown when items are low */}
        {lowStockItems.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/40 lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                Low stock alerts ({lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''})
              </CardTitle>
              <Link href="/admin/inventory" className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 transition-colors">
                Manage inventory <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-amber-700">{item.quantity} {item.unit} left · reorder at {item.reorderLevel}</p>
                    </div>
                    {item.quantity === 0 && (
                      <span className="ml-2 shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Out</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employee breakdown — real data */}
        <Card className={lowStockItems.length > 0 ? '' : 'lg:col-span-2'}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Employee breakdown</CardTitle>
            <Link href="/admin/employees" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <EmptyState visual="employees" title="No employees" description="Approved employees will appear here." />
            ) : (
              <div className="space-y-2">
                {[
                  { label: 'Active', count: employees.filter(e => e.status === 'active').length, color: 'bg-emerald-500' },
                  { label: 'Pending', count: employees.filter(e => e.status === 'pending').length, color: 'bg-amber-400' },
                  { label: 'Rejected', count: employees.filter(e => e.status === 'rejected').length, color: 'bg-red-400' },
                  { label: 'Deactivated', count: employees.filter(e => e.status === 'deactivated').length, color: 'bg-slate-300' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${color} transition-all duration-500`}
                        style={{ width: employees.length > 0 ? `${Math.round((count / employees.length) * 100)}%` : '0%' }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-bold tabular-nums">{count}</span>
                  </div>
                ))}
                <p className="pt-1 text-xs text-muted-foreground">{employees.length} total registered users</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending requests quick-action — only shown when there are pending */}
        {pendingRequests.length > 0 && lowStockItems.length === 0 && (
          <Card className="border-indigo-200 bg-indigo-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-indigo-800">
                <ClipboardList className="h-4 w-4" />
                {pendingRequests.length} pending approval{pendingRequests.length !== 1 ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-xl border border-indigo-200 bg-white px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{req.name}</p>
                    <p className="text-xs text-muted-foreground">{req.department}</p>
                  </div>
                </div>
              ))}
              <Button asChild size="sm" className="w-full mt-2">
                <Link href="/admin/employee-requests">Review requests</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
