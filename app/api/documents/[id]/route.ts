import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const document = await prisma.documentRecord.findUnique({
    where: { id },
    include: { versions: true, shares: true, accessEvents: { orderBy: { createdAt: 'desc' } } },
  });

  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  return NextResponse.json({ document });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const document = await prisma.documentRecord.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date(), status: 'Deleted' },
  });

  await prisma.documentAccessEvent.create({ data: { documentId: id, eventType: 'Delete', actor: 'admin@sdi.local' } });
  return NextResponse.json({ document });
}
