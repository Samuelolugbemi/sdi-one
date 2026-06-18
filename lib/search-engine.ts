import { prisma } from '@/lib/prisma';

export async function universalSearch(q: string) {
  const query = q.trim();
  if (!query) return [];
  const contains = { contains: query, mode: 'insensitive' as const };
  const [customers, jobs, vendors, invoices, equipment, inventory] = await Promise.all([
    prisma.customer.findMany({ where: { OR: [{ customerId: contains }, { name: contains }, { city: contains }] }, take: 10 }),
    prisma.job.findMany({ where: { OR: [{ jobId: contains }, { uniqueJob: contains }, { description: contains }, { well: contains }] }, take: 10 }),
    prisma.vendor.findMany({ where: { OR: [{ vendorId: contains }, { name: contains }, { city: contains }] }, take: 10 }),
    prisma.invoice.findMany({ where: { OR: [{ sageId: contains }, { invoice: contains }, { vendorInvoiceNumber: contains }, { description: contains }] }, take: 10 }),
    prisma.equipment.findMany({ where: { OR: [{ equipmentId: contains }, { description: contains }, { status: contains }] }, take: 10 }),
    prisma.inventoryTransaction.findMany({ where: { OR: [{ rowId: contains }, { jobId: contains }, { uniqueJobNumber: contains }, { description: contains }, { costCode: contains }] }, take: 10 }),
  ]);
  return [
    ...customers.map(r => ({ type: 'Customer', key: r.customerId, title: r.name ?? r.customerId, subtitle: `${r.city ?? ''} ${r.state ?? ''}`, href: `/dashboard/customers/${r.customerId}` })),
    ...jobs.map(r => ({ type: 'Job', key: r.jobId, title: r.description ?? r.jobId, subtitle: `${r.status ?? ''} ${r.customerId ?? ''}`, href: `/dashboard/jobs/${r.jobId}` })),
    ...vendors.map(r => ({ type: 'Vendor', key: r.vendorId, title: r.name ?? r.vendorId, subtitle: `${r.city ?? ''} ${r.state ?? ''}`, href: `/dashboard/vendors/${r.vendorId}` })),
    ...invoices.map(r => ({ type: 'Invoice', key: r.sageId, title: r.description ?? r.sageId, subtitle: `${r.vendorId ?? ''}`, href: `/dashboard/invoices/${r.sageId}` })),
    ...equipment.map(r => ({ type: 'Equipment', key: r.equipmentId, title: r.description ?? r.equipmentId, subtitle: r.status ?? '', href: `/dashboard/equipment/${r.equipmentId}` })),
    ...inventory.map(r => ({ type: 'Inventory', key: r.rowId, title: r.description ?? r.rowId, subtitle: `${r.jobId ?? r.uniqueJobNumber ?? ''}`, href: '/dashboard/inventory' })),
  ];
}
