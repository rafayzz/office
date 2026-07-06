export const dynamic = 'force-dynamic';

import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AppShell variant="admin" user={user}>{children}</AppShell>;
}
