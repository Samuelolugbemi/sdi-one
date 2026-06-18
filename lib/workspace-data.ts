import { prisma } from '@/lib/prisma';

export type WorkspaceEntityType = 'customer' | 'job' | 'vendor' | 'invoice' | 'equipment' | 'inventory';

export async function getWorkspaceData(entityType: string, entityKey: string) {
  switch (entityType) {
    case 'customer':
      return getCustomerWorkspace(entityKey);
    case 'job':
      return getJobWorkspace(entityKey);
    case 'vendor':
      return getVendorWorkspace(entityKey);
    case 'invoice':
      return getInvoiceWorkspace(entityKey);
    case 'equipment':
      return getEquipmentWorkspace(entityKey);
    default:
      return null;
  }
}

async function getCustomerWorkspace(customerId: string) {
  const customer = await prisma.customer.findUnique({ where: { customerId }, include: { jobs: true } });
  if (!customer) return null;
  const jobIds = customer.jobs.map(j => j.jobId);
  const uniqueJobs = customer.jobs.map(j => j.uniqueJob).filter(Boolean) as string[];
  const [invoiceLines, inventory, timeline, relationships, docs] = await Promise.all([
    prisma.invoiceLine.findMany({ where: { OR: [{ jobId: { in: jobIds } }, { uniqueJob: { in: uniqueJobs } }] }, take: 100, orderBy: { transactionDate: 'desc' } }),
    prisma.inventoryTransaction.findMany({ where: { OR: [{ jobId: { in: jobIds } }, { uniqueJobNumber: { in: uniqueJobs } }] }, take: 100, orderBy: { transactionDate: 'desc' } }),
    prisma.timelineEvent.findMany({ where: { entityType: 'customer', entityKey: customerId }, orderBy: { occurredAt: 'desc' }, take: 50 }).catch(() => []),
    prisma.entityRelationship.findMany({ where: { OR: [{ sourceEntityType: 'customer', sourceEntityKey: customerId }, { targetEntityType: 'customer', targetEntityKey: customerId }] }, take: 50 }).catch(() => []),
    prisma.documentRecord.findMany({ where: { entityType: 'customer', entityKey: customerId }, take: 50 }).catch(() => []),
  ]);
  return { type: 'customer', title: customer.name ?? customer.customerId, subtitle: customer.customerId, record: customer, tabs: ['Overview', 'Jobs', 'Invoices', 'Inventory', 'Timeline', 'Documents', 'AI'], jobs: customer.jobs, invoiceLines, inventory, timeline, relationships, docs };
}

async function getJobWorkspace(jobId: string) {
  const job = await prisma.job.findUnique({ where: { jobId }, include: { customer: true } });
  if (!job) return null;
  const whereLines: any = job.uniqueJob ? { OR: [{ jobId }, { uniqueJob: job.uniqueJob }] } : { jobId };
  const whereInv: any = job.uniqueJob ? { OR: [{ jobId }, { uniqueJobNumber: job.uniqueJob }] } : { jobId };
  const [invoiceLines, inventory, lineAgg, invAgg, timeline, relationships, docs] = await Promise.all([
    prisma.invoiceLine.findMany({ where: whereLines, include: { vendor: true, invoice: true }, take: 100, orderBy: { transactionDate: 'desc' } }),
    prisma.inventoryTransaction.findMany({ where: whereInv, take: 100, orderBy: { transactionDate: 'desc' } }),
    prisma.invoiceLine.aggregate({ where: whereLines, _sum: { amount: true }, _count: true }),
    prisma.inventoryTransaction.aggregate({ where: whereInv, _sum: { amount: true }, _count: true }),
    prisma.timelineEvent.findMany({ where: { entityType: 'job', entityKey: jobId }, orderBy: { occurredAt: 'desc' }, take: 50 }).catch(() => []),
    prisma.entityRelationship.findMany({ where: { OR: [{ sourceEntityType: 'job', sourceEntityKey: jobId }, { targetEntityType: 'job', targetEntityKey: jobId }] }, take: 50 }).catch(() => []),
    prisma.documentRecord.findMany({ where: { entityType: 'job', entityKey: jobId }, take: 50 }).catch(() => []),
  ]);
  return { type: 'job', title: job.jobId, subtitle: job.description ?? job.well ?? 'Job workspace', record: job, tabs: ['Overview', 'Financials', 'Invoices', 'Inventory', 'Equipment', 'Timeline', 'Documents', 'AI'], invoiceLines, inventory, timeline, relationships, docs, metrics: { invoiceLineTotal: lineAgg._sum.amount, invoiceLineCount: lineAgg._count, inventoryTotal: invAgg._sum.amount, inventoryCount: invAgg._count } };
}

async function getVendorWorkspace(vendorId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { vendorId }, include: { invoices: true, invoiceLines: true } });
  if (!vendor) return null;
  const [invoiceAgg, lineAgg, timeline, relationships, docs] = await Promise.all([
    prisma.invoice.aggregate({ where: { vendorId }, _sum: { amount: true }, _count: true }),
    prisma.invoiceLine.aggregate({ where: { vendorId }, _sum: { amount: true }, _count: true }),
    prisma.timelineEvent.findMany({ where: { entityType: 'vendor', entityKey: vendorId }, orderBy: { occurredAt: 'desc' }, take: 50 }).catch(() => []),
    prisma.entityRelationship.findMany({ where: { OR: [{ sourceEntityType: 'vendor', sourceEntityKey: vendorId }, { targetEntityType: 'vendor', targetEntityKey: vendorId }] }, take: 50 }).catch(() => []),
    prisma.documentRecord.findMany({ where: { entityType: 'vendor', entityKey: vendorId }, take: 50 }).catch(() => []),
  ]);
  return { type: 'vendor', title: vendor.name ?? vendor.vendorId, subtitle: vendor.vendorId, record: vendor, tabs: ['Overview', 'Spend', 'Invoices', 'Jobs', 'Timeline', 'Documents', 'AI'], invoices: vendor.invoices.slice(0, 100), invoiceLines: vendor.invoiceLines.slice(0, 100), timeline, relationships, docs, metrics: { invoiceTotal: invoiceAgg._sum.amount, invoiceCount: invoiceAgg._count, lineTotal: lineAgg._sum.amount, lineCount: lineAgg._count } };
}

async function getInvoiceWorkspace(sageId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { sageId }, include: { vendor: true, lines: { include: { job: true, vendor: true } } } });
  if (!invoice) return null;
  const [timeline, relationships, docs] = await Promise.all([
    prisma.timelineEvent.findMany({ where: { entityType: 'invoice', entityKey: sageId }, orderBy: { occurredAt: 'desc' }, take: 50 }).catch(() => []),
    prisma.entityRelationship.findMany({ where: { OR: [{ sourceEntityType: 'invoice', sourceEntityKey: sageId }, { targetEntityType: 'invoice', targetEntityKey: sageId }] }, take: 50 }).catch(() => []),
    prisma.documentRecord.findMany({ where: { entityType: 'invoice', entityKey: sageId }, take: 50 }).catch(() => []),
  ]);
  return { type: 'invoice', title: invoice.invoice ?? invoice.sageId, subtitle: sageId, record: invoice, tabs: ['Overview', 'Lines', 'Vendor', 'Jobs', 'Timeline', 'Documents', 'AI'], invoiceLines: invoice.lines, timeline, relationships, docs };
}

async function getEquipmentWorkspace(equipmentId: string) {
  const equipment = await prisma.equipment.findUnique({ where: { equipmentId } });
  if (!equipment) return null;
  const [timeline, relationships, docs] = await Promise.all([
    prisma.timelineEvent.findMany({ where: { entityType: 'equipment', entityKey: equipmentId }, orderBy: { occurredAt: 'desc' }, take: 50 }).catch(() => []),
    prisma.entityRelationship.findMany({ where: { OR: [{ sourceEntityType: 'equipment', sourceEntityKey: equipmentId }, { targetEntityType: 'equipment', targetEntityKey: equipmentId }] }, take: 50 }).catch(() => []),
    prisma.documentRecord.findMany({ where: { entityType: 'equipment', entityKey: equipmentId }, take: 50 }).catch(() => []),
  ]);
  return { type: 'equipment', title: equipment.equipmentId, subtitle: equipment.description ?? 'Asset workspace', record: equipment, tabs: ['Overview', 'Current Job', 'Financials', 'Maintenance', 'Fuel', 'Timeline', 'Documents', 'AI'], timeline, relationships, docs };
}
