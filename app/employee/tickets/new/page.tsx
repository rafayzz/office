import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { createPrivateTicketFromForm } from '@/app/actions/employee';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function NewEmployeeTicketPage() {
  return (
    <>
      <Button asChild variant="ghost" className="px-0"><Link href="/employee/tickets"><ArrowLeft className="h-4 w-4" /> Back to my tickets</Link></Button>
      <PageHeader eyebrow="Create private ticket" visual="tickets" title="New private ticket" description="Submit an office request, IT issue, facility concern, or private complaint. Visibility stays restricted." />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><FormSection title="Ticket details" description="Only you and admins can access this ticket after submission."><form action={createPrivateTicketFromForm} className="space-y-4"><Field label="Subject"><Input name="subject" placeholder="Short summary" required /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Category"><Select name="category" defaultValue="IT Support"><option>IT Support</option><option>HR</option><option>Facilities</option><option>Office Inventory</option><option>Other</option></Select></Field><Field label="Priority"><Select name="priority" defaultValue="Medium"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></Select></Field></div><Field label="Message"><Textarea name="message" placeholder="Describe the issue or request privately..." required /></Field><Field label="Attachment"><Input name="attachment" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx" /></Field><Button>Submit private ticket</Button></form></FormSection><Card className="h-fit border-amber-200 bg-amber-50/80"><CardContent className="p-5 text-sm text-amber-900"><ShieldCheck className="mb-3 h-5 w-5" />Ticket attachments are stored under private Storage paths. Employees can only read files attached to their own tickets; admins can read all ticket attachments.</CardContent></Card></div>
    </>
  );
}
