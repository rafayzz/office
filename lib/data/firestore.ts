import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { requireActiveUser, requireAdmin } from '@/lib/auth/session';
import type { Announcement, Asset, Employee, EmployeeRequest, InventoryItem, Ticket, TicketMessage, WorkspaceSettings } from '@/lib/types';

type FirestoreDoc = FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;

function toIso(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    return new Date(Number((value as { seconds: number }).seconds) * 1000).toISOString();
  }
  return String(value);
}

function docData<T>(doc: FirestoreDoc): T {
  return { id: doc.id, ...doc.data() } as T;
}

function normalizeEmployee(doc: FirestoreDoc): Employee {
  const data = doc.data() || {};
  return {
    id: doc.id,
    uid: data.uid || doc.id,
    name: data.name || data.email || 'Unnamed employee',
    email: data.email || '',
    department: data.department || 'Unassigned',
    title: data.title || 'Employee',
    role: data.role || 'employee',
    status: data.status || 'pending',
    location: data.location || 'Not added',
    joinedAt: toIso(data.joinedAt || data.approvedAt || data.createdAt),
    phone: data.phone || '',
    manager: data.manager || ''
  };
}

function normalizeRequest(doc: FirestoreDoc): EmployeeRequest {
  const data = doc.data() || {};
  const rawStatus = String(data.status || 'pending').toLowerCase();
  const status = rawStatus === 'approved' || rawStatus === 'rejected' ? rawStatus : 'pending';
  return {
    id: doc.id,
    uid: data.uid || doc.id,
    name: data.name || data.email || 'Unnamed request',
    email: data.email || '',
    department: data.department || 'Unassigned',
    roleRequested: data.roleRequested || 'employee',
    reason: data.reason || '',
    status,
    requestedAt: toIso(data.requestedAt || data.createdAt)
  };
}

function normalizeAsset(doc: FirestoreDoc): Asset {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: data.name || 'Untitled asset',
    type: data.type || 'Asset',
    assetId: data.assetId || doc.id,
    serialNumber: data.serialNumber || '',
    model: data.model || '',
    specs: data.specs || '',
    purchaseDate: toIso(data.purchaseDate),
    warrantyEndDate: toIso(data.warrantyEndDate),
    condition: data.condition || 'Good',
    status: data.status || 'Available',
    location: data.location || 'Not assigned',
    assignedEmployeeId: data.assignedEmployeeId || undefined,
    assignedEmployeeName: data.assignedEmployeeName || undefined,
    assignmentHistory: Array.isArray(data.assignmentHistory)
      ? data.assignmentHistory.map((item: Record<string, unknown>, index: number) => ({
          id: String(item.id || `${doc.id}-history-${index}`),
          employeeId: String(item.employeeId || ''),
          employeeName: String(item.employeeName || 'Unknown employee'),
          assignedAt: toIso(item.assignedAt),
          returnedAt: item.returnedAt ? toIso(item.returnedAt) : undefined,
          notes: item.notes ? String(item.notes) : undefined
        }))
      : [],
    qrEnabled: Boolean(data.qrEnabled),
    invoiceFilePath: data.invoiceFilePath,
    invoiceFileName: data.invoiceFileName,
    warrantyFilePath: data.warrantyFilePath,
    warrantyFileName: data.warrantyFileName
  };
}

function normalizeInventory(doc: FirestoreDoc): InventoryItem {
  const data = doc.data() || {};
  return {
    id: doc.id,
    name: data.name || 'Untitled item',
    category: data.category || 'General',
    quantity: Number(data.quantity || 0),
    unit: data.unit || 'pcs',
    location: data.location || 'Not assigned',
    reorderLevel: Number(data.reorderLevel || 0),
    condition: data.condition || 'Good',
    notes: data.notes || '',
    updatedAt: toIso(data.updatedAt || data.createdAt)
  };
}

function normalizeAnnouncement(doc: FirestoreDoc): Announcement {
  const data = doc.data() || {};
  return {
    id: doc.id,
    title: data.title || 'Untitled announcement',
    body: data.body || '',
    status: data.status || 'Draft',
    audience: data.audience || 'All employees',
    department: data.department,
    createdByName: data.createdByName || 'Admin',
    createdAt: toIso(data.createdAt),
    publishedAt: data.publishedAt ? toIso(data.publishedAt) : undefined
  };
}

function normalizeTicket(doc: FirestoreDoc, messages: TicketMessage[] = []): Ticket {
  const data = doc.data() || {};
  return {
    id: doc.id,
    subject: data.subject || 'Untitled ticket',
    category: data.category || 'General',
    priority: data.priority || 'Medium',
    status: data.status || 'Open',
    creatorId: data.creatorId || data.creatorUid || '',
    creatorName: data.creatorName || data.creatorEmail || 'Employee',
    creatorEmail: data.creatorEmail || '',
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt || data.createdAt),
    messages
  };
}

function normalizeMessage(doc: FirestoreDoc): TicketMessage {
  const data = doc.data() || {};
  return {
    id: doc.id,
    authorId: data.authorId || data.authorUid || '',
    authorName: data.authorName || 'User',
    authorRole: data.authorRole || 'employee',
    message: data.message || '',
    createdAt: toIso(data.createdAt),
    attachmentPath: data.attachmentPath,
    attachmentName: data.attachmentName
  };
}

async function getMessages(ticketId: string) {
  const snapshot = await adminDb.collection('tickets').doc(ticketId).collection('messages').orderBy('createdAt', 'asc').get();
  return snapshot.docs.map(normalizeMessage);
}

export async function getAdminDashboardData() {
  noStore();
  await requireAdmin();
  const [usersSnap, requestsSnap, assetsSnap, inventorySnap, ticketsSnap] = await Promise.all([
    adminDb.collection('users').limit(200).get(),
    adminDb.collection('employeeRequests').limit(50).get(),
    adminDb.collection('assets').limit(200).get(),
    adminDb.collection('inventoryItems').limit(200).get(),
    adminDb.collection('tickets').limit(100).get()
  ]);

  const employees = usersSnap.docs.map(normalizeEmployee);
  const requests = requestsSnap.docs.map(normalizeRequest).sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  const assets = assetsSnap.docs.map(normalizeAsset);
  const inventoryItems = inventorySnap.docs.map(normalizeInventory);
  const tickets = ticketsSnap.docs.map((doc) => normalizeTicket(doc)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return {
    employees,
    employeeRequests: requests,
    assets,
    inventoryItems,
    tickets,
    stats: {
      activeEmployees: employees.filter((employee) => employee.status === 'active').length,
      pendingRequests: requests.filter((request) => request.status === 'pending').length,
      assignedAssets: assets.filter((asset) => asset.status === 'Assigned').length,
      openTickets: tickets.filter((ticket) => !['Resolved', 'Closed'].includes(ticket.status)).length
    }
  };
}

export async function listEmployeeRequests() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('employeeRequests').orderBy('requestedAt', 'desc').get();
  return snapshot.docs.map(normalizeRequest);
}

export async function listEmployees() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('users').orderBy('name', 'asc').get();
  return snapshot.docs.map(normalizeEmployee);
}

export async function getEmployeeById(id: string) {
  noStore();
  await requireAdmin();
  const direct = await adminDb.collection('users').doc(id).get();
  if (direct.exists) return normalizeEmployee(direct);
  const byUid = await adminDb.collection('users').where('uid', '==', id).limit(1).get();
  return byUid.empty ? null : normalizeEmployee(byUid.docs[0]);
}

export async function listEmployeeAssignedAssets(employeeUid: string) {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('assets').where('assignedEmployeeId', '==', employeeUid).get();
  return snapshot.docs.map(normalizeAsset);
}

export async function listAssets() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('assets').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(normalizeAsset);
}

export async function getAssetById(id: string) {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('assets').doc(id).get();
  return snapshot.exists ? normalizeAsset(snapshot) : null;
}

export async function listInventoryItems() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('inventoryItems').orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map(normalizeInventory);
}

export async function getInventoryItemById(id: string) {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('inventoryItems').doc(id).get();
  return snapshot.exists ? normalizeInventory(snapshot) : null;
}

export async function listAdminTickets() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('tickets').orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map((doc) => normalizeTicket(doc));
}

export async function getAdminTicketById(id: string) {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('tickets').doc(id).get();
  return snapshot.exists ? normalizeTicket(snapshot, await getMessages(id)) : null;
}

export async function listAdminAnnouncements() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('announcements').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(normalizeAnnouncement);
}

export async function getReportsData() {
  noStore();
  return getAdminDashboardData();
}

export async function getMyProfile() {
  noStore();
  const user = await requireActiveUser();
  const snapshot = await adminDb.collection('users').doc(user.uid).get();
  if (snapshot.exists) return normalizeEmployee(snapshot);
  return {
    id: user.uid,
    uid: user.uid,
    name: user.name || user.email || 'Employee',
    email: user.email || '',
    department: user.department || 'Unassigned',
    title: user.title || 'Employee',
    role: user.role,
    status: user.status,
    location: 'Not added',
    joinedAt: '',
    phone: '',
    manager: ''
  } satisfies Employee;
}

export async function getEmployeeDashboardData() {
  noStore();
  const profile = await getMyProfile();
  const [assets, tickets, announcements] = await Promise.all([listMyAssets(), listMyTickets(), listPublishedAnnouncements()]);
  return { profile, assets, tickets, announcements };
}

export async function listMyAssets() {
  noStore();
  const user = await requireActiveUser();
  const snapshot = await adminDb.collection('assets').where('assignedEmployeeId', '==', user.uid).get();
  return snapshot.docs.map(normalizeAsset);
}

export async function listMyTickets() {
  noStore();
  const user = await requireActiveUser();
  const snapshot = await adminDb.collection('tickets').where('creatorId', '==', user.uid).orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map((doc) => normalizeTicket(doc));
}

export async function getMyTicketById(id: string) {
  noStore();
  const user = await requireActiveUser();
  const snapshot = await adminDb.collection('tickets').doc(id).get();
  if (!snapshot.exists) return null;
  const ticket = normalizeTicket(snapshot, await getMessages(id));
  return ticket.creatorId === user.uid || user.role === 'admin' ? ticket : null;
}

export async function listPublishedAnnouncements() {
  noStore();
  await requireActiveUser();
  const snapshot = await adminDb.collection('announcements').where('status', '==', 'Published').orderBy('publishedAt', 'desc').get();
  return snapshot.docs.map(normalizeAnnouncement);
}

export async function listEmployeesForAssignment() {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('users').where('status', '==', 'active').orderBy('name', 'asc').get();
  return snapshot.docs.map(normalizeEmployee);
}


export async function getWorkspaceSettings(): Promise<WorkspaceSettings> {
  noStore();
  await requireAdmin();
  const snapshot = await adminDb.collection('settings').doc('workspace').get();
  const data = snapshot.exists ? snapshot.data() || {} : {};
  return {
    id: 'workspace',
    companyName: data.companyName || 'Your company',
    defaultLocation: data.defaultLocation || 'HQ - Main Office',
    timezone: data.timezone || 'Asia/Karachi',
    lowStockNotifications: data.lowStockNotifications || 'enabled',
    defaultSignupStatus: 'pending',
    defaultApprovedRole: 'employee',
    rejectedUserRedirect: data.rejectedUserRedirect || '/pending-approval',
    updatedAt: toIso(data.updatedAt)
  };
}
