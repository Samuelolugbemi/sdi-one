import { NextResponse } from 'next/server';
import { getRegisteredEntities } from '@/lib/entity-engine';

export async function GET() {
  const entities = await getRegisteredEntities();
  return NextResponse.json(entities);
}
