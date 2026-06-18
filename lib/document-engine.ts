import { prisma } from '@/lib/prisma';

export type DocumentEntityType = 'customer' | 'job' | 'vendor' | 'invoice' | 'equipment' | 'inventory' | 'integration' | 'platform';

export const documentCategories = [
  'Invoice PDF',
  'Contract',
  'Receipt',
  'Photo',
  'Drawing',
  'Email',
  'Approval Support',
  'Maintenance Record',
  'Closeout Package',
  'Other',
];

export const documentEntityTypes: { key: DocumentEntityType; label: string; description: string }[] = [
  { key: 'customer', label: 'Customers', description: 'Contracts, correspondence, credit files and customer-specific support.' },
  { key: 'job', label: 'Jobs', description: 'Job documents, field photos, drawings, closeout files and approvals.' },
  { key: 'vendor', label: 'Vendors', description: 'W-9s, insurance, vendor documents, invoices and support.' },
  { key: 'invoice', label: 'Invoices', description: 'AP bill PDFs, receipts, Paperless support and approval documents.' },
  { key: 'equipment', label: 'Equipment', description: 'Asset photos, maintenance records, repair documents and inspection files.' },
  { key: 'inventory', label: 'Inventory', description: 'Inventory support, transfer documentation and receiving details.' },
];

export async function getDocumentStats() {
  const [total, active, deleted] = await Promise.all([
    prisma.documentRecord.count(),
    prisma.documentRecord.count({ where: { isDeleted: false } }),
    prisma.documentRecord.count({ where: { isDeleted: true } }),
  ]);

  const byEntity = await prisma.documentRecord.groupBy({
    by: ['entityType'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  const byCategory = await prisma.documentRecord.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return { total, active, deleted, byEntity, byCategory };
}

export async function getRecentDocuments(limit = 50) {
  return prisma.documentRecord.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getEntityDocuments(entityType: string, entityKey: string) {
  return prisma.documentRecord.findMany({
    where: { entityType, entityKey, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: { versions: true, shares: true, accessEvents: { orderBy: { createdAt: 'desc' }, take: 5 } },
  });
}
