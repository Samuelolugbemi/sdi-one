import { prisma } from '../lib/prisma';
import { sageIntacctObjectCatalog } from '../lib/integrations/sage-intacct/object-catalog';
import { sageIntacctFieldMaps } from '../lib/integrations/sage-intacct/field-maps';
import { buildSageIntacctSyncPlan } from '../lib/integrations/sage-intacct/sync-plans';

async function main() {
  const connector = await prisma.integrationConnector.upsert({
    where: { key: 'sage-intacct' },
    update: {
      name: 'Sage Intacct',
      system: 'Sage Intacct',
      category: 'Finance / ERP',
      status: 'CSV active / API credential-ready',
      authType: 'CSV + XML API',
      enabled: true,
      baseUrl: process.env.INTACCT_API_ENDPOINT || 'https://api.intacct.com/ia/xml/xmlgw.phtml',
      description: 'Primary ERP connector for customers, vendors, jobs, AP bills, invoice lines, inventory, equipment, GL and dimensions.',
      config: buildSageIntacctSyncPlan() as any,
    },
    create: {
      key: 'sage-intacct',
      name: 'Sage Intacct',
      system: 'Sage Intacct',
      category: 'Finance / ERP',
      status: 'CSV active / API credential-ready',
      authType: 'CSV + XML API',
      enabled: true,
      baseUrl: process.env.INTACCT_API_ENDPOINT || 'https://api.intacct.com/ia/xml/xmlgw.phtml',
      description: 'Primary ERP connector for customers, vendors, jobs, AP bills, invoice lines, inventory, equipment, GL and dimensions.',
      config: buildSageIntacctSyncPlan() as any,
    },
  });

  for (const object of sageIntacctObjectCatalog) {
    const fieldMap = (sageIntacctFieldMaps as any)[object.key] ?? {};
    await prisma.integrationMapping.upsert({
      where: {
        connectorId_sourceObject_targetEntity: {
          connectorId: connector.id,
          sourceObject: object.sourceObject,
          targetEntity: object.targetEntity,
        },
      } as any,
      update: {
        fieldMap,
        transformRules: {
          primaryKey: object.primaryKey,
          syncDirection: object.syncDirection,
          requiredFields: object.requiredFields,
          readiness: object.readiness,
        },
        enabled: object.readiness !== 'future',
      } as any,
      create: {
        connectorId: connector.id,
        sourceObject: object.sourceObject,
        targetEntity: object.targetEntity,
        fieldMap,
        transformRules: {
          primaryKey: object.primaryKey,
          syncDirection: object.syncDirection,
          requiredFields: object.requiredFields,
          readiness: object.readiness,
        },
        enabled: object.readiness !== 'future',
      } as any,
    }).catch(async () => {
      const existing = await prisma.integrationMapping.findFirst({ where: { connectorId: connector.id, sourceObject: object.sourceObject, targetEntity: object.targetEntity }});
      if (existing) {
        await prisma.integrationMapping.update({ where: { id: existing.id }, data: { fieldMap, transformRules: { primaryKey: object.primaryKey, syncDirection: object.syncDirection, requiredFields: object.requiredFields, readiness: object.readiness } as any, enabled: object.readiness !== 'future' }});
      } else {
        await prisma.integrationMapping.create({ data: { connectorId: connector.id, sourceObject: object.sourceObject, targetEntity: object.targetEntity, fieldMap, transformRules: { primaryKey: object.primaryKey, syncDirection: object.syncDirection, requiredFields: object.requiredFields, readiness: object.readiness } as any, enabled: object.readiness !== 'future' }});
      }
    });
  }

  await prisma.integrationRun.create({
    data: {
      connectorId: connector.id,
      runType: 'v1.1 connector readiness seed',
      status: 'Completed',
      recordsRead: sageIntacctObjectCatalog.length,
      recordsWritten: sageIntacctObjectCatalog.length,
      recordsFailed: 0,
      message: 'Sage Intacct v1.1 connector metadata, object catalog, field mappings and sync plan seeded.',
      metrics: buildSageIntacctSyncPlan() as any,
    },
  });

  await prisma.integrationLog.createMany({
    data: [
      { connectorId: connector.id, level: 'Info', message: 'Sage Intacct CSV import remains active as the verified production ingestion fallback.' },
      { connectorId: connector.id, level: 'Info', message: 'Sage Intacct XML API envelope builder and sync planner are ready for credential testing.' },
      { connectorId: connector.id, level: 'Warn', message: 'Production API sync requires approved Sage Intacct Web Services credentials.' },
    ],
  }).catch(() => {});

  console.log('Seeded Sage Intacct v1.1 connector.');
}

main().finally(() => prisma.$disconnect());
