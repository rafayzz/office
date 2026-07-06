import { ShieldCheck } from 'lucide-react';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { listAdminTickets } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function AdminTicketsPage() {
  const tickets = await listAdminTickets();
  return (
    <>
      <PageHeader eyebrow="Private employee tickets" visual="tickets" title="Tickets" description="Admins can review all private tickets. Employees only see tickets they created." />
      <Card className="border-amber-200 bg-amber-50/80"><CardContent className="flex gap-3 p-5 text-sm text-amber-900"><ShieldCheck className="mt-0.5 h-5 w-5" /><p>Private ticket records and attachments must stay limited to admins and the ticket creator.</p></CardContent></Card>
      <StatusTable
        rows={tickets}
        emptyLabel="No private tickets have been created yet."
        viewHref={(row) => `/admin/tickets/${row.id}`}
        columns={[
          { header: 'Subject', cell: (row) => <div><p className="font-medium">{row.subject}</p><p className="text-xs text-muted-foreground">{row.creatorName}</p></div> },
          { header: 'Category', cell: (row) => row.category },
          { header: 'Priority', cell: (row) => <StatusBadge value={row.priority} /> },
          { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> },
          { header: 'Updated', cell: (row) => formatDate(row.updatedAt) }
        ]}
      />
    </>
  );
}
