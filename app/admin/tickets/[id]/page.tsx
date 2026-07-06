import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TicketThread } from '@/components/tickets/ticket-thread';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminTicketById } from '@/lib/data/firestore';

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getAdminTicketById(id);
  if (!ticket) return <><Button asChild variant="ghost" className="px-0"><Link href="/admin/tickets"><ArrowLeft className="h-4 w-4" /> Back to tickets</Link></Button><EmptyState visual="tickets" title="Ticket not found" description="This private ticket may have been removed or you may not have access to it." /></>;
  return <><Button asChild variant="ghost" className="px-0"><Link href="/admin/tickets"><ArrowLeft className="h-4 w-4" /> Back to tickets</Link></Button><PageHeader eyebrow="Private ticket" visual="tickets" title={ticket.subject} description="Admin view with restricted access and auditable replies." /><TicketThread ticket={ticket} viewer="admin" /></>;
}
