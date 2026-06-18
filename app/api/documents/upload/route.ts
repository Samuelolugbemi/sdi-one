import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveDocumentFile } from '@/lib/document-storage';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file');
  const entityType = String(form.get('entityType') || 'platform');
  const entityKey = String(form.get('entityKey') || 'general');
  const entityLabel = String(form.get('entityLabel') || 'General');
  const category = String(form.get('category') || 'Other');
  const description = String(form.get('description') || '');
  const uploadedBy = String(form.get('uploadedBy') || 'admin@sdi.local');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was provided.' }, { status: 400 });
  }

  const stored = await saveDocumentFile(file, entityType, entityKey);

  const document = await prisma.documentRecord.create({
    data: {
      entityType,
      entityKey,
      entityLabel,
      fileName: stored.fileName,
      originalName: stored.originalName,
      fileType: stored.mimeType,
      mimeType: stored.mimeType,
      sizeBytes: stored.sizeBytes,
      storageProvider: 'local',
      storageKey: stored.storageKey,
      contentHash: stored.contentHash,
      category,
      description,
      uploadedBy,
      versions: {
        create: {
          version: 1,
          fileName: stored.fileName,
          storageKey: stored.storageKey,
          sizeBytes: stored.sizeBytes,
          mimeType: stored.mimeType,
          uploadedBy,
          notes: 'Initial upload',
        },
      },
      accessEvents: {
        create: {
          eventType: 'Upload',
          actor: uploadedBy,
        },
      },
    },
  });

  await prisma.timelineEvent.create({
    data: {
      entityType,
      entityKey,
      eventType: 'DocumentUploaded',
      title: `Document uploaded: ${stored.originalName}`,
      description: description || category,
      source: 'Document Engine',
      raw: { documentId: document.id, category },
    },
  });

  return NextResponse.json({ document }, { status: 201 });
}
