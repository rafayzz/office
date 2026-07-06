import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserRole, UserStatus } from '@/lib/types';

export type SessionUser = {
  uid: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  employeeId?: string;
  name?: string;
  title?: string;
  department?: string;
};

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'officeos_session';

export async function verifySession(): Promise<SessionUser> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) throw new Error('Missing session');

  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  const profileSnap = await adminDb.collection('users').doc(decoded.uid).get();
  const profile = profileSnap.exists ? profileSnap.data() : null;

  const role = (decoded.role || profile?.role || 'employee') as UserRole;
  const status = (decoded.status || profile?.status || 'pending') as UserStatus;

  return {
    uid: decoded.uid,
    email: decoded.email || profile?.email,
    role,
    status,
    employeeId: (decoded.employeeId as string | undefined) || profile?.uid || decoded.uid,
    name: (decoded.name as string | undefined) || profile?.name || decoded.email,
    title: profile?.title,
    department: profile?.department
  };
}

export async function requireActiveUser() {
  const user = await verifySession();
  if (user.status === 'pending' || user.status === 'rejected' || user.status === 'deactivated') {
    redirect('/pending-approval');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireActiveUser();
  if (user.role !== 'admin') throw new Error('Admin access required');
  return user;
}

export async function requireEmployee() {
  const user = await requireActiveUser();
  if (user.role !== 'employee') throw new Error('Employee access required');
  return user;
}

export async function getUserProfile(uid: string) {
  const snapshot = await adminDb.collection('users').doc(uid).get();
  return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
}
