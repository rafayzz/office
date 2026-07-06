import { Paperclip, ShieldCheck } from 'lucide-react';
import { updateTicketStatusFromForm } from '@/app/actions/admin';
import { replyToTicketFromForm } from '@/app/actions/employee';
import { Badge, statusVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { protectedFileHref } from '@/lib/files/upload';
import type { Ticket } from '@/lib/types';
import { formatDate, initials } from '@/lib/utils';

const statuses = ['Open', 'In review', 'Waiting employee', 'Resolved', 'Closed'];

export function TicketThread({ ticket, viewer }: { ticket: Ticket; viewer: 'admin' | 'employee' }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{ticket.subject}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">Private ticket conversation with restricted visibility.</p>
            </div>
            <Badge variant={statusVariant(ticket.status)}>{ticket.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4" /><p>This thread is visible only to the ticket creator and admins. Attachments follow the same privacy boundary.</p></div>
          </div>
          <div className="space-y-4">
            {ticket.messages.length === 0 ? <p className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">No messages yet.</p> : ticket.messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{initials(message.authorName)}</div>
                <div className="flex-1 rounded-2xl border bg-card p-4">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium">{message.authorName}</p><p className="text-xs text-muted-foreground">{message.authorRole} · {formatDate(message.createdAt)}</p></div><Badge variant="secondary">Private</Badge></div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{message.message}</p>
                  {message.attachmentPath ? (
                    <Button asChild variant="outline" size="sm" className="mt-4 rounded-2xl">
                      <a href={protectedFileHref(message.attachmentPath)} target="_blank" rel="noreferrer"><Paperclip className="h-4 w-4" /> {message.attachmentName || 'Open attachment'}</a>
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <form action={replyToTicketFromForm} className="rounded-2xl border bg-muted/30 p-4">
            <input type="hidden" name="ticketId" value={ticket.id} />
            <Textarea name="message" placeholder={viewer === 'admin' ? 'Reply as admin...' : 'Add a private message...'} required minLength={2} />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><input type="file" name="attachment" className="text-sm text-muted-foreground" /><Button>Send reply</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card className="h-fit">
        <CardHeader><CardTitle>Ticket details</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Creator</p><p className="font-medium">{ticket.creatorName}</p><p className="text-muted-foreground">{ticket.creatorEmail}</p></div>
          <div className="grid grid-cols-2 gap-3"><div><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{ticket.category}</p></div><div><p className="text-xs text-muted-foreground">Priority</p><Badge variant={statusVariant(ticket.priority)}>{ticket.priority}</Badge></div></div>
          <div><p className="text-xs text-muted-foreground">Updated</p><p className="font-medium">{formatDate(ticket.updatedAt)}</p></div>
          {viewer === 'admin' ? (
            <form action={updateTicketStatusFromForm} className="space-y-3 rounded-2xl border bg-muted/30 p-3">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <label className="text-xs font-medium text-muted-foreground">Admin status decision</label>
              <Select name="status" defaultValue={ticket.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</Select>
              <Button className="w-full" size="sm">Update status</Button>
              <p className="text-xs leading-5 text-muted-foreground">Status decisions are admin-only and written through verified server actions.</p>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
