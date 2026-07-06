import 'server-only';
import { adminStorage } from '@/lib/firebase/admin';

function safeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'upload.bin';
}

export type UploadedFile = {
  path: string;
  name: string;
  size: number;
  contentType: string;
};

export async function uploadFormFile(file: FormDataEntryValue | null, folder: string): Promise<UploadedFile | undefined> {
  if (!(file instanceof File) || file.size === 0) return undefined;

  const fileName = `${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const path = `${folder.replace(/\/$/, '')}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || 'application/octet-stream';

  await adminStorage.bucket().file(path).save(buffer, {
    contentType,
    resumable: false,
    metadata: {
      cacheControl: 'private, max-age=0, no-transform',
      metadata: {
        originalName: file.name,
        uploadedBy: 'officeos'
      }
    }
  });

  return { path, name: file.name, size: file.size, contentType };
}

export function protectedFileHref(path?: string) {
  return path ? `/api/protected-file?path=${encodeURIComponent(path)}` : '';
}
