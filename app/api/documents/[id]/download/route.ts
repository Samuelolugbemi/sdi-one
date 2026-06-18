import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDocumentPath } from '@/lib/document-storage';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const document = await prisma.documentRecord.findUnique({ where: { id } });
  if (!document?.storageKey) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  const file = await fs.readFile(getDocumentPath(document.storageKey));

  await prisma.documentAccessEvent.create({ data: { documentId: id, eventType: 'Download', actor: 'admin@sdi.local' } });

  return new NextResponse(file, {
    headers: {
      'Content-Type': document.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${document.originalName || document.fileName}"`,
    },
  });
}
