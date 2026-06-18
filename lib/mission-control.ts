import { prisma } from '@/lib/prisma';

export async function getMissionControlSnapshot() {
  const [customers, jobs, vendors, equipment, invoiceAgg, lineAgg, inventoryAgg, imports, openAlerts, pendingApprovals, workItems] = await Promise.all([
    prisma.customer.count(),
    prisma.job.count(),
    prisma.vendor.count(),
    prisma.equipment.count(),
    prisma.invoice.aggregate({ _count: true, _sum: { amount: true } }),
    prisma.invoiceLine.aggregate({ _count: true, _sum: { amount: true } }),
    prisma.inventoryTransaction.aggregate({ _count: true, _sum: { amount: true } }),
    prisma.importRun.findMany({ orderBy: { startedAt: 'desc' }, take: 6 }),
    prisma.operationalAlert.findMany({ where: { status: 'Open' }, orderBy: { createdAt: 'desc' }, take: 8 }).catch(() => []),
    prisma.approvalRequest.findMany({ where: { status: 'Pending' }, orderBy: { createdAt: 'desc' }, take: 8 }).catch(() => []),
    prisma.workItem.findMany({ where: { status: { in: ['Open', 'In Progress'] } }, orderBy: { createdAt: 'desc' }, take: 8 }).catch(() => []),
  ]);

  const apSpend = Number(invoiceAgg._sum.amount ?? 0);
  const invoiceLineSpend = Number(lineAgg._sum.amount ?? 0);
  const inventoryCost = Number(inventoryAgg._sum.amount ?? 0);
  const totalKnownCost = invoiceLineSpend + inventoryCost;

  return {
    counts: { customers, jobs, vendors, equipment, invoices: invoiceAgg._count, invoiceLines: lineAgg._count, inventoryRows: inventoryAgg._count },
    financials: { apSpend, invoiceLineSpend, inventoryCost, totalKnownCost },
    imports,
    openAlerts,
    pendingApprovals,
    workItems,
    briefing: buildExecutiveBriefing({ jobs, equipment, apSpend, invoiceLineSpend, inventoryCost, openAlerts: openAlerts.length, pendingApprovals: pendingApprovals.length }),
  };
}

function buildExecutiveBriefing(input: { jobs: number; equipment: number; apSpend: number; invoiceLineSpend: number; inventoryCost: number; openAlerts: number; pendingApprovals: number }) {
  const lines = [
    `SDI One is tracking ${input.jobs.toLocaleString()} jobs and ${input.equipment.toLocaleString()} assets from the imported Intacct operating dataset.`,
    `Known AP spend is ${currency(input.apSpend)}; job-level invoice lines account for ${currency(input.invoiceLineSpend)} and inventory usage accounts for ${currency(input.inventoryCost)}.`,
    input.openAlerts > 0 ? `${input.openAlerts} operational alerts require review.` : 'No critical operational alerts are currently open in the platform alert queue.',
    input.pendingApprovals > 0 ? `${input.pendingApprovals} approvals are waiting in the work queue.` : 'No pending platform approvals are currently waiting.',
  ];
  return lines;
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
