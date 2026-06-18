import { prisma } from '../../prisma';

export async function getSageConnectorMetrics() {
  const connector = await prisma.integrationConnector.findUnique({
    where: { key: 'sage-intacct' },
    include: {
      mappings: true,
      runs: { orderBy: { startedAt: 'desc' }, take: 10 },
      logs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  const [customers, vendors, jobs, invoices, invoiceLines, equipment, inventory] = await Promise.all([
    prisma.customer.count(),
    prisma.vendor.count(),
    prisma.job.count(),
    prisma.invoice.count(),
    prisma.invoiceLine.count(),
    prisma.equipment.count(),
    prisma.inventoryTransaction.count(),
  ]);

  return {
    connector,
    counts: { customers, vendors, jobs, invoices, invoiceLines, equipment, inventory },
    totalImported: customers + vendors + jobs + invoices + invoiceLines + equipment + inventory,
  };
}
