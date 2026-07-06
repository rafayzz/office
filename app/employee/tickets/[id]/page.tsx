import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TicketThread } from '@/components/tickets/ticket-thread';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { getMyTicketById } from '@/lib/data/firestore';

export default async function EmployeeTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getMyTicketById(id);
  if (!ticket) return <><Button asChild variant="ghost" className="px-0"><Link href="/employee/tickets"><ArrowLeft className="h-4 w-4" /> Back to my tickets</Link></Button><EmptyState visual="tickets" title="Ticket not found" description="This ticket may not exist or is not owned by your account." /></>;
  return <><Button asChild variant="ghost" className="px-0"><Link href="/employee/tickets"><ArrowLeft className="h-4 w-4" /> Back to my tickets</Link></Button><PageHeader eyebrow="Private ticket" visual="tickets" title={ticket.subject} description="This view only loads tickets owned by the signed-in employee." /><TicketThread ticket={ticket} viewer="employee" /></>;
}
