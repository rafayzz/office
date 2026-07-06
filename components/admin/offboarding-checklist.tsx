'use client';

import { useMemo, useState, useTransition } from 'react';
import { CheckCircle2, LockKeyhole, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';
import { completeOffboarding } from '@/app/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Asset, Employee } from '@/lib/types';

export function OffboardingChecklist({ employee, assignedAssets }: { employee: Employee; assignedAssets: Asset[] }) {
  const [checkedAssets, setCheckedAssets] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const progress = assignedAssets.length === 0 ? 100 : Math.round((checkedAssets.length / assignedAssets.length) * 100);
  const canDeactivate = checkedAssets.length === assignedAssets.length;
  const statusText = useMemo(() => canDeactivate ? 'Ready to deactivate' : `${assignedAssets.length - checkedAssets.length} asset${assignedAssets.length - checkedAssets.length === 1 ? '' : 's'} still required`, [assignedAssets.length, canDeactivate, checkedAssets.length]);

  function submit() {
    startTransition(async () => {
      try {
        await completeOffboarding(employee.uid, checkedAssets);
        toast.success('Employee deactivated and asset history preserved');
      } catch (error) {
        console.error(error);
        toast.error('Offboarding could not be completed. Confirm every assigned asset is checked in.');
      }
    });
  }

  return (
    <Card>
      <CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>Offboarding checklist</CardTitle><CardDescription>Deactivate only after all assigned assets are checked in. Employee history remains preserved.</CardDescription></div><Badge variant={canDeactivate ? 'success' : 'warning'}>{statusText}</Badge></div></CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Return progress for {employee.name}</span><span className="font-medium">{progress}%</span></div><Progress value={progress} /></div>
        <div className="space-y-3">
          {assignedAssets.length === 0 ? <div className="rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">No active assigned assets found.</div> : assignedAssets.map((asset) => {
            const checked = checkedAssets.includes(asset.id);
            return <label key={asset.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 transition hover:bg-muted/40"><input type="checkbox" checked={checked} onChange={(event) => setCheckedAssets((current) => event.target.checked ? [...current, asset.id] : current.filter((id) => id !== asset.id))} className="mt-1 h-4 w-4 rounded" /><PackageCheck className="mt-0.5 h-4 w-4 text-muted-foreground" /><div className="flex-1"><p className="text-sm font-medium">{asset.name}</p><p className="text-xs text-muted-foreground">{asset.assetId} · {asset.serialNumber} · {asset.location}</p></div>{checked ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : null}</label>;
          })}
        </div>
        <Button onClick={submit} className="w-full" disabled={!canDeactivate || isPending || employee.status === 'deactivated'} variant={canDeactivate ? 'destructive' : 'secondary'}>{canDeactivate ? (isPending ? 'Completing offboarding...' : 'Complete offboarding and deactivate employee') : <><LockKeyhole className="h-4 w-4" /> Return all assets first</>}</Button>
      </CardContent>
    </Card>
  );
}
