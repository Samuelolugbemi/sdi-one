import { porObjectCatalog } from './object-catalog';
import { getPorCredentialStatus } from './validators';
import type { PorSyncPlan } from './types';

export function buildPorSyncPlan(): PorSyncPlan {
  const status = getPorCredentialStatus();
  return {
    connector: 'point-of-rental',
    version: '1.3',
    mode: status.mode,
    objects: porObjectCatalog,
    safeguards: [
      'POR is treated as the operational source for rental availability and item file attributes until direct API access is available.',
      'Equipment ownership is derived from the first segment of the equipment number, e.g. 24-1234 → company 24.',
      'Outbound Sage/SDI One cost updates are staged before being pushed to POR so accounting can validate repair cost MTD/LTD values.',
      'POR list-view limits are handled through file-based exports or ODBC/API access rather than relying on the first 100 UI records.',
      'All imports create integration runs, logs, timeline events and relationship edges for equipment workspaces.',
    ],
    scheduledJobs: [
      { key: 'por-equipment-master-nightly', name: 'Equipment master refresh', cadence: 'Nightly', direction: 'POR → SDI One' },
      { key: 'por-repair-cost-snapshot', name: 'Repair cost snapshot', cadence: 'Daily', direction: 'POR → SDI One' },
      { key: 'por-rental-history-weekly', name: 'Rental history refresh', cadence: 'Weekly', direction: 'POR → SDI One' },
      { key: 'sdi-to-por-cost-update', name: 'Validated cost update export', cadence: 'On demand', direction: 'SDI One → POR' },
    ],
    equipmentRules: [
      'Equipment owner company = first segment before dash.',
      'Equipment workspace prioritizes current job, revenue/profitability, repair cost and location.',
      'POR status is normalized into Active, Inactive, Rented, Repair, Available, Reserved or Retired.',
      'Repair cost MTD/LTD contributes to equipment profitability and maintenance burden analytics.',
      'Rental history links Equipment → Job → Customer → Revenue once POR contract exports are available.',
    ],
  };
}
