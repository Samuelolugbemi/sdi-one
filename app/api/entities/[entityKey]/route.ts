import { NextResponse } from 'next/server';
import { getRegisteredEntity } from '@/lib/entity-engine';

export async function GET(_: Request, { params }: { params: { entityKey: string } }) {
  const entity = await getRegisteredEntity(params.entityKey);
  if (!entity) return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  return NextResponse.json(entity);
}
