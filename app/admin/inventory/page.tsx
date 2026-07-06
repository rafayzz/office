import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, StatusTable } from '@/components/data/status-table';
import { listInventoryItems } from '@/lib/data/firestore';
import { formatDate } from '@/lib/utils';

export default async function InventoryPage() {
  const inventoryItems = await listInventoryItems();
  return (
    <>
      <PageHeader eyebrow="Quantity-based office stock" visual="inventory" title="General inventory" description="Manage stationery, furniture, kitchen stock, cleaning supplies, and other quantity-based office items. No QR fields are used here." actions={<Button asChild><Link href="/admin/inventory/new"><Plus className="h-4 w-4" /> New inventory item</Link></Button>} />
      <StatusTable
        rows={inventoryItems}
        emptyLabel="No inventory items yet. Add office stock without QR fields."
        viewHref={(row) => `/admin/inventory/${row.id}`}
        columns={[
          { header: 'Item', cell: (row) => <div><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.category}</p></div> },
          { header: 'Quantity', cell: (row) => `${row.quantity} ${row.unit}` },
          { header: 'Location', cell: (row) => row.location },
          { header: 'Reorder level', cell: (row) => row.reorderLevel },
          { header: 'Condition', cell: (row) => <StatusBadge value={row.condition} /> },
          { header: 'Stock', cell: (row) => row.quantity <= row.reorderLevel ? <StatusBadge value="Low stock" /> : <StatusBadge value="Healthy" /> },
          { header: 'Updated', cell: (row) => formatDate(row.updatedAt) }
        ]}
      />
    </>
  );
}
