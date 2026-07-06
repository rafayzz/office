'use server';

import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'officeos_session';
const SESSION_EXPIRES_IN_DAYS = Number(process.env.SESSION_EXPIRES_IN_DAYS || 7);

export async function createSession(idToken: string) {
  try {
    const expiresIn = SESSION_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return {
      success: true,
      uid: decoded.uid,
      email: decoded.email || null,
      role: decoded.role || null,
      status: decoded.status || null
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown Server Action Error' };
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
