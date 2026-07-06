import Link from 'next/link';
import { ArrowLeft, FileText, History, PackageCheck } from 'lucide-react';
import { AssetQrLabel } from '@/components/assets/qr-label';
import { StatusBadge } from '@/components/data/status-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { getAssetById } from '@/lib/data/firestore';
import { protectedFileHref } from '@/lib/files/upload';
import { formatDate } from '@/lib/utils';

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await getAssetById(id);
  if (!asset) return <><Button asChild variant="ghost" className="px-0"><Link href="/admin/assets"><ArrowLeft className="h-4 w-4" /> Back to assets</Link></Button><EmptyState visual="assets" title="Asset not found" description="This asset may have been removed or you may not have access to it." /></>;
  return (
    <>
      <Button asChild variant="ghost" className="px-0"><Link href="/admin/assets"><ArrowLeft className="h-4 w-4" /> Back to assets</Link></Button>
      <PageHeader eyebrow="Asset record" visual="assets" title={asset.name} description={`${asset.assetId} · ${asset.model}. Individually trackable item with serial, warranty, and assignment history.`} actions={<StatusBadge value={asset.status} />} />
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <Card><CardHeader><CardTitle>Asset profile</CardTitle><CardDescription>Core asset metadata and ownership state.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Asset ID" value={asset.assetId} /><Detail label="Serial number" value={asset.serialNumber} /><Detail label="Type" value={asset.type} /><Detail label="Model" value={asset.model} /><Detail label="Purchase date" value={formatDate(asset.purchaseDate)} /><Detail label="Warranty ends" value={formatDate(asset.warrantyEndDate)} /><Detail label="Condition" value={<StatusBadge value={asset.condition} />} /><Detail label="Location" value={asset.location} /><div className="sm:col-span-2"><Detail label="Specs" value={asset.specs || 'Not added'} /></div><div className="sm:col-span-2"><Detail label="Assigned employee" value={asset.assignedEmployeeName || 'Unassigned'} /></div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Assignment history</CardTitle></CardHeader><CardContent className="space-y-3">
            {asset.assignmentHistory.length === 0 ? <p className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">No assignment history yet.</p> : asset.assignmentHistory.map((item) => <div key={item.id} className="rounded-2xl border bg-card p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-medium">{item.employeeName}</p><p className="text-xs text-muted-foreground">Assigned {formatDate(item.assignedAt)} {item.returnedAt ? `· Returned ${formatDate(item.returnedAt)}` : ''}</p></div><PackageCheck className="h-4 w-4 text-muted-foreground" /></div>{item.notes ? <p className="mt-3 text-sm text-muted-foreground">{item.notes}</p> : null}</div>)}
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" /> Documents</CardTitle><CardDescription>Invoice and warranty documents are protected by Storage rules.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><DocumentLabel label="Invoice" path={asset.invoiceFilePath} fileName={asset.invoiceFileName} /><DocumentLabel label="Warranty" path={asset.warrantyFilePath} fileName={asset.warrantyFileName} /></CardContent></Card>
        </div>
        <Card className="h-fit"><CardHeader><CardTitle>Printable QR label</CardTitle><CardDescription>QR labels are available for assets only. Inventory never receives QR fields.</CardDescription></CardHeader><CardContent><AssetQrLabel asset={asset} /></CardContent></Card>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-2xl border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 font-medium">{value}</div></div>; }
function DocumentLabel({ label, path, fileName }: { label: string; path?: string; fileName?: string }) { return <div className="rounded-2xl border bg-muted/20 p-4"><p className="text-sm font-medium">{label}</p>{path ? <><p className="mt-1 truncate text-xs text-muted-foreground">{fileName || path.split('/').pop()}</p><Button asChild variant="outline" size="sm" className="mt-3 rounded-2xl"><a href={protectedFileHref(path)} target="_blank" rel="noreferrer">Open document</a></Button></> : <p className="mt-1 text-xs text-muted-foreground">No file uploaded yet</p>}</div>; }
