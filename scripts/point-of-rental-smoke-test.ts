import { buildPorSmokeTest } from '../lib/integrations/point-of-rental/client';
import { buildPorSyncPlan } from '../lib/integrations/point-of-rental/sync-plans';

const smoke = buildPorSmokeTest();
const plan = buildPorSyncPlan();

console.log(JSON.stringify({ smoke, objects: plan.objects.length, scheduledJobs: plan.scheduledJobs.length, equipmentRules: plan.equipmentRules }, null, 2));

if (!smoke.configured) {
  console.log('POR configuration is not complete yet. This smoke test validates local connector readiness only.');
  process.exit(0);
}

console.log('POR bridge configuration values are present. Live folder/ODBC/API verification can be enabled during connector hardening.');
