import Link from 'next/link';
import { ArrowLeft, type LucideIcon, Mail, MapPin, Phone } from 'lucide-react';
import { OffboardingChecklist } from '@/components/admin/offboarding-checklist';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { getEmployeeById, listAdminTickets, listEmployeeAssignedAssets } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await getEmployeeById(id);
  if (!employee) return <><Button asChild variant="ghost" className="px-0"><Link href="/admin/employees"><ArrowLeft className="h-4 w-4" /> Back to employees</Link></Button><EmptyState visual="employees" title="Employee not found" description="This employee record may not exist in Firebase users." /></>;
  const [assignedAssets, allTickets] = await Promise.all([listEmployeeAssignedAssets(employee.uid), listAdminTickets()]);
  const employeeTickets = allTickets.filter((ticket) => ticket.creatorId === employee.uid);
  return (
    <>
      <Button asChild variant="ghost" className="px-0"><Link href="/admin/employees"><ArrowLeft className="h-4 w-4" /> Back to employees</Link></Button>
      <PageHeader eyebrow="Employee profile" visual="employees" title={employee.name} description={`${employee.title} · ${employee.department}. This profile preserves assignment and ticket history even after deactivation.`} actions={<Badge variant={employee.status === 'active' ? 'success' : 'destructive'}>{employee.status}</Badge>} />
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><Info icon={Mail} label="Email" value={employee.email} /><Info icon={Phone} label="Phone" value={employee.phone || 'Not added'} /><Info icon={MapPin} label="Location" value={employee.location} /><div className="grid grid-cols-2 gap-3 rounded-2xl border bg-muted/30 p-4"><div><p className="text-xs text-muted-foreground">Role</p><StatusBadge value={employee.role} /></div><div><p className="text-xs text-muted-foreground">Joined</p><p className="font-medium">{formatDate(employee.joinedAt)}</p></div><div><p className="text-xs text-muted-foreground">Manager</p><p className="font-medium">{employee.manager || 'Not added'}</p></div><div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{employee.department}</p></div></div></CardContent></Card>
        <OffboardingChecklist employee={employee} assignedAssets={assignedAssets} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2"><StatusTable title="Assigned assets" rows={assignedAssets} viewHref={(row) => `/admin/assets/${row.id}`} emptyLabel="No active asset assignments" columns={[{ header: 'Asset', cell: (row) => <div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.assetId}</p></div> }, { header: 'Condition', cell: (row) => <StatusBadge value={row.condition} /> }, { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }]} /><StatusTable title="Recent private tickets" rows={employeeTickets} viewHref={(row) => `/admin/tickets/${row.id}`} emptyLabel="No private tickets from this employee" columns={[{ header: 'Subject', cell: (row) => <div><p className="font-medium">{row.subject}</p><p className="text-xs text-muted-foreground">{row.category}</p></div> }, { header: 'Priority', cell: (row) => <StatusBadge value={row.priority} /> }, { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }]} /></div>
    </>
  );
}
function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="flex items-center gap-3 rounded-2xl border bg-card p-4"><div className="rounded-xl bg-muted p-2 text-muted-foreground"><Icon className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium">{value}</p></div></div>; }
