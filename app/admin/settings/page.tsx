import { saveWorkspaceSettingsFromForm } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Visual } from '@/components/ui/visual';
import { getWorkspaceSettings } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function SettingsPage() {
  const settings = await getWorkspaceSettings();

  return (
    <>
      <PageHeader eyebrow="Admin controls" title="Workspace settings" visual="settings" description="Manage company identity, signup policy, secure file access, and deployment readiness from one controlled screen." />
      <div className="max-w-3xl">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-slate-950/[0.06] bg-white/50">
            <CardTitle className="flex items-center gap-3"><Visual name="settings" alt="" size={38} /> Company profile</CardTitle>
            <CardDescription>Workspace defaults used across admin and employee screens.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form action={saveWorkspaceSettingsFromForm} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name"><Input name="companyName" defaultValue={settings.companyName} placeholder="Your company" /></Field>
                <Field label="Default location"><Input name="defaultLocation" defaultValue={settings.defaultLocation} placeholder="HQ - Main Office" /></Field>
                <Field label="Timezone"><Select name="timezone" defaultValue={settings.timezone}><option value="Asia/Karachi">Asia/Karachi</option><option value="UTC">UTC</option><option value="Asia/Dubai">Asia/Dubai</option><option value="Europe/London">Europe/London</option></Select></Field>
                <Field label="Inventory low-stock notification"><Select name="lowStockNotifications" defaultValue={settings.lowStockNotifications}><option value="enabled">Enabled</option><option value="disabled">Disabled</option></Select></Field>
              </div>
              <div className="rounded-3xl border border-slate-950/10 bg-slate-950 p-4 text-sm text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                <div className="flex items-start gap-3"><Visual name="security" alt="" size={42} className="rounded-2xl ring-white/10" /><div><p className="font-semibold">Production-safe workspace</p><p className="mt-1 text-white/65">The interface stays client-ready while secure roles, private tickets, protected files, and asset history remain enforced server-side.</p></div></div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">Last updated: {settings.updatedAt ? formatDate(settings.updatedAt) : 'Not saved yet'}</p>
                <Button>Save settings</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
