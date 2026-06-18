import { sageIntacctObjectCatalog } from './object-catalog';
import { getSageCredentialStatus } from './validators';
import type { SageIntacctSyncPlan } from './types';

export function buildSageIntacctSyncPlan(): SageIntacctSyncPlan {
  const credentials = getSageCredentialStatus();
  return {
    connectorKey: 'sage-intacct',
    mode: credentials.authMode,
    objects: sageIntacctObjectCatalog.map((object) => ({
      key: object.key,
      label: object.label,
      targetEntity: object.targetEntity,
      status: object.readiness === 'active-csv' ? 'Active through CSV import' : credentials.configured ? 'API ready' : 'Awaiting credentials',
      cadence: object.recommendedCadence,
      source: object.sourceObject,
    })),
    safeguards: [
      'All imports are idempotent by source primary key.',
      'Field mappings are stored in the integration platform before production API sync is enabled.',
      'API sync runs will log read, write, failed and skipped record counts.',
      'CSV import remains the fallback until Sage API credentials are approved and tested.',
      'Job owner company is derived from the middle job segment; equipment owner company is derived from the first equipment segment.',
    ],
    nextActions: credentials.configured
      ? ['Run API smoke test', 'Enable scheduled sync in staging', 'Compare API results against current CSV imports']
      : ['Add Sage Intacct API credentials to .env', 'Run test-connection endpoint', 'Approve object sync schedule'],
  };
}
