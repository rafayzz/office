'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb, getAdminFieldValue } from '@/lib/firebase/admin';
import { requireAdmin } from '@/lib/auth/session';
import { announcementSchema, assetSchema, inventorySchema } from '@/lib/validators';
import { uploadFormFile } from '@/lib/files/upload';
import type { TicketStatus } from '@/lib/types';

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === 'string' ? raw.trim() : '';
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

export async function approveEmployeeRequestAction(formData: FormData) {
  const requestId = value(formData, 'requestId');
  const uid = value(formData, 'uid');
  await approveEmployeeRequest(requestId, uid);
  revalidatePath('/admin/employee-requests');
  revalidatePath('/admin/employees');
}

export async function rejectEmployeeRequestAction(formData: FormData) {
  const requestId = value(formData, 'requestId');
  await rejectEmployeeRequest(requestId);
  revalidatePath('/admin/employee-requests');
}

export async function approveEmployeeRequest(requestId: string, uid: string) {
  const actor = await requireAdmin();
  if (!requestId || !uid) throw new Error('Request ID and user ID are required');

  const requestRef = adminDb.collection('employeeRequests').doc(requestId);
  const request = await requestRef.get();
  if (!request.exists) throw new Error('Request not found');
  const requestData = request.data();

  await adminAuth.setCustomUserClaims(uid, { role: 'employee', status: 'active', employeeId: uid });
  await adminDb.collection('users').doc(uid).set(
    {
      uid,
      name: requestData?.name || '',
      email: requestData?.email || '',
      department: requestData?.department || 'Unassigned',
      title: requestData?.title || 'Employee',
      role: 'employee',
      status: 'active',
      approvedAt: getAdminFieldValue().serverTimestamp(),
      approvedBy: actor.uid,
      updatedAt: getAdminFieldValue().serverTimestamp()
    },
    { merge: true }
  );

  await requestRef.update({ status: 'approved', approvedAt: getAdminFieldValue().serverTimestamp(), approvedBy: actor.uid });
  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'employee approved', 'employeeRequests', requestId);
  revalidatePath('/admin/employee-requests');
  revalidatePath('/admin/employees');
  revalidatePath('/admin/dashboard');
}

export async function rejectEmployeeRequest(requestId: string) {
  const actor = await requireAdmin();
  const requestRef = adminDb.collection('employeeRequests').doc(requestId);
  const request = await requestRef.get();
  if (!request.exists) throw new Error('Request not found');
  const data = request.data();
  const uid = data?.uid;

  if (uid) {
    await adminAuth.setCustomUserClaims(uid, { role: 'employee', status: 'rejected', employeeId: uid });
    await adminDb.collection('users').doc(uid).set(
      { status: 'rejected', rejectedAt: getAdminFieldValue().serverTimestamp(), rejectedBy: actor.uid, updatedAt: getAdminFieldValue().serverTimestamp() },
      { merge: true }
    );
  }

  await requestRef.update({ status: 'rejected', rejectedAt: getAdminFieldValue().serverTimestamp(), rejectedBy: actor.uid });
  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'employee rejected', 'employeeRequests', requestId);
  revalidatePath('/admin/employee-requests');
  revalidatePath('/admin/dashboard');
}

export async function createAssetFromForm(formData: FormData) {
  const actor = await requireAdmin();
  const assignedEmployeeId = value(formData, 'assignedEmployeeId');
  let assignedEmployeeName = '';

  if (assignedEmployeeId) {
    const employee = await adminDb.collection('users').doc(assignedEmployeeId).get();
    assignedEmployeeName = employee.data()?.name || employee.data()?.email || '';
  }

  const parsed = assetSchema.parse({
    name: value(formData, 'name'),
    type: value(formData, 'type'),
    assetId: value(formData, 'assetId'),
    serialNumber: value(formData, 'serialNumber'),
    model: value(formData, 'model'),
    specs: value(formData, 'specs'),
    purchaseDate: value(formData, 'purchaseDate'),
    warrantyEndDate: value(formData, 'warrantyEndDate'),
    condition: value(formData, 'condition'),
    status: assignedEmployeeId ? 'Assigned' : value(formData, 'status'),
    location: value(formData, 'location'),
    assignedEmployeeId: assignedEmployeeId || undefined,
    qrEnabled: boolValue(formData, 'qrEnabled')
  });

  const assignmentHistory = assignedEmployeeId
    ? [
        {
          id: crypto.randomUUID(),
          employeeId: assignedEmployeeId,
          employeeName: assignedEmployeeName,
          assignedAt: new Date().toISOString(),
          notes: value(formData, 'assignmentNote') || 'Initial assignment'
        }
      ]
    : [];

  const ref = adminDb.collection('assets').doc();
  const [invoice, warranty] = await Promise.all([
    uploadFormFile(formData.get('invoiceFile'), `assets/${ref.id}/documents`),
    uploadFormFile(formData.get('warrantyFile'), `assets/${ref.id}/documents`)
  ]);

  await ref.set({
    ...parsed,
    assignedEmployeeName: assignedEmployeeName || null,
    assignmentHistory,
    invoiceFilePath: invoice?.path || null,
    invoiceFileName: invoice?.name || null,
    warrantyFilePath: warranty?.path || null,
    warrantyFileName: warranty?.name || null,
    createdAt: getAdminFieldValue().serverTimestamp(),
    updatedAt: getAdminFieldValue().serverTimestamp(),
    createdBy: actor.uid
  });

  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'asset created', 'assets', ref.id);
  if (assignedEmployeeId) await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'asset assigned', 'assets', ref.id);
  revalidatePath('/admin/assets');
  redirect(`/admin/assets/${ref.id}`);
}

export async function createInventoryItemFromForm(formData: FormData) {
  const actor = await requireAdmin();
  const parsed = inventorySchema.parse({
    name: value(formData, 'name'),
    category: value(formData, 'category'),
    quantity: value(formData, 'quantity'),
    unit: value(formData, 'unit'),
    location: value(formData, 'location'),
    reorderLevel: value(formData, 'reorderLevel'),
    condition: value(formData, 'condition'),
    notes: value(formData, 'notes')
  });

  const ref = await adminDb.collection('inventoryItems').add({
    ...parsed,
    createdAt: getAdminFieldValue().serverTimestamp(),
    updatedAt: getAdminFieldValue().serverTimestamp(),
    createdBy: actor.uid
  });

  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'inventory created', 'inventoryItems', ref.id);
  revalidatePath('/admin/inventory');
  redirect(`/admin/inventory/${ref.id}`);
}

export async function createAnnouncementFromForm(formData: FormData) {
  const actor = await requireAdmin();
  const parsed = announcementSchema.parse({
    title: value(formData, 'title'),
    body: value(formData, 'body'),
    audience: value(formData, 'audience'),
    status: value(formData, 'status')
  });

  const now = getAdminFieldValue().serverTimestamp();
  const ref = await adminDb.collection('announcements').add({
    ...parsed,
    createdAt: now,
    updatedAt: now,
    createdBy: actor.uid,
    createdByName: actor.name || actor.email || 'Admin',
    publishedAt: parsed.status === 'Published' ? now : null
  });

  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'announcement created', 'announcements', ref.id);
  revalidatePath('/admin/announcements');
}

export async function completeOffboarding(employeeUid: string, returnedAssetIds: string[]) {
  const actor = await requireAdmin();
  if (!employeeUid) throw new Error('Employee ID is required');

  const assignedAssets = await adminDb.collection('assets').where('assignedEmployeeId', '==', employeeUid).get();
  const requiredIds = assignedAssets.docs.map((doc) => doc.id).sort();
  const returnedIds = [...returnedAssetIds].sort();

  if (requiredIds.some((id, index) => id !== returnedIds[index]) || requiredIds.length !== returnedIds.length) {
    throw new Error('All assigned assets must be returned before deactivation');
  }

  const batch = adminDb.batch();
  const now = new Date().toISOString();

  for (const assetDoc of assignedAssets.docs) {
    const data = assetDoc.data();
    const history = Array.isArray(data.assignmentHistory) ? data.assignmentHistory : [];
    const updatedHistory = history.map((entry: Record<string, unknown>) =>
      entry.employeeId === employeeUid && !entry.returnedAt ? { ...entry, returnedAt: now, notes: `${entry.notes || ''} Returned during offboarding.`.trim() } : entry
    );
    batch.update(assetDoc.ref, {
      assignedEmployeeId: null,
      assignedEmployeeName: null,
      status: 'Available',
      assignmentHistory: updatedHistory,
      updatedAt: getAdminFieldValue().serverTimestamp()
    });
  }

  batch.update(adminDb.collection('users').doc(employeeUid), {
    status: 'deactivated',
    deactivatedAt: getAdminFieldValue().serverTimestamp(),
    deactivatedBy: actor.uid,
    updatedAt: getAdminFieldValue().serverTimestamp()
  });

  await batch.commit();
  await adminAuth.setCustomUserClaims(employeeUid, { role: 'employee', status: 'deactivated', employeeId: employeeUid });
  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'employee deactivated', 'users', employeeUid);
  revalidatePath('/admin/employees');
  revalidatePath(`/admin/employees/${employeeUid}`);
}


export async function updateTicketStatusFromForm(formData: FormData) {
  const ticketId = value(formData, 'ticketId');
  const status = value(formData, 'status') as TicketStatus;
  await updateTicketStatus(ticketId, status);
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
  const actor = await requireAdmin();
  const allowed: TicketStatus[] = ['Open', 'In review', 'Waiting employee', 'Resolved', 'Closed'];
  if (!ticketId || !allowed.includes(status)) throw new Error('A valid ticket status is required');

  const ticketRef = adminDb.collection('tickets').doc(ticketId);
  const ticket = await ticketRef.get();
  if (!ticket.exists) throw new Error('Ticket not found');

  await ticketRef.update({
    status,
    updatedAt: getAdminFieldValue().serverTimestamp(),
    statusUpdatedAt: getAdminFieldValue().serverTimestamp(),
    statusUpdatedBy: actor.uid
  });
  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', `ticket status changed to ${status}`, 'tickets', ticketId);
  revalidatePath('/admin/tickets');
  revalidatePath(`/admin/tickets/${ticketId}`);
}

export async function saveWorkspaceSettingsFromForm(formData: FormData) {
  const actor = await requireAdmin();
  const payload = {
    companyName: value(formData, 'companyName') || 'Your company',
    defaultLocation: value(formData, 'defaultLocation') || 'HQ - Main Office',
    timezone: value(formData, 'timezone') || 'Asia/Karachi',
    lowStockNotifications: value(formData, 'lowStockNotifications') === 'disabled' ? 'disabled' : 'enabled',
    defaultSignupStatus: 'pending',
    defaultApprovedRole: 'employee',
    rejectedUserRedirect: value(formData, 'rejectedUserRedirect') || '/pending-approval',
    updatedAt: getAdminFieldValue().serverTimestamp(),
    updatedBy: actor.uid
  };

  await adminDb.collection('settings').doc('workspace').set(payload, { merge: true });
  await writeAuditLog(actor.uid, actor.name || actor.email || 'Admin', 'workspace settings updated', 'settings', 'workspace');
  revalidatePath('/admin/settings');
}

async function writeAuditLog(actorId: string, actorName: string, action: string, entityType: string, entityId: string) {
  await adminDb.collection('auditLogs').add({
    actorId,
    actorName,
    action,
    entityType,
    entityId,
    createdAt: getAdminFieldValue().serverTimestamp()
  });
}
