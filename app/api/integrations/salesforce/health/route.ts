import { NextResponse } from 'next/server';
import { getSalesforceCredentialStatus } from '../../../../../lib/integrations/salesforce/validators';
import { buildSalesforceSyncPlan } from '../../../../../lib/integrations/salesforce/sync-plans';

export async function GET() {
  return NextResponse.json({
    connector: 'salesforce',
    credentials: getSalesforceCredentialStatus(),
    plan: buildSalesforceSyncPlan(),
  });
}
