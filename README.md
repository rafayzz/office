# OfficeOS

Premium internal office management app built with Next.js App Router, TypeScript, Tailwind CSS, Firebase Auth, Firestore, Firebase Storage, Firebase Admin SDK, Server Actions, and Vercel-ready deployment.

## What is included

- Firebase-backed login and request-access flow
- Approval-gated signup using Firestore pending records
- Server-side Firebase session cookies
- Admin approval/rejection with Firebase custom claims
- Admin dashboard, employee requests, employees, assets, inventory, tickets, announcements, reports, settings
- Employee dashboard, assigned assets, private tickets, announcements, profile
- First-login walkthrough for admin and employee users
- Clean first-run empty states with no seeded business records
- Assets and Inventory kept separate
- QR support only for Assets
- Protected asset and ticket file uploads through Firebase Storage
- Ticket status decisions, protected attachments, settings persistence, and first-admin bootstrap script

## Important security note

Firebase web config is public client configuration. It is included in `.env.example` and `.env.local` for your project.

Firebase Admin SDK credentials are private. You must generate them from Firebase Console and place them only in your local `.env.local` and Vercel environment variables. Never commit or share the private key.

## Local setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/login
```

## Firebase setup checklist

1. Open Firebase Console for project `office-os-eac7b`.
2. Enable Authentication > Sign-in method > Email/Password.
3. Enable Firestore Database.
4. Enable Firebase Storage.
5. Deploy rules:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

6. Generate Admin SDK service account credentials:
   - Firebase Console > Project settings > Service accounts
   - Generate new private key
   - Copy `client_email` into `FIREBASE_CLIENT_EMAIL`
   - Copy `private_key` into `FIREBASE_PRIVATE_KEY` with `\n` line breaks

## First admin setup

Create an admin user first in Firebase Authentication, then copy that user's UID.

Run:

```bash
npm run bootstrap:admin -- --uid FIREBASE_AUTH_UID --email admin@company.com --name "Admin Name"
```

This script:

- sets custom claims: `role=admin`, `status=active`
- creates/updates `users/{uid}` as an active admin

After that, log in at `/login` using that Firebase Auth email/password.

## Employee onboarding flow

1. Employee opens `/request-access`.
2. Employee creates account with email/password.
3. App creates:
   - `users/{uid}` with `status=pending`
   - `employeeRequests/{uid}` with `status=pending`
4. Admin reviews request in `/admin/employee-requests`.
5. Approval sets Firebase custom claims:
   - `role=employee`
   - `status=active`
6. Employee signs in again and gets redirected to `/employee/dashboard`.

## Environment variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBoRH7VnO0vbKYcuvY3l5sKI6fKDAbmsSg"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="office-os-eac7b.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="office-os-eac7b"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="office-os-eac7b.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="464480913688"
NEXT_PUBLIC_FIREBASE_APP_ID="1:464480913688:web:eb1c22f785d93543e1b66d"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-84LMRP37J2"

FIREBASE_PROJECT_ID="office-os-eac7b"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@office-os-eac7b.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

SESSION_COOKIE_NAME="officeos_session"
SESSION_EXPIRES_IN_DAYS="7"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OFFICEOS_AUTH_MODE="firebase"
```

## Data model

Main collections:

- `users`
- `employeeRequests`
- `assets`
- `inventoryItems`
- `tickets`
- `tickets/{ticketId}/messages`
- `announcements`
- `notifications`
- `auditLogs`

## Safety boundaries

- Pending users cannot access protected app areas.
- Admin routes verify active admin status server-side.
- Employee routes verify active employee status server-side.
- Employees only see their own assigned assets.
- Employees only see their own private tickets.
- Admin can manage all operational records.
- Offboarding deactivates users and preserves history.
- Inventory has no QR code fields.
- QR labels exist only on assets.
