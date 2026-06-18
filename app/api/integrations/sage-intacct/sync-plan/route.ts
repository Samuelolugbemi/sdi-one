import { NextResponse } from 'next/server';
import { buildSageIntacctSyncPlan } from '../../../../../lib/integrations/sage-intacct/sync-plans';

export async function GET() {
  return NextResponse.json(buildSageIntacctSyncPlan());
}
