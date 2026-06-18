import { NextResponse } from 'next/server';
import { buildSalesforceSyncPlan } from '../../../../../lib/integrations/salesforce/sync-plans';

export async function GET() {
  return NextResponse.json(buildSalesforceSyncPlan());
}
