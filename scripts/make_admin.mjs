import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.*?)"?$/);
  if (match) {
    let val = match[2];
    val = val.replace(/\\n/g, '\n');
    env[match[1]] = val;
  }
});

const projectId = env['FIREBASE_PROJECT_ID'];
const clientEmail = env['FIREBASE_CLIENT_EMAIL'];
const privateKey = env['FIREBASE_PRIVATE_KEY'];

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const uid = 'zInPCp6DDfWakNZbsKja95QOKZm1';
const email = 'john@gmail.com';
const name = 'john';
const department = 'Administration';
const title = 'Administrator';

async function makeAdmin() {
  const auth = getAuth();
  const db = getFirestore();

  await auth.setCustomUserClaims(uid, { role: 'admin', status: 'active', employeeId: uid });
  await db.collection('users').doc(uid).set({
    uid,
    name,
    email,
    department,
    title,
    role: 'admin',
    status: 'active',
    location: 'HQ',
    joinedAt: FieldValue.serverTimestamp(),
    approvedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
  console.log(`Admin bootstrapped: ${email} (${uid})`);
}

makeAdmin().catch(console.error);
