import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Visual } from '@/components/ui/visual';
import { SettingsForm } from '@/components/admin/settings-form';
import { getWorkspaceSettings } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function SettingsPage() {
  const settings = await getWorkspaceSettings();
  const lastUpdated = settings.updatedAt ? formatDate(settings.updatedAt) : '';

  return (
    <>
      <PageHeader eyebrow="Admin controls" title="Workspace settings" visual="settings" description="Manage company identity, signup policy, secure file access, and deployment readiness from one controlled screen." />
      <div className="max-w-3xl">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-950/[0.06] bg-white/50">
            <CardTitle className="flex items-center gap-3">
              <Visual name="settings" alt="" size={38} /> Company profile
            </CardTitle>
            <CardDescription>Workspace defaults used across admin and employee screens.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <SettingsForm settings={settings} lastUpdated={lastUpdated} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
