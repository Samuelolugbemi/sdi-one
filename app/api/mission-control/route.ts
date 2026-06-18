import { NextResponse } from 'next/server';
import { getMissionControlSnapshot } from '@/lib/mission-control';

export async function GET() {
  return NextResponse.json(await getMissionControlSnapshot());
}
