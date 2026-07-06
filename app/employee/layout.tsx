export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/app-shell';
import { requireEmployee } from '@/lib/auth/session';

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const user = await requireEmployee();
  return <AppShell variant="employee" user={user}>{children}</AppShell>;
}
