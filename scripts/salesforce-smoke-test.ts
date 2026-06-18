import { getSalesforceCredentialStatus } from '../lib/integrations/salesforce/validators';
import { buildSalesforceSoql } from '../lib/integrations/salesforce/client';
import { buildSalesforceSyncPlan } from '../lib/integrations/salesforce/sync-plans';

const credentials = getSalesforceCredentialStatus();
const plan = buildSalesforceSyncPlan();
const query = buildSalesforceSoql({ objectName: 'Organization', fields: ['Id', 'Name'], limit: 1 });

console.log(JSON.stringify({ credentials, objects: plan.objects.length, query }, null, 2));

if (!credentials.configured) {
  console.log('Salesforce credentials are not configured yet. This smoke test validates local connector readiness only.');
  process.exit(0);
}

console.log('Salesforce credentials are present. Live token exchange can be enabled in the next connector hardening task.');
