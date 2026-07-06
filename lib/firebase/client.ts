import { getApps, initializeApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock-storage-bucket',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender-id',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'mock-app-id',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'mock-measurement-id'
};

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) return null;
  const { getAnalytics, isSupported } = await import('firebase/analytics');
  return (await isSupported()) ? getAnalytics(firebaseApp) : null;
}
