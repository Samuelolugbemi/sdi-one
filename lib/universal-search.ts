import { prisma } from '@/lib/prisma';

export async function universalSearch(query: string) {
  const q = query.trim();
  if (!q) return [];
  const contains = { contains: q, mode: 'insensitive' as const };
  const [customers, jobs, vendors, invoices, equipment, inventory] = await Promise.all([
    prisma.customer.findMany({ where: { OR: [{ customerId: contains }, { name: contains }, { city: contains }, { state: contains }] }, take: 8 }),
    prisma.job.findMany({ where: { OR: [{ jobId: contains }, { uniqueJob: contains }, { description: contains }, { well: contains }] }, take: 8 }),
    prisma.vendor.findMany({ where: { OR: [{ vendorId: contains }, { name: contains }] }, take: 8 }),
    prisma.invoice.findMany({ where: { OR: [{ sageId: contains }, { invoice: contains }, { vendorInvoiceNumber: contains }, { description: contains }] }, take: 8 }),
    prisma.equipment.findMany({ where: { OR: [{ equipmentId: contains }, { description: contains }, { status: contains }] }, take: 8 }),
    prisma.inventoryTransaction.findMany({ where: { OR: [{ rowId: contains }, { jobId: contains }, { uniqueJobNumber: contains }, { description: contains }, { costCode: contains }] }, take: 8 }),
  ]);
  return [
    ...customers.map(x => ({ type: 'Customer', key: x.customerId, title: x.name ?? x.customerId, subtitle: [x.city, x.state].filter(Boolean).join(', '), href: `/dashboard/customers/${x.customerId}` })),
    ...jobs.map(x => ({ type: 'Job', key: x.jobId, title: x.jobId, subtitle: x.description ?? x.well ?? x.status, href: `/dashboard/jobs/${x.jobId}` })),
    ...vendors.map(x => ({ type: 'Vendor', key: x.vendorId, title: x.name ?? x.vendorId, subtitle: x.type ?? 'Vendor', href: `/dashboard/vendors/${x.vendorId}` })),
    ...invoices.map(x => ({ type: 'Invoice', key: x.sageId, title: x.invoice ?? x.sageId, subtitle: x.description ?? x.vendorInvoiceNumber, href: `/dashboard/invoices/${x.sageId}` })),
    ...equipment.map(x => ({ type: 'Equipment', key: x.equipmentId, title: x.equipmentId, subtitle: x.description ?? x.status, href: `/dashboard/equipment/${x.equipmentId}` })),
    ...inventory.map(x => ({ type: 'Inventory', key: x.rowId, title: x.description ?? x.rowId, subtitle: [x.jobId, x.costCode].filter(Boolean).join(' • '), href: `/dashboard/inventory?search=${encodeURIComponent(x.rowId)}` })),
  ];
}
