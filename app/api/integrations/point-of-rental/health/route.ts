import { NextResponse } from 'next/server';
import { getPorCredentialStatus } from '../../../../../lib/integrations/point-of-rental/validators';
import { buildPorSmokeTest } from '../../../../../lib/integrations/point-of-rental/client';

export async function GET() {
  return NextResponse.json({ connector: 'point-of-rental', status: getPorCredentialStatus(), smokeTest: buildPorSmokeTest() });
}
