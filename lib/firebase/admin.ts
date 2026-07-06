import 'server-only';
import type { App } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

type AdminAppModule = typeof import('firebase-admin/app');
type AdminAuthModule = typeof import('firebase-admin/auth');
type AdminFirestoreModule = typeof import('firebase-admin/firestore');
type AdminStorageModule = typeof import('firebase-admin/storage');

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  return key?.replace(/\\n/g, '\n');
}

function getAdminApp(): App {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cert, getApps, initializeApp } = require('firebase-admin/app') as AdminAppModule;
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK environment variables are not configured.');
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
}

function lazyProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, property, receiver) {
      const instance = factory();
      const value = Reflect.get(instance, property, receiver);
      return typeof value === 'function' ? value.bind(instance) : value;
    }
  });
}

export function getAdminFieldValue(): AdminFirestoreModule['FieldValue'] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FieldValue } = require('firebase-admin/firestore') as AdminFirestoreModule;
  return FieldValue;
}

export const adminAuth = lazyProxy<Auth>(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAuth } = require('firebase-admin/auth') as AdminAuthModule;
  return getAuth(getAdminApp());
});

export const adminDb = lazyProxy<Firestore>(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getFirestore } = require('firebase-admin/firestore') as AdminFirestoreModule;
  const db = getFirestore(getAdminApp());
  db.settings({ ignoreUndefinedProperties: true });
  return db;
});

export const adminStorage = lazyProxy<Storage>(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getStorage } = require('firebase-admin/storage') as AdminStorageModule;
  return getStorage(getAdminApp());
});
