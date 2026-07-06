# OfficeOS — repaired deployable scaffold

This repository now contains a valid Next.js App Router application and can be deployed to Vercel.

## What was fixed

- Added the required `app/layout.tsx` and `app/page.tsx` route entry points.
- Added `/login`, `/request-access`, `/admin/dashboard`, and `/employee/dashboard` pages.
- Added a health endpoint at `/api/health`.
- Removed generated build artifacts from the repository bundle.
- Kept Firebase Admin credentials out of source control and added `.env.example`.
- Added a working `bootstrap:admin` script.
- Kept the supplied lockfile and dependency ranges compatible with Vercel's Yarn install.

## Local setup

```bash
yarn install --frozen-lockfile
yarn build
yarn dev
```

Open `http://localhost:3000`.

## Vercel deployment

1. Push the contents of this folder to the root of your GitHub repository.
2. In Vercel, set the Framework Preset to **Next.js** and leave Root Directory empty unless this folder lives inside a monorepo.
3. Add the variables from `.env.example` in Vercel → Project Settings → Environment Variables.
4. Redeploy.

`OFFICEOS_AUTH_MODE=mock` allows the included preview pages to load without Firebase. Set it to `firebase` only after your real authentication/session implementation is connected.

## Firebase

Deploy Firestore and Storage rules with:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Bootstrap the first admin after setting the private Firebase Admin environment variables:

```bash
yarn bootstrap:admin -- --uid FIREBASE_AUTH_UID --email admin@company.com --name "Admin Name"
```

## Security action required

A Firebase service-account JSON private key was included in the supplied files. Do not commit that file. Revoke/delete that key in Google Cloud IAM immediately, generate a replacement, and store the replacement only in local/Vercel environment variables.
