import Link from 'next/link';
import { Plus, ShieldCheck } from 'lucide-react';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { listMyTickets } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function EmployeeTicketsPage() {
  const tickets = await listMyTickets();
  return (
    <>
      <PageHeader eyebrow="Private support" visual="tickets" title="My private tickets" description="Create private requests, complaints, HR concerns, or office support tickets. Only you and admins can view them." actions={<Button asChild><Link href="/employee/tickets/new"><Plus className="h-4 w-4" /> New ticket</Link></Button>} />
      <Card className="border-amber-200 bg-amber-50/80"><CardContent className="flex gap-3 p-5 text-sm text-amber-900"><ShieldCheck className="mt-0.5 h-5 w-5" /><p>Your tickets are private. Other employees cannot view this list or any ticket messages.</p></CardContent></Card>
      <StatusTable rows={tickets} viewHref={(row) => `/employee/tickets/${row.id}`} emptyLabel="You have not created any tickets yet" columns={[{ header: 'Subject', cell: (row) => <div><p className="font-medium">{row.subject}</p><p className="text-xs text-muted-foreground">{row.category}</p></div> }, { header: 'Priority', cell: (row) => <StatusBadge value={row.priority} /> }, { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> }, { header: 'Created', cell: (row) => formatDate(row.createdAt) }, { header: 'Updated', cell: (row) => formatDate(row.updatedAt) }]} />
    </>
  );
}
