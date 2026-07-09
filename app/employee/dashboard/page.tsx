import Link from 'next/link';
import { Laptop, Ticket, Megaphone, ArrowRight } from 'lucide-react';
import { getEmployeeDashboardData } from '@/lib/data/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/data/status-table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export default async function EmployeeDashboardPage() {
  const { profile, assets, tickets, announcements } = await getEmployeeDashboardData();

  const openTickets = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status));
  const latestAnnouncement = announcements[0] ?? null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <PageHeader
        eyebrow="Your workspace"
        title={`${greeting}, ${profile.name.split(' ')[0]}`}
        description="Everything you need for your workday is here."
      />

      {/* Stat cards — all real live data */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
              <Laptop className="h-5 w-5 text-indigo-600" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{assets.length}</p>
              <p className="text-xs text-muted-foreground">Assigned asset{assets.length !== 1 ? 's' : ''}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
              <Ticket className="h-5 w-5 text-amber-600" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{openTickets.length}</p>
              <p className="text-xs text-muted-foreground">Open ticket{openTickets.length !== 1 ? 's' : ''}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <Megaphone className="h-5 w-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-3xl font-bold tracking-tight">{announcements.length}</p>
              <p className="text-xs text-muted-foreground">Announcement{announcements.length !== 1 ? 's' : ''}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* My Assets — real Firestore data */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">My assets</CardTitle>
            <Link href="/employee/my-assets" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <EmptyState visual="assets" title="No assigned assets" description="Assets assigned to you by an admin will appear here." />
            ) : (
              <div className="divide-y divide-slate-100">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.assetId} · {asset.type}</p>
                    </div>
                    <StatusBadge value={asset.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Announcement — real Firestore data */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Latest announcement</CardTitle>
            <Link href="/employee/announcements" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {latestAnnouncement ? (
              <div>
                <p className="font-semibold text-sm">{latestAnnouncement.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4">{latestAnnouncement.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  By {latestAnnouncement.createdByName}
                  {latestAnnouncement.publishedAt ? ` · ${formatDate(latestAnnouncement.publishedAt)}` : ''}
                </p>
              </div>
            ) : (
              <EmptyState visual="reports" title="No announcements" description="Published announcements from your admin will appear here." />
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets — real Firestore data */}
        {tickets.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">My recent tickets</CardTitle>
              <Link href="/employee/tickets" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {tickets.slice(0, 5).map((ticket) => (
                  <Link key={ticket.id} href={`/employee/tickets/${ticket.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.category} · Updated {formatDate(ticket.updatedAt)}</p>
                    </div>
                    <StatusBadge value={ticket.status} />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
