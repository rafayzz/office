import Link from 'next/link';
import { ArrowLeft, Ban } from 'lucide-react';
import { StatusBadge } from '@/components/data/status-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { getInventoryItemById } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getInventoryItemById(id);
  if (!item) return <><Button asChild variant="ghost" className="px-0"><Link href="/admin/inventory"><ArrowLeft className="h-4 w-4" /> Back to inventory</Link></Button><EmptyState visual="inventory" title="Inventory item not found" description="This stock item may have been removed or you may not have access to it." /></>;
  const low = item.quantity <= item.reorderLevel;
  return (
    <>
      <Button asChild variant="ghost" className="px-0"><Link href="/admin/inventory"><ArrowLeft className="h-4 w-4" /> Back to inventory</Link></Button>
      <PageHeader eyebrow="Inventory record" visual="inventory" title={item.name} description="Quantity-based stock record. This page does not include QR fields." actions={<StatusBadge value={low ? 'Low stock' : 'Healthy'} />} />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card><CardHeader><CardTitle>Stock profile</CardTitle><CardDescription>Quantity, condition, reorder, and location details.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Detail label="Category" value={item.category} /><Detail label="Quantity" value={`${item.quantity} ${item.unit}`} /><Detail label="Location" value={item.location} /><Detail label="Reorder level" value={String(item.reorderLevel)} /><Detail label="Condition" value={<StatusBadge value={item.condition} />} /><Detail label="Updated" value={formatDate(item.updatedAt)} /><div className="sm:col-span-2"><Detail label="Notes" value={item.notes || 'No notes added'} /></div></CardContent></Card>
        <Card className="h-fit border-slate-950/10 bg-muted/20"><CardHeader><CardTitle className="flex items-center gap-2"><Ban className="h-4 w-4" /> No QR on inventory</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">Inventory is quantity-based office stock. QR codes, serial numbers, and assignment history are reserved for the Assets module only.</CardContent></Card>
      </div>
    </>
  );
}
function Detail({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-2xl border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 font-medium">{value}</div></div>; }
