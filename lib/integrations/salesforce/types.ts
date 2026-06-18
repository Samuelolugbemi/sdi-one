export type SalesforceAuthMode = 'oauth-client-credentials' | 'username-password' | 'manual-export' | 'not-configured';

export type SalesforceObjectKey =
  | 'accounts'
  | 'contacts'
  | 'opportunities'
  | 'jobs'
  | 'thirdPartyInvoices'
  | 'thirdPartyInvoiceLines'
  | 'costCodes'
  | 'products'
  | 'activities'
  | 'files';

export type SalesforceObjectDefinition = {
  key: SalesforceObjectKey;
  label: string;
  sourceObject: string;
  targetEntity: string;
  syncDirection: 'salesforce-to-sdi' | 'sdi-to-salesforce' | 'bidirectional' | 'export-only';
  externalId: string;
  description: string;
  requiredFields: string[];
  recommendedCadence: string;
  readiness: 'api-ready' | 'data-loader-active' | 'future';
};

export type SalesforceCredentialStatus = {
  configured: boolean;
  missing: string[];
  authMode: SalesforceAuthMode;
  loginUrl: string;
  instanceUrl: string;
  apiVersion: string;
};

export type SalesforceSyncPlan = {
  connectorKey: 'salesforce';
  mode: SalesforceAuthMode;
  objects: Array<{
    key: SalesforceObjectKey;
    label: string;
    targetEntity: string;
    status: string;
    cadence: string;
    source: string;
    externalId: string;
  }>;
  safeguards: string[];
  nextActions: string[];
};
