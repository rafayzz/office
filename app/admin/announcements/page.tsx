import { Megaphone, Plus } from 'lucide-react';
import { createAnnouncementFromForm } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Field } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/data/status-table';
import { listAdminAnnouncements } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function AdminAnnouncementsPage() {
  const announcements = await listAdminAnnouncements();
  return (
    <>
      <PageHeader eyebrow="Company updates" visual="announcements" title="Announcements" description="Create draft or published announcements for employees. Employees only see published announcements." actions={<Button form="announcement-form"><Plus className="h-4 w-4" /> New announcement</Button>} />
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          {announcements.length === 0 ? <EmptyState visual="announcements" title="No announcements yet" description="Create your first internal announcement from the composer." /> : announcements.map((announcement) => (
            <Card key={announcement.id}><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>{announcement.title}</CardTitle><CardDescription>{announcement.audience} · created by {announcement.createdByName} · {formatDate(announcement.createdAt)}</CardDescription></div><StatusBadge value={announcement.status} /></div></CardHeader><CardContent><p className="text-sm leading-6 text-muted-foreground">{announcement.body}</p></CardContent></Card>
          ))}
        </div>
        <Card className="h-fit"><CardHeader><CardTitle className="flex items-center gap-2"><Megaphone className="h-4 w-4" /> Composer</CardTitle><CardDescription>Publish updates directly to Firebase announcements.</CardDescription></CardHeader><CardContent><form id="announcement-form" action={createAnnouncementFromForm} className="space-y-4"><Field label="Title"><Input name="title" placeholder="Announcement title" required /></Field><Field label="Audience"><Select name="audience" defaultValue="All employees"><option>All employees</option><option>Admin only</option><option>Department</option></Select></Field><Field label="Status"><Select name="status" defaultValue="Published"><option>Published</option><option>Draft</option></Select></Field><Field label="Body"><Textarea name="body" placeholder="Write announcement..." required /></Field><div className="grid grid-cols-2 gap-2"><Button name="status" value="Draft" variant="outline">Save draft</Button><Button name="status" value="Published">Publish</Button></div></form></CardContent></Card>
      </div>
    </>
  );
}
