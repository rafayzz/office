'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminDb, getAdminFieldValue } from '@/lib/firebase/admin';
import { uploadFormFile } from '@/lib/files/upload';
import { requireActiveUser } from '@/lib/auth/session';
import { ticketSchema } from '@/lib/validators';

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === 'string' ? raw.trim() : '';
}

export async function createPrivateTicketFromForm(formData: FormData) {
  const user = await requireActiveUser();
  const parsed = ticketSchema.parse({
    subject: value(formData, 'subject'),
    category: value(formData, 'category'),
    priority: value(formData, 'priority'),
    message: value(formData, 'message')
  });

  const ref = await adminDb.collection('tickets').add({
    subject: parsed.subject,
    category: parsed.category,
    priority: parsed.priority,
    status: 'Open',
    creatorId: user.uid,
    creatorUid: user.uid,
    creatorName: user.name || user.email || 'Employee',
    creatorEmail: user.email || '',
    createdAt: getAdminFieldValue().serverTimestamp(),
    updatedAt: getAdminFieldValue().serverTimestamp()
  });

  const attachment = await uploadFormFile(formData.get('attachment'), `tickets/${ref.id}/${user.uid}`);

  await ref.collection('messages').add({
    authorId: user.uid,
    authorUid: user.uid,
    authorName: user.name || user.email || 'Employee',
    authorRole: user.role,
    message: parsed.message,
    attachmentPath: attachment?.path || null,
    attachmentName: attachment?.name || null,
    createdAt: getAdminFieldValue().serverTimestamp()
  });

  revalidatePath('/employee/tickets');
  redirect(`/employee/tickets/${ref.id}`);
}

export async function replyToTicketFromForm(formData: FormData) {
  const user = await requireActiveUser();
  const ticketId = value(formData, 'ticketId');
  const message = value(formData, 'message');
  if (!ticketId || message.length < 2) throw new Error('Message is required');

  const ticketRef = adminDb.collection('tickets').doc(ticketId);
  const ticket = await ticketRef.get();
  if (!ticket.exists) throw new Error('Ticket not found');
  const data = ticket.data();

  if (user.role !== 'admin' && data?.creatorId !== user.uid) throw new Error('Ticket access denied');

  const attachment = await uploadFormFile(formData.get('attachment'), `tickets/${ticketId}/${user.uid}`);

  await ticketRef.collection('messages').add({
    authorId: user.uid,
    authorUid: user.uid,
    authorName: user.name || user.email || 'User',
    authorRole: user.role,
    message,
    attachmentPath: attachment?.path || null,
    attachmentName: attachment?.name || null,
    createdAt: getAdminFieldValue().serverTimestamp()
  });
  await ticketRef.update({ updatedAt: getAdminFieldValue().serverTimestamp(), status: user.role === 'admin' ? 'Waiting employee' : 'In review' });

  revalidatePath('/employee/tickets');
  revalidatePath('/admin/tickets');
  revalidatePath(`/employee/tickets/${ticketId}`);
  revalidatePath(`/admin/tickets/${ticketId}`);
}
