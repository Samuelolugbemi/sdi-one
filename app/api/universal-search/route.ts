import { NextRequest, NextResponse } from 'next/server';
import { universalSearch } from '@/lib/universal-search';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  return NextResponse.json(await universalSearch(q));
}
