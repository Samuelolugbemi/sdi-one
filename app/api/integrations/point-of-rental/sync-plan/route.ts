import { NextResponse } from 'next/server';
import { buildPorSyncPlan } from '../../../../../lib/integrations/point-of-rental/sync-plans';

export async function GET() {
  return NextResponse.json(buildPorSyncPlan());
}
