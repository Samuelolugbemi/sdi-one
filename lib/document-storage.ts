import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const uploadRoot = path.join(process.cwd(), 'storage', 'documents');

export async function saveDocumentFile(file: File, entityType: string, entityKey: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const folder = path.join(uploadRoot, entityType, entityKey);
  await fs.mkdir(folder, { recursive: true });
  const storageKey = path.join(entityType, entityKey, `${Date.now()}-${safeName}`).replace(/\\/g, '/');
  const fullPath = path.join(uploadRoot, storageKey);
  await fs.writeFile(fullPath, buffer);
  return {
    storageKey,
    fileName: safeName,
    originalName: file.name,
    mimeType: file.type || 'application/octet-stream',
    sizeBytes: buffer.byteLength,
    contentHash: hash,
  };
}

export function getDocumentPath(storageKey: string) {
  return path.join(uploadRoot, storageKey);
}
