import { Check, ShieldAlert, X } from 'lucide-react';
import { approveEmployeeRequestAction, rejectEmployeeRequestAction } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/data/status-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { listEmployeeRequests } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function EmployeeRequestsPage() {
  const employeeRequests = await listEmployeeRequests();
  return (
    <>
      <PageHeader eyebrow="Approval gated signup" visual="requests" title="Employee access requests" description="Review access requests. Approval sets secure role/status claims and rejection keeps access blocked." />
      <Card>
        <CardHeader><CardTitle>Pending and recent requests</CardTitle><CardDescription>Pending users cannot access protected app routes until approved.</CardDescription></CardHeader>
        <CardContent>
          {employeeRequests.length === 0 ? <EmptyState visual="requests" title="No access requests" description="When new employees request access, their requests will appear here for admin review." /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Reason</TableHead><TableHead>Requested</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Decision</TableHead></TableRow></TableHeader>
              <TableBody>
                {employeeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell><p className="font-medium">{request.name}</p><p className="text-xs text-muted-foreground">{request.email}</p></TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell className="max-w-xs text-muted-foreground">{request.reason}</TableCell>
                    <TableCell>{formatDate(request.requestedAt)}</TableCell>
                    <TableCell><StatusBadge value={request.status} /></TableCell>
                    <TableCell><div className="flex justify-end gap-2">
                      <form action={approveEmployeeRequestAction}><input type="hidden" name="requestId" value={request.id} /><input type="hidden" name="uid" value={request.uid || request.id} /><Button variant="success" size="sm" disabled={request.status !== 'pending'}><Check className="h-4 w-4" /> Approve</Button></form>
                      <form action={rejectEmployeeRequestAction}><input type="hidden" name="requestId" value={request.id} /><Button variant="outline" size="sm" disabled={request.status !== 'pending'}><X className="h-4 w-4" /> Reject</Button></form>
                    </div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card className="border-amber-200 bg-amber-50/70"><CardContent className="flex gap-3 p-5 text-sm text-amber-900"><ShieldAlert className="mt-0.5 h-5 w-5" /><p>Security requirement: approval and rejection decisions run server-side and set Firebase custom claims. Middleware is only an extra route guard.</p></CardContent></Card>
    </>
  );
}
