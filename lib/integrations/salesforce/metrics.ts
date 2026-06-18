import { prisma } from '../../prisma';

export async function getSalesforceConnectorMetrics() {
  const connector = await prisma.integrationConnector.findUnique({
    where: { key: 'salesforce' },
    include: {
      mappings: true,
      runs: { orderBy: { startedAt: 'desc' }, take: 10 },
      logs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  const [customers, jobs, invoices, invoiceLines] = await Promise.all([
    prisma.customer.count(),
    prisma.job.count(),
    prisma.invoice.count(),
    prisma.invoiceLine.count(),
  ]);

  return {
    connector,
    counts: { customers, jobs, invoices, invoiceLines },
    integrationSurface: customers + jobs + invoices + invoiceLines,
  };
}
