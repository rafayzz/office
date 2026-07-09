'use client';

import { useActionState, useEffect, useRef } from 'react';
import { saveWorkspaceSettingsFromForm } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { WorkspaceSettings } from '@/lib/types';


type ActionState = { ok: boolean; message: string } | null;

async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await saveWorkspaceSettingsFromForm(formData);
    return { ok: true, message: 'Settings saved successfully.' };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Failed to save settings.' };
  }
}

export function SettingsForm({ settings, lastUpdated }: { settings: WorkspaceSettings; lastUpdated: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(saveSettingsAction, null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Scroll banner into view when state changes
  useEffect(() => {
    if (state) bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name">
          <Input name="companyName" defaultValue={settings.companyName} placeholder="Your company" />
        </Field>
        <Field label="Default location">
          <Input name="defaultLocation" defaultValue={settings.defaultLocation} placeholder="HQ - Main Office" />
        </Field>
        <Field label="Timezone">
          <Select name="timezone" defaultValue={settings.timezone}>
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
          </Select>
        </Field>
        <Field label="Inventory low-stock notifications">
          <Select name="lowStockNotifications" defaultValue={settings.lowStockNotifications}>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </Select>
        </Field>
      </div>



      {/* Save feedback banner */}
      {state && (
        <div
          ref={bannerRef}
          role="alert"
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
            state.ok
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <span className={`h-2 w-2 shrink-0 rounded-full ${state.ok ? 'bg-green-500' : 'bg-red-500'}`} />
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {lastUpdated ? `Last updated: ${lastUpdated}` : 'Not saved yet'}
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  );
}
