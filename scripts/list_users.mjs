import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

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

async function listUsers() {
  const listUsersResult = await getAuth().listUsers(1000);
  listUsersResult.users.forEach((userRecord) => {
    console.log('user:', userRecord.uid, userRecord.email, userRecord.displayName);
  });
}

listUsers().catch(console.error);
