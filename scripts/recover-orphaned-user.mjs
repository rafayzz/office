/**
 * recover-orphaned-user.mjs
 *
 * Fixes users who registered when Firestore rules weren't deployed.
 * Their Firebase Auth account exists but users/{uid} and employeeRequests/{uid}
 * docs are missing, so they can't re-register or be approved.
 *
 * Usage:
 *   node scripts/recover-orphaned-user.mjs --email rafaymrcs21@gmail.com --name "Rafay" --department Engineering
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const email      = arg('email');
const name       = arg('name') || email?.split('@')[0] || 'Employee';
const department = arg('department') || 'Unassigned';
const reason     = arg('reason') || 'Recovered account — Firestore write failed on initial signup.';

if (!email) {
  console.error('Usage: node scripts/recover-orphaned-user.mjs --email USER@EMAIL.COM [--name "Full Name"] [--department "Dept"] [--reason "..."]');
  process.exit(1);
}

const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin env vars. Make sure .env.local is loaded.');
  process.exit(1);
}

const app  = getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth(app);
const db   = getFirestore(app);

console.log(`\nLooking up Firebase Auth user for: ${email}...`);

let user;
try {
  user = await auth.getUserByEmail(email);
} catch {
  console.error(`No Firebase Auth user found for ${email}. They need to register fresh.`);
  process.exit(1);
}

const uid = user.uid;
console.log(`Found user — uid: ${uid}`);

// Check what already exists
const userDoc    = await db.collection('users').doc(uid).get();
const requestDoc = await db.collection('employeeRequests').doc(uid).get();

console.log(`users/${uid} exists:             ${userDoc.exists}`);
console.log(`employeeRequests/${uid} exists:  ${requestDoc.exists}`);

const now = FieldValue.serverTimestamp();

// Create/merge the users doc
if (!userDoc.exists) {
  await db.collection('users').doc(uid).set({
    uid,
    name,
    email,
    department,
    role: 'employee',
    status: 'pending',
    title: 'Employee',
    location: 'Not added',
    phone: '',
    manager: '',
    createdAt: now,
    updatedAt: now
  });
  console.log(`✅ Created users/${uid}`);
} else {
  console.log(`ℹ️  users/${uid} already exists — skipped.`);
}

// Create/merge the employeeRequests doc
if (!requestDoc.exists) {
  await db.collection('employeeRequests').doc(uid).set({
    uid,
    name,
    email,
    department,
    roleRequested: 'employee',
    reason,
    status: 'pending',
    requestedAt: now,
    createdAt: now
  });
  console.log(`✅ Created employeeRequests/${uid}`);
} else {
  console.log(`ℹ️  employeeRequests/${uid} already exists — skipped.`);
}

// Ensure custom claims are set to pending (no role yet)
await auth.setCustomUserClaims(uid, { role: 'employee', status: 'pending', employeeId: uid });
console.log(`✅ Custom claims set to: role=employee, status=pending`);

console.log(`\n✅ Recovery complete for ${email}`);
console.log(`   → Admin can now see and approve this request in the Employee Requests panel.`);
console.log(`   → After approval the user can log in to /employee/dashboard\n`);
