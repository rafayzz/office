import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function argument(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const uid = argument('uid');
const email = argument('email');
const name = argument('name') || 'OfficeOS Admin';
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!uid || !email) {
  console.error('Usage: yarn bootstrap:admin -- --uid FIREBASE_UID --email admin@company.com --name "Admin Name"');
  process.exit(1);
}

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.');
  process.exit(1);
}

const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
await getAuth(app).setCustomUserClaims(uid, { role: 'admin', status: 'active' });
await getFirestore(app).collection('users').doc(uid).set({ uid, email, name, role: 'admin', status: 'active', updatedAt: new Date() }, { merge: true });
console.log(`Admin access enabled for ${email}.`);
