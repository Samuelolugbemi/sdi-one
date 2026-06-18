import { prisma } from '@/lib/prisma';

export type TimelineItem = { id: string; title: string; description?: string; type: string; occurredAt: Date; source: string; href?: string };

export async function getTimeline(entityType?: string, entityKey?: string, limit = 75): Promise<TimelineItem[]> {
  if (entityType && entityKey) return getEntityTimeline(entityType, entityKey, limit);
  const [imports, invoices, inventory] = await Promise.all([
    prisma.importRun.findMany({ orderBy: { startedAt: 'desc' }, take: 20 }),
    prisma.invoice.findMany({ where: { invoiceDate: { not: null } }, orderBy: { invoiceDate: 'desc' }, take: 30 }),
    prisma.inventoryTransaction.findMany({ where: { transactionDate: { not: null } }, orderBy: { transactionDate: 'desc' }, take: 30 }),
  ]);
  return [
    ...imports.map(i => ({ id: `import-${i.id}`, title: `Import ${i.status}: ${i.source}`, description: `${i.rowsImported} rows imported from ${i.fileName ?? 'file'}`, type: 'import', occurredAt: i.startedAt, source: 'Import Engine', href: '/dashboard/integrations' })),
    ...invoices.map(i => ({ id: `invoice-${i.sageId}`, title: `Invoice posted ${i.sageId}`, description: `${i.description ?? 'AP bill'} for ${i.vendorId ?? 'vendor'}`, type: 'invoice', occurredAt: i.invoiceDate!, source: 'Intacct', href: `/dashboard/invoices/${i.sageId}` })),
    ...inventory.map(i => ({ id: `inventory-${i.rowId}`, title: `Inventory used on ${i.jobId ?? i.uniqueJobNumber ?? 'job'}`, description: i.description ?? 'Inventory transaction', type: 'inventory', occurredAt: i.transactionDate!, source: 'Inventory', href: '/dashboard/inventory' })),
  ].sort((a,b)=>b.occurredAt.getTime()-a.occurredAt.getTime()).slice(0, limit);
}

async function getEntityTimeline(entityType: string, entityKey: string, limit: number): Promise<TimelineItem[]> {
  if (entityType === 'job') {
    const job = await prisma.job.findUnique({ where: { jobId: entityKey } });
    const [lines, inv] = await Promise.all([
      prisma.invoiceLine.findMany({ where: job?.uniqueJob ? { OR: [{ jobId: entityKey }, { uniqueJob: job.uniqueJob }] } : { jobId: entityKey }, orderBy: { transactionDate: 'desc' }, take: limit }),
      prisma.inventoryTransaction.findMany({ where: job?.uniqueJob ? { OR: [{ jobId: entityKey }, { uniqueJobNumber: job.uniqueJob }] } : { jobId: entityKey }, orderBy: { transactionDate: 'desc' }, take: limit })
    ]);
    return [
      ...(job ? [{ id: `job-${job.jobId}`, title: `Job ${job.jobId} imported`, description: job.description ?? job.well ?? 'Job record', type: 'job', occurredAt: job.importedAt, source: 'Intacct', href: `/dashboard/jobs/${job.jobId}` }] : []),
      ...lines.filter(l=>l.transactionDate).map(l => ({ id: `line-${l.sageId}`, title: `Invoice line ${l.sageId}`, description: l.description ?? 'Invoice line', type: 'invoice_line', occurredAt: l.transactionDate!, source: 'AP', href: l.invoiceSageId ? `/dashboard/invoices/${l.invoiceSageId}` : undefined })),
      ...inv.filter(i=>i.transactionDate).map(i => ({ id: `inv-${i.rowId}`, title: `Inventory transaction ${i.rowId}`, description: i.description ?? 'Inventory used', type: 'inventory', occurredAt: i.transactionDate!, source: 'Inventory', href: '/dashboard/inventory' }))
    ].sort((a,b)=>b.occurredAt.getTime()-a.occurredAt.getTime()).slice(0,limit);
  }
  if (entityType === 'customer') {
    const customer = await prisma.customer.findUnique({ where: { customerId: entityKey }, include: { jobs: true } });
    return [
      ...(customer ? [{ id: `customer-${customer.customerId}`, title: `Customer ${customer.customerId} imported`, description: customer.name ?? 'Customer record', type: 'customer', occurredAt: customer.importedAt, source: 'Intacct', href: `/dashboard/customers/${customer.customerId}` }] : []),
      ...(customer?.jobs ?? []).map(j => ({ id: `job-${j.jobId}`, title: `Related job ${j.jobId}`, description: j.description ?? j.well ?? 'Job', type: 'job', occurredAt: j.importedAt, source: 'Jobs', href: `/dashboard/jobs/${j.jobId}` }))
    ].sort((a,b)=>b.occurredAt.getTime()-a.occurredAt.getTime()).slice(0,limit);
  }
  return getTimeline(undefined, undefined, limit);
}
