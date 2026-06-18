import { prisma } from '@/lib/prisma';

export async function getExecutiveMetrics() {
  const [customers, jobs, vendors, equipment, invoices, lines, inventory, imports] = await Promise.all([
    prisma.customer.count(), prisma.job.count(), prisma.vendor.count(), prisma.equipment.count(),
    prisma.invoice.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.invoiceLine.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.inventoryTransaction.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.importRun.findMany({ orderBy: { startedAt: 'desc' }, take: 8 })
  ]);
  const invoiceTotal = Number(invoices._sum.amount ?? 0);
  const lineTotal = Number(lines._sum.amount ?? 0);
  const inventoryTotal = Number(inventory._sum.amount ?? 0);
  return { customers, jobs, vendors, equipment, invoiceCount: invoices._count, invoiceTotal, invoiceLineCount: lines._count, lineTotal, inventoryCount: inventory._count, inventoryTotal, imports };
}

export async function revenueByJob(limit = 10) {
  const grouped = await prisma.invoiceLine.groupBy({ by: ['jobId'], _sum: { amount: true }, _count: true, where: { jobId: { not: null } }, orderBy: { _sum: { amount: 'desc' } }, take: limit });
  const ids = grouped.map(g => g.jobId!).filter(Boolean);
  const jobs = await prisma.job.findMany({ where: { jobId: { in: ids } }, select: { jobId: true, description: true, status: true, customerId: true } });
  const jm = new Map(jobs.map(j => [j.jobId, j]));
  return grouped.map(g => ({ jobId: g.jobId!, amount: Number(g._sum.amount ?? 0), count: g._count, job: jm.get(g.jobId!) }));
}

export async function spendByVendor(limit = 10) {
  const grouped = await prisma.invoice.groupBy({ by: ['vendorId'], _sum: { amount: true }, _count: true, where: { vendorId: { not: null } }, orderBy: { _sum: { amount: 'desc' } }, take: limit });
  const ids = grouped.map(g => g.vendorId!).filter(Boolean);
  const vendors = await prisma.vendor.findMany({ where: { vendorId: { in: ids } }, select: { vendorId: true, name: true } });
  const vm = new Map(vendors.map(v => [v.vendorId, v]));
  return grouped.map(g => ({ vendorId: g.vendorId!, amount: Number(g._sum.amount ?? 0), count: g._count, vendor: vm.get(g.vendorId!) }));
}
