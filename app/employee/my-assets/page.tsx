import { PackageCheck } from 'lucide-react';
import { StatusBadge } from '@/components/data/status-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { listMyAssets } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function MyAssetsPage() {
  const assets = await listMyAssets();
  return (
    <>
      <PageHeader eyebrow="Assigned to me" visual="assets" title="My assets" description="Only assets assigned to your account are visible here. General inventory is managed by admins only." />
      {assets.length === 0 ? <EmptyState icon={PackageCheck} visual="assets" title="No assigned assets" description="When an admin assigns a company asset to you, it will appear here." /> : <div className="grid gap-5 md:grid-cols-2">{assets.map((asset) => <Card key={asset.id} id={asset.id} className="card-hover"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>{asset.name}</CardTitle><CardDescription>{asset.assetId} · {asset.model}</CardDescription></div><StatusBadge value={asset.status} /></div></CardHeader><CardContent className="grid gap-3 text-sm sm:grid-cols-2"><Detail label="Serial" value={asset.serialNumber} /><Detail label="Condition" value={asset.condition} /><Detail label="Location" value={asset.location} /><Detail label="Warranty" value={formatDate(asset.warrantyEndDate)} /><div className="sm:col-span-2"><Detail label="Specs" value={asset.specs || 'Not added'} /></div></CardContent></Card>)}</div>}
    </>
  );
}
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }
