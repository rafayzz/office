import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase/admin';
import { requireActiveUser } from '@/lib/auth/session';

function parseTicketId(path: string) {
  const parts = path.split('/');
  return parts[0] === 'tickets' ? parts[1] : null;
}

export async function GET(request: NextRequest) {
  const user = await requireActiveUser();
  const path = request.nextUrl.searchParams.get('path') || '';

  if (!path || path.includes('..') || path.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  const isAssetDocument = path.startsWith('assets/');
  const ticketId = parseTicketId(path);

  if (isAssetDocument && user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can open asset documents' }, { status: 403 });
  }

  if (ticketId) {
    const ticket = await adminDb.collection('tickets').doc(ticketId).get();
    if (!ticket.exists) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    const creatorId = ticket.data()?.creatorId || ticket.data()?.creatorUid;
    if (user.role !== 'admin' && creatorId !== user.uid) {
      return NextResponse.json({ error: 'File access denied' }, { status: 403 });
    }
  }

  if (!isAssetDocument && !ticketId) {
    return NextResponse.json({ error: 'Unsupported file path' }, { status: 403 });
  }

  const [url] = await adminStorage.bucket().file(path).getSignedUrl({
    action: 'read',
    expires: Date.now() + 5 * 60 * 1000
  });

  return NextResponse.redirect(url);
}
