import { prisma } from '../lib/prisma';
import { porObjectCatalog } from '../lib/integrations/point-of-rental/object-catalog';
import { porFieldMaps } from '../lib/integrations/point-of-rental/field-maps';
import { buildPorSyncPlan } from '../lib/integrations/point-of-rental/sync-plans';

async function upsertMapping(connectorId: number, sourceObject: string, targetEntity: string, fieldMap: any, transformRules: any, enabled: boolean) {
  const existing = await prisma.integrationMapping.findFirst({ where: { connectorId, sourceObject, targetEntity } });
  if (existing) {
    return prisma.integrationMapping.update({ where: { id: existing.id }, data: { fieldMap, transformRules, enabled } as any });
  }
  return prisma.integrationMapping.create({ data: { connectorId, sourceObject, targetEntity, fieldMap, transformRules, enabled } as any });
}

async function main() {
  const plan = buildPorSyncPlan();
  const connector = await prisma.integrationConnector.upsert({
    where: { key: 'point-of-rental' },
    update: {
      name: 'Point of Rental',
      system: 'Point of Rental',
      category: 'Equipment / Rental Operations',
      status: 'Bridge ready / credential-ready',
      authType: 'CSV folder bridge + ODBC/API future',
      enabled: true,
      baseUrl: process.env.POR_API_BASE_URL || process.env.POR_EXPORT_FOLDER || 'C:\\POR',
      description: 'Equipment operations connector for POR item file, repair cost snapshots, rental history, availability and staged Sage/SDI equipment cost updates.',
      config: plan as any,
    },
    create: {
      key: 'point-of-rental',
      name: 'Point of Rental',
      system: 'Point of Rental',
      category: 'Equipment / Rental Operations',
      status: 'Bridge ready / credential-ready',
      authType: 'CSV folder bridge + ODBC/API future',
      enabled: true,
      baseUrl: process.env.POR_API_BASE_URL || process.env.POR_EXPORT_FOLDER || 'C:\\POR',
      description: 'Equipment operations connector for POR item file, repair cost snapshots, rental history, availability and staged Sage/SDI equipment cost updates.',
      config: plan as any,
    },
  });

  for (const object of porObjectCatalog) {
    const fieldMap = (porFieldMaps as any)[object.key] ?? {};
    await upsertMapping(connector.id, object.sourceObject, object.targetEntity, fieldMap, {
      externalId: object.externalId,
      syncDirection: object.syncDirection,
      requiredFields: object.requiredFields,
      optionalFields: object.optionalFields,
      readiness: object.readiness,
    }, object.readiness !== 'future');
  }

  await prisma.integrationRun.create({
    data: {
      connectorId: connector.id,
      runType: 'v1.3 connector readiness seed',
      status: 'Completed',
      recordsRead: porObjectCatalog.length,
      recordsWritten: porObjectCatalog.length,
      recordsFailed: 0,
      message: 'Point of Rental v1.3 connector metadata, object catalog, field mappings, sync plan and equipment cost bridge seeded.',
      metrics: plan as any,
    },
  });

  await prisma.integrationLog.createMany({
    data: [
      { connectorId: connector.id, level: 'Info', message: 'POR connector registered with item file, repair cost, rental history, availability and outbound cost update definitions.' },
      { connectorId: connector.id, level: 'Info', message: 'Equipment owner company rule registered: first equipment ID segment before dash.' },
      { connectorId: connector.id, level: 'Warn', message: 'Production POR sync requires approved export folders, ODBC access or API credentials depending on deployment mode.' },
    ],
  }).catch(() => {});

  console.log('Seeded Point of Rental v1.3 connector.');
}

main().finally(() => prisma.$disconnect());
