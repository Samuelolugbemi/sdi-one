import { NextResponse } from 'next/server';
import { buildReadByQueryXml, buildSageXmlEnvelope } from '../../../../../lib/integrations/sage-intacct/client';
import { getSageCredentialStatus } from '../../../../../lib/integrations/sage-intacct/validators';

export async function GET() {
  const credentials = getSageCredentialStatus();
  const envelope = buildSageXmlEnvelope({
    controlId: `sdi-one-test-${Date.now()}`,
    functionXml: buildReadByQueryXml('CUSTOMER', ['CUSTOMERID', 'NAME'], '', 1),
  });
  return NextResponse.json({
    connector: 'sage-intacct',
    configured: credentials.configured,
    endpoint: envelope.endpoint,
    missing: credentials.missing,
    smokeTest: credentials.configured ? 'ready-to-send' : 'credentials-required',
    sampleRequestGenerated: true,
    note: 'This endpoint validates configuration and builds a safe XML API request. It does not send credentials in the response.',
  });
}
