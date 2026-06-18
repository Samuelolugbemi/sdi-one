import { NextResponse } from 'next/server';
import { getSageCredentialStatus } from '../../../../../lib/integrations/sage-intacct/validators';
import { getSageConnectorMetrics } from '../../../../../lib/integrations/sage-intacct/metrics';

export async function GET() {
  const credentials = getSageCredentialStatus();
  const metrics = await getSageConnectorMetrics();
  return NextResponse.json({
    connector: 'sage-intacct',
    status: credentials.configured ? 'api-ready' : 'csv-active-awaiting-api-credentials',
    credentials,
    counts: metrics.counts,
    totalImported: metrics.totalImported,
    lastRun: metrics.connector?.runs?.[0] ?? null,
  });
}
