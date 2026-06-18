export type SageIntacctAuthMode = 'xml-api-session' | 'company-login' | 'csv-import';

export type SageIntacctObjectKey =
  | 'customers'
  | 'vendors'
  | 'jobs'
  | 'invoices'
  | 'invoiceLines'
  | 'equipment'
  | 'inventory'
  | 'glEntries'
  | 'dimensions'
  | 'attachments';

export type SageIntacctObjectDefinition = {
  key: SageIntacctObjectKey;
  label: string;
  sourceObject: string;
  targetEntity: string;
  syncDirection: 'intacct-to-sdi' | 'sdi-to-intacct' | 'bidirectional' | 'csv-only';
  primaryKey: string;
  description: string;
  requiredFields: string[];
  recommendedCadence: string;
  readiness: 'active-csv' | 'api-ready' | 'future';
};

export type SageIntacctCredentialStatus = {
  configured: boolean;
  missing: string[];
  authMode: SageIntacctAuthMode;
  endpoint: string;
};

export type SageIntacctSyncPlan = {
  connectorKey: 'sage-intacct';
  mode: SageIntacctAuthMode;
  objects: Array<{
    key: SageIntacctObjectKey;
    label: string;
    targetEntity: string;
    status: string;
    cadence: string;
    source: string;
  }>;
  safeguards: string[];
  nextActions: string[];
};
