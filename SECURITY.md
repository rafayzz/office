# Security notice

Never commit Firebase service-account JSON files or private keys.

The previously supplied key must be considered compromised. Delete it from Google Cloud Console → IAM & Admin → Service Accounts → the affected service account → Keys. Generate a replacement only if required, then store its values in Vercel environment variables.

If the key was ever pushed to GitHub, removing the file in a later commit is not enough. Purge it from Git history and rotate the key.
