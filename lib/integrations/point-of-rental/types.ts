export type PorAuthMode = 'csv-drop-folder' | 'odbc-readonly' | 'api-future';

export type PorObjectDefinition = {
  key: string;
  sourceObject: string;
  label: string;
  description: string;
  targetEntity: string;
  externalId: string;
  syncDirection: 'por-to-sdi' | 'sdi-to-por' | 'bidirectional';
  requiredFields: string[];
  optionalFields: string[];
  readiness: 'ready' | 'bridge' | 'future';
};

export type PorSyncPlan = {
  connector: 'point-of-rental';
  version: '1.3';
  mode: PorAuthMode;
  objects: PorObjectDefinition[];
  safeguards: string[];
  scheduledJobs: { key: string; name: string; cadence: string; direction: string }[];
  equipmentRules: string[];
};
