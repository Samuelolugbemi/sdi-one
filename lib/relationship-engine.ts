import { prisma } from '@/lib/prisma';

export type RelationshipNode = { type: string; key: string; label: string; href: string; description?: string };
export type RelationshipEdge = { source: RelationshipNode; target: RelationshipNode; relationship: string; strength?: 'direct' | 'derived' | 'future' };

export async function getRelationshipGraph(entityType?: string, entityKey?: string) {
  if (!entityType || !entityKey) return getGlobalRelationshipRules();
  if (entityType === 'customer') return getCustomerRelationships(entityKey);
  if (entityType === 'job') return getJobRelationships(entityKey);
  if (entityType === 'vendor') return getVendorRelationships(entityKey);
  if (entityType === 'invoice') return getInvoiceRelationships(entityKey);
  if (entityType === 'equipment') return getEquipmentRelationships(entityKey);
  return getGlobalRelationshipRules();
}

export async function getGlobalRelationshipRules() {
  const rules: RelationshipEdge[] = [
    edge('Customer','customer','global','/dashboard/customers','Job','job','many','/dashboard/jobs','AR_Customer → customerId','direct'),
    edge('Job','job','global','/dashboard/jobs','Invoice Line','invoice-line','many','/dashboard/invoices','Job/Unique_Job → jobId/uniqueJob','direct'),
    edge('Invoice','invoice','global','/dashboard/invoices','Invoice Line','invoice-line','many','/dashboard/invoices','Invoice_Sage_ID → sageId','direct'),
    edge('Vendor','vendor','global','/dashboard/vendors','Invoice','invoice','many','/dashboard/invoices','Vendor → vendorId','direct'),
    edge('Job','job','global','/dashboard/jobs','Inventory','inventory','many','/dashboard/inventory','Job/Unique_Job_Number → jobId/uniqueJob','direct'),
    edge('Equipment','equipment','global','/dashboard/equipment','Company','company','derived','/dashboard/admin/company-access','first segment of equipment id','derived'),
    edge('Job','job','global','/dashboard/jobs','Company','company','derived','/dashboard/admin/company-access','middle segment of job id','derived'),
  ];
  return rules;
}

export async function getCustomerRelationships(customerId: string) {
  const jobs = await prisma.job.findMany({ where: { customerId }, take: 50 });
  return jobs.map(j => edge('Customer','customer',customerId,`/dashboard/customers/${customerId}`,'Job','job',j.jobId,`/dashboard/jobs/${j.jobId}`,'owns job','direct'));
}

export async function getJobRelationships(jobId: string) {
  const job = await prisma.job.findUnique({ where: { jobId }, include: { customer: true } });
  const lines = await prisma.invoiceLine.findMany({ where: job?.uniqueJob ? { OR: [{ jobId }, { uniqueJob: job.uniqueJob }] } : { jobId }, include: { vendor: true, invoice: true }, take: 50 });
  const inv = await prisma.inventoryTransaction.findMany({ where: job?.uniqueJob ? { OR: [{ jobId }, { uniqueJobNumber: job.uniqueJob }] } : { jobId }, take: 50 });
  const edges: RelationshipEdge[] = [];
  if (job?.customerId) edges.push(edge('Job','job',jobId,`/dashboard/jobs/${jobId}`,'Customer','customer',job.customerId,`/dashboard/customers/${job.customerId}`,'belongs to customer','direct'));
  for (const l of lines) {
    if (l.invoiceSageId) edges.push(edge('Job','job',jobId,`/dashboard/jobs/${jobId}`,'Invoice','invoice',l.invoiceSageId,`/dashboard/invoices/${l.invoiceSageId}`,'costed through invoice line','derived'));
    if (l.vendorId) edges.push(edge('Job','job',jobId,`/dashboard/jobs/${jobId}`,'Vendor','vendor',l.vendorId,`/dashboard/vendors/${l.vendorId}`,'vendor spend','derived'));
  }
  for (const r of inv) edges.push(edge('Job','job',jobId,`/dashboard/jobs/${jobId}`,'Inventory','inventory',r.rowId,`/dashboard/inventory`,'inventory usage','direct'));
  return dedupeEdges(edges);
}

export async function getVendorRelationships(vendorId: string) {
  const invoices = await prisma.invoice.findMany({ where: { vendorId }, take: 50 });
  return invoices.map(i => edge('Vendor','vendor',vendorId,`/dashboard/vendors/${vendorId}`,'Invoice','invoice',i.sageId,`/dashboard/invoices/${i.sageId}`,'submitted invoice','direct'));
}

export async function getInvoiceRelationships(sageId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { sageId }, include: { vendor: true, lines: true } });
  const edges: RelationshipEdge[] = [];
  if (invoice?.vendorId) edges.push(edge('Invoice','invoice',sageId,`/dashboard/invoices/${sageId}`,'Vendor','vendor',invoice.vendorId,`/dashboard/vendors/${invoice.vendorId}`,'from vendor','direct'));
  for (const l of invoice?.lines ?? []) if (l.jobId) edges.push(edge('Invoice','invoice',sageId,`/dashboard/invoices/${sageId}`,'Job','job',l.jobId,`/dashboard/jobs/${l.jobId}`,'spent on job','derived'));
  return dedupeEdges(edges);
}

export async function getEquipmentRelationships(equipmentId: string) {
  const company = equipmentId.split('-')[0];
  return [edge('Equipment','equipment',equipmentId,`/dashboard/equipment/${equipmentId}`,'Company','company',company,'/dashboard/admin/company-access','owned by company','derived')];
}

function edge(sourceLabel: string, sourceType: string, sourceKey: string, sourceHref: string, targetLabel: string, targetType: string, targetKey: string, targetHref: string, relationship: string, strength: RelationshipEdge['strength'] = 'direct'): RelationshipEdge {
  return { source: { type: sourceType, key: sourceKey, label: sourceLabel, href: sourceHref }, target: { type: targetType, key: targetKey, label: targetLabel, href: targetHref }, relationship, strength };
}
function dedupeEdges(edges: RelationshipEdge[]) { const seen = new Set<string>(); return edges.filter(e => { const k = `${e.source.type}:${e.source.key}:${e.target.type}:${e.target.key}:${e.relationship}`; if (seen.has(k)) return false; seen.add(k); return true; }); }
