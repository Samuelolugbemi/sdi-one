import { prisma } from '@/lib/prisma';

export async function getRegisteredEntities() {
  return prisma.entityType.findMany({
    where: { isActive: true },
    include: {
      fields: { orderBy: { sortOrder: 'asc' } },
      capabilities: { orderBy: { sortOrder: 'asc' } },
      workspaceSections: { orderBy: { sortOrder: 'asc' } },
      permissionTemplates: true,
      relationshipRulesSource: {
        include: { targetEntityType: true },
        orderBy: { label: 'asc' },
      },
      relationshipRulesTarget: {
        include: { sourceEntityType: true },
        orderBy: { label: 'asc' },
      },
    },
    orderBy: [{ domain: 'asc' }, { sortOrder: 'asc' }, { displayName: 'asc' }],
  });
}

export async function getRegisteredEntity(key: string) {
  return prisma.entityType.findUnique({
    where: { key },
    include: {
      fields: { orderBy: { sortOrder: 'asc' } },
      capabilities: { orderBy: { sortOrder: 'asc' } },
      workspaceSections: { orderBy: { sortOrder: 'asc' } },
      permissionTemplates: true,
      relationshipRulesSource: {
        include: { targetEntityType: true },
        orderBy: { label: 'asc' },
      },
      relationshipRulesTarget: {
        include: { sourceEntityType: true },
        orderBy: { label: 'asc' },
      },
    },
  });
}

export async function getEntityStats() {
  const [customers, jobs, vendors, invoices, invoiceLines, equipment, inventory, entityTypes] = await Promise.all([
    prisma.customer.count(),
    prisma.job.count(),
    prisma.vendor.count(),
    prisma.invoice.count(),
    prisma.invoiceLine.count(),
    prisma.equipment.count(),
    prisma.inventoryTransaction.count(),
    prisma.entityType.count(),
  ]);

  return {
    customers,
    jobs,
    vendors,
    invoices,
    invoiceLines,
    equipment,
    inventory,
    entityTypes,
  };
}

export function getEntityRecordCount(stats: Awaited<ReturnType<typeof getEntityStats>>, key: string) {
  const map: Record<string, number> = {
    customer: stats.customers,
    job: stats.jobs,
    vendor: stats.vendors,
    invoice: stats.invoices,
    invoice_line: stats.invoiceLines,
    equipment: stats.equipment,
    inventory_transaction: stats.inventory,
  };
  return map[key] ?? 0;
}
