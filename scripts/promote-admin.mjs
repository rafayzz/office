import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!key) continue;
    let value = rest.join('=');
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        parsed[key] = next;
        i += 1;
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}

async function main() {
  const projectRoot = path.resolve(process.cwd());
  const envPath = path.join(projectRoot, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env.local in project root.');
    process.exit(1);
  }

  const env = loadEnv(envPath);
  const projectId = env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase admin env vars. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local.');
    process.exit(1);
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey })
  });

  const auth = getAuth();
  const db = getFirestore();

  const args = parseArgs();
  const uid = args.uid;
  const email = args.email;
  const role = args.role || 'admin';
  const status = args.status || 'active';

  if (!uid && !email) {
    console.error('Usage: node scripts/promote-admin.mjs --email user@example.com [--role admin] [--status active]');
    process.exit(1);
  }

  let userRecord;
  try {
    if (uid) {
      userRecord = await auth.getUser(uid);
    } else {
      userRecord = await auth.getUserByEmail(email);
    }
  } catch (error) {
    console.error('Unable to find user:', error.message || error);
    process.exit(1);
  }

  const claims = { role, status, employeeId: userRecord.uid };
  await auth.setCustomUserClaims(userRecord.uid, claims);

  const userDocRef = db.collection('users').doc(userRecord.uid);
  await userDocRef.set(
    {
      uid: userRecord.uid,
      email: userRecord.email || '',
      role,
      status,
      updatedAt: new Date().toISOString(),
      approvedBy: 'manual-script'
    },
    { merge: true }
  );

  console.log(`Promoted user ${userRecord.uid} (${userRecord.email}) to role=${role}, status=${status}`);
}

main().catch((error) => {
  console.error('Failed to promote user:', error);
  process.exit(1);
});
