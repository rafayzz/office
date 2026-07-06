import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? '' : process.argv[index + 1] || '';
}

const uid = arg('uid');
const email = arg('email');
const name = arg('name') || 'OfficeOS Admin';
const department = arg('department') || 'Administration';
const title = arg('title') || 'Administrator';

if (!uid || !email) {
  console.error('Usage: npm run bootstrap:admin -- --uid FIREBASE_AUTH_UID --email admin@company.com --name "Admin Name"');
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in your environment.');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

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
