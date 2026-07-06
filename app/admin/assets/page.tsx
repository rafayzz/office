import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { listAssets } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function AssetsPage() {
  const assets = await listAssets();
  return (
    <>
      <PageHeader eyebrow="Individually trackable company items" visual="assets" title="Assets" description="Track laptops, phones, printers, monitors, routers, and other serialized assets. QR support exists only in this module." actions={<Button asChild><Link href="/admin/assets/new"><Plus className="h-4 w-4" /> New asset</Link></Button>} />
      <StatusTable
        rows={assets}
        emptyLabel="No assets yet. Add your first serialized company asset."
        viewHref={(row) => `/admin/assets/${row.id}`}
        columns={[
          { header: 'Asset', cell: (row) => <div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.assetId}</p></div> },
          { header: 'Type', cell: (row) => row.type },
          { header: 'Assigned to', cell: (row) => row.assignedEmployeeName || 'Unassigned' },
          { header: 'Warranty', cell: (row) => formatDate(row.warrantyEndDate) },
          { header: 'Condition', cell: (row) => <StatusBadge value={row.condition} /> },
          { header: 'Status', cell: (row) => <StatusBadge value={row.status} /> },
          { header: 'QR', cell: (row) => row.qrEnabled ? <StatusBadge value="Enabled" /> : <span className="text-muted-foreground">Off</span> }
        ]}
      />
    </>
  );
}
