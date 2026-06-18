import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('entityType') || undefined;
  const entityKey = searchParams.get('entityKey') || undefined;
  const category = searchParams.get('category') || undefined;

  const documents = await prisma.documentRecord.findMany({
    where: {
      isDeleted: false,
      ...(entityType ? { entityType } : {}),
      ...(entityKey ? { entityKey } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 250,
  });

  return NextResponse.json({ documents });
}
