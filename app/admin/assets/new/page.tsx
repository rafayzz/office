import Link from 'next/link';
import { ArrowLeft, QrCode, ShieldCheck } from 'lucide-react';
import { createAssetFromForm } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Field, FormSection } from '@/components/ui/form-section';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { listEmployeesForAssignment } from '@/lib/data/firestore';

export default async function NewAssetPage() {
  const employees = await listEmployeesForAssignment();
  return (
    <>
      <Button asChild variant="ghost" className="px-0"><Link href="/admin/assets"><ArrowLeft className="h-4 w-4" /> Back to assets</Link></Button>
      <PageHeader eyebrow="Create asset" visual="assets" title="Add a trackable asset" description="Use this form for serialized company assets only. General office stock belongs in Inventory." />
      <form action={createAssetFromForm} className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <FormSection title="Asset details" description="Individually trackable item with serial and assignment history.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Asset name"><Input name="name" placeholder="MacBook Pro 14" required /></Field>
            <Field label="Asset type"><Input name="type" placeholder="Laptop, phone, printer..." required /></Field>
            <Field label="Asset ID"><Input name="assetId" placeholder="AOS-LAP-0001" required /></Field>
            <Field label="Serial number"><Input name="serialNumber" placeholder="Device serial number" required /></Field>
            <Field label="Model"><Input name="model" placeholder="Model name" required /></Field>
            <Field label="Location"><Input name="location" placeholder="HQ - IT Store" required /></Field>
            <Field label="Purchase date"><Input name="purchaseDate" type="date" required /></Field>
            <Field label="Warranty end date"><Input name="warrantyEndDate" type="date" required /></Field>
            <Field label="Condition"><Select name="condition" defaultValue="Good"><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs repair</option></Select></Field>
            <Field label="Status"><Select name="status" defaultValue="Available"><option>Available</option><option>Maintenance</option><option>Retired</option></Select></Field>
            <div className="sm:col-span-2"><Field label="Specs"><Textarea name="specs" placeholder="RAM, storage, screen size, configuration..." /></Field></div>
          </div>
        </FormSection>
        <div className="space-y-5">
          <FormSection title="Assignment" description="Optional employee assignment.">
            <div className="space-y-4"><Field label="Assigned employee"><Select name="assignedEmployeeId" defaultValue=""><option value="">Unassigned</option>{employees.map((employee) => <option key={employee.uid} value={employee.uid}>{employee.name}</option>)}</Select></Field><Field label="Assignment note"><Textarea name="assignmentNote" placeholder="Condition at handover, accessories included..." /></Field></div>
          </FormSection>
          <FormSection title="Asset documents" description="Attach invoice and warranty files. They upload to protected Firebase Storage paths for admins only."><div className="space-y-4"><div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs leading-5 text-emerald-900"><ShieldCheck className="mb-2 h-4 w-4" />Files are saved with the asset record and opened through a protected signed route.</div><Field label="Invoice"><Input name="invoiceFile" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" /></Field><Field label="Warranty document"><Input name="warrantyFile" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" /></Field></div></FormSection>
          <FormSection title="QR label" description="QR is optional and assets only."><label className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-4 text-sm"><input name="qrEnabled" type="checkbox" className="h-4 w-4 rounded" /><QrCode className="h-4 w-4 text-muted-foreground" />Enable QR label for this asset</label></FormSection>
          <Button className="w-full">Create asset</Button>
        </div>
      </form>
    </>
  );
}
