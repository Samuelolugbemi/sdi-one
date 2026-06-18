import { prisma } from '../lib/prisma';
import { salesforceObjectCatalog } from '../lib/integrations/salesforce/object-catalog';
import { salesforceFieldMaps } from '../lib/integrations/salesforce/field-maps';
import { buildSalesforceSyncPlan } from '../lib/integrations/salesforce/sync-plans';

async function upsertMapping(connectorId: number, sourceObject: string, targetEntity: string, fieldMap: any, transformRules: any, enabled: boolean) {
  const existing = await prisma.integrationMapping.findFirst({ where: { connectorId, sourceObject, targetEntity } });
  if (existing) {
    return prisma.integrationMapping.update({ where: { id: existing.id }, data: { fieldMap, transformRules, enabled } as any });
  }
  return prisma.integrationMapping.create({ data: { connectorId, sourceObject, targetEntity, fieldMap, transformRules, enabled } as any });
}

async function main() {
  const connector = await prisma.integrationConnector.upsert({
    where: { key: 'salesforce' },
    update: {
      name: 'Salesforce',
      system: 'Salesforce',
      category: 'CRM / Revenue Operations',
      status: 'Data Loader active / OAuth API credential-ready',
      authType: 'OAuth 2.0 + Data Loader bridge',
      enabled: true,
      baseUrl: process.env.SALESFORCE_INSTANCE_URL || process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
      description: 'CRM connector for accounts, contacts, opportunities, jobs, third-party invoices, invoice lines, cost codes, products, activities and files.',
      config: buildSalesforceSyncPlan() as any,
    },
    create: {
      key: 'salesforce',
      name: 'Salesforce',
      system: 'Salesforce',
      category: 'CRM / Revenue Operations',
      status: 'Data Loader active / OAuth API credential-ready',
      authType: 'OAuth 2.0 + Data Loader bridge',
      enabled: true,
      baseUrl: process.env.SALESFORCE_INSTANCE_URL || process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
      description: 'CRM connector for accounts, contacts, opportunities, jobs, third-party invoices, invoice lines, cost codes, products, activities and files.',
      config: buildSalesforceSyncPlan() as any,
    },
  });

  for (const object of salesforceObjectCatalog) {
    const fieldMap = (salesforceFieldMaps as any)[object.key] ?? {};
    await upsertMapping(
      connector.id,
      object.sourceObject,
      object.targetEntity,
      fieldMap,
      {
        externalId: object.externalId,
        syncDirection: object.syncDirection,
        requiredFields: object.requiredFields,
        readiness: object.readiness,
      },
      object.readiness !== 'future'
    );
  }

  await prisma.integrationRun.create({
    data: {
      connectorId: connector.id,
      runType: 'v1.2 connector readiness seed',
      status: 'Completed',
      recordsRead: salesforceObjectCatalog.length,
      recordsWritten: salesforceObjectCatalog.length,
      recordsFailed: 0,
      message: 'Salesforce v1.2 connector metadata, object catalog, field mappings, OAuth readiness and sync plan seeded.',
      metrics: buildSalesforceSyncPlan() as any,
    },
  });

  await prisma.integrationLog.createMany({
    data: [
      { connectorId: connector.id, level: 'Info', message: 'Salesforce Data Loader bridge remains supported while OAuth/API sync is introduced.' },
      { connectorId: connector.id, level: 'Info', message: 'Third Party Invoice and Invoice Line mappings are registered for Sage-to-Salesforce bridge continuity.' },
      { connectorId: connector.id, level: 'Warn', message: 'Production API sync requires approved Salesforce External Client App / Connected App credentials.' },
    ],
  }).catch(() => {});

  console.log('Seeded Salesforce v1.2 connector.');
}

main().finally(() => prisma.$disconnect());
