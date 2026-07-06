import { Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { listPublishedAnnouncements } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function EmployeeAnnouncementsPage() {
  const published = await listPublishedAnnouncements();
  return (
    <>
      <PageHeader eyebrow="Company updates" visual="announcements" title="Announcements" description="Only published announcements are visible in the employee portal." />
      {published.length === 0 ? <EmptyState icon={Bell} visual="announcements" title="No announcements" description="Published company updates will appear here." /> : <div className="grid gap-5 md:grid-cols-2">{published.map((announcement) => <Card key={announcement.id} className="card-hover"><CardHeader><CardTitle>{announcement.title}</CardTitle><CardDescription>{announcement.audience} · {formatDate(announcement.publishedAt || announcement.createdAt)}</CardDescription></CardHeader><CardContent><p className="text-sm leading-6 text-muted-foreground">{announcement.body}</p></CardContent></Card>)}</div>}
    </>
  );
}
