import { salesforceObjectCatalog } from './object-catalog';
import { getSalesforceCredentialStatus } from './validators';
import type { SalesforceSyncPlan } from './types';

export function buildSalesforceSyncPlan(): SalesforceSyncPlan {
  const credentials = getSalesforceCredentialStatus();
  return {
    connectorKey: 'salesforce',
    mode: credentials.authMode,
    objects: salesforceObjectCatalog.map((object) => ({
      key: object.key,
      label: object.label,
      targetEntity: object.targetEntity,
      status:
        object.readiness === 'data-loader-active'
          ? 'Data Loader bridge active / API-ready'
          : object.readiness === 'api-ready' && credentials.configured
          ? 'API ready'
          : object.readiness === 'future'
          ? 'Future sync'
          : 'Awaiting credentials',
      cadence: object.recommendedCadence,
      source: object.sourceObject,
      externalId: object.externalId,
    })),
    safeguards: [
      'All Salesforce upserts use explicit external IDs to prevent duplicate records.',
      'Current Data Loader flows remain valid while OAuth/API sync is introduced gradually.',
      'Third Party Invoice Lines continue to map by Sage_ID__c, Parent_Invoice_Sage_ID__c and Unique_Job.',
      'Failed product/cost-code lookups are logged as data-quality issues instead of silently skipped.',
      'Salesforce API sync must run after Sage imports so SDI One remains the canonical integration layer.',
      'OAuth credentials must be stored in environment variables or future secret storage, never in code.',
    ],
    nextActions: credentials.configured
      ? ['Run Salesforce smoke test', 'Validate object describe permissions', 'Compare Data Loader output with API query results', 'Enable staged sync for invoice lines']
      : ['Create Salesforce External Client App', 'Add OAuth client ID/secret or approved username-password credentials', 'Run connection test', 'Approve object-level sync schedule'],
  };
}
