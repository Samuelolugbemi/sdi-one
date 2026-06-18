import { NextResponse } from 'next/server';
import { getSalesforceCredentialStatus } from '../../../../../lib/integrations/salesforce/validators';
import { buildSalesforceSoql } from '../../../../../lib/integrations/salesforce/client';

export async function GET() {
  const credentials = getSalesforceCredentialStatus();
  const smokeQuery = buildSalesforceSoql({ objectName: 'Organization', fields: ['Id', 'Name'], limit: 1 });

  return NextResponse.json({
    connector: 'salesforce',
    configured: credentials.configured,
    authMode: credentials.authMode,
    apiVersion: credentials.apiVersion,
    instanceUrl: credentials.instanceUrl,
    smokeQuery,
    message: credentials.configured
      ? 'Salesforce credentials are present. This endpoint is ready for a live OAuth/token smoke test implementation.'
      : 'Salesforce credentials are not configured. Add OAuth or approved integration user values to .env.',
  });
}
