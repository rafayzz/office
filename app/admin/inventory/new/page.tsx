import Link from 'next/link';
import { ArrowLeft, Ban } from 'lucide-react';
import { createInventoryItemFromForm } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Field, FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function NewInventoryPage() {
  return (
    <>
      <Button asChild variant="ghost" className="px-0"><Link href="/admin/inventory"><ArrowLeft className="h-4 w-4" /> Back to inventory</Link></Button>
      <PageHeader eyebrow="Create inventory item" visual="inventory" title="Add quantity-based stock" description="Use this for office stock counts, not individually trackable serialized assets." />
      <form action={createInventoryItemFromForm} className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <FormSection title="Inventory details" description="Inventory stores quantities and reorder levels. QR codes are intentionally not available here.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Item name"><Input name="name" placeholder="A4 Paper Reams" required /></Field>
            <Field label="Category"><Input name="category" placeholder="Stationery, furniture..." required /></Field>
            <Field label="Quantity"><Input name="quantity" type="number" min="0" placeholder="0" required /></Field>
            <Field label="Unit"><Input name="unit" placeholder="pcs, boxes, reams" required /></Field>
            <Field label="Location"><Input name="location" placeholder="Storage Cabinet A" required /></Field>
            <Field label="Reorder level"><Input name="reorderLevel" type="number" min="0" placeholder="10" required /></Field>
            <Field label="Condition"><Select name="condition" defaultValue="New"><option>New</option><option>Good</option><option>Usable</option><option>Damaged</option></Select></Field>
            <div className="sm:col-span-2"><Field label="Notes"><Textarea name="notes" placeholder="Supplier preference, internal notes, storage handling..." /></Field></div>
          </div>
        </FormSection>
        <FormSection title="Inventory boundary" description="This module is quantity-based only."><div className="rounded-2xl border border-slate-950/10 bg-muted/30 p-4 text-sm text-muted-foreground"><Ban className="mb-3 h-5 w-5 text-slate-950" /> QR labels, serial numbers, and assignment history belong to Assets, not Inventory.</div><Button className="mt-5 w-full">Create inventory item</Button></FormSection>
      </form>
    </>
  );
}
