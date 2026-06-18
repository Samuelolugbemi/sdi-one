import { NextResponse } from 'next/server';
import { buildPorSmokeTest } from '../../../../../lib/integrations/point-of-rental/client';

export async function GET() {
  return NextResponse.json(buildPorSmokeTest());
}
