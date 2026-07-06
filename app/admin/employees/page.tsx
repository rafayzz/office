import Link from 'next/link';
import { Plus, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { listEmployees } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function EmployeesPage() {
  const employees = await listEmployees();
  return (
    <>
      <PageHeader eyebrow="People directory" visual="employees" title="Employees" description="Manage active employees, roles, departments, assignments, and offboarding without deleting history." actions={<Button asChild><Link href="/admin/employee-requests"><Plus className="h-4 w-4" /> Invite via request flow</Link></Button>} />
      {employees.length ? (
        <StatusTable
          rows={employees}
          viewHref={(row) => `/admin/employees/${row.uid || row.id}`}
          columns={[
            { header: 'Employee', cell: (row) => <div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.email}</p></div> },
            { header: 'Title', cell: (row) => row.title },
            { header: 'Department', cell: (row) => row.department },
            { header: 'Role', cell: (row) => <StatusBadge value={row.role} /> },
            { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> },
            { header: 'Joined', cell: (row) => formatDate(row.joinedAt) }
          ]}
        />
      ) : <EmptyState icon={UsersRound} visual="employees" title="No employees yet" description="Approved employees will appear here after signup approval." />}
    </>
  );
}
