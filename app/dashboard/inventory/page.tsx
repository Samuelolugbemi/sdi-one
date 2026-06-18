import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EntityGrid, RecordLink } from '@/components/ui/EntityGrid';
import { prisma } from '@/lib/prisma';
import { money, date } from '@/lib/format';

export default async function InventoryPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const [rows, total] = await Promise.all([
    prisma.inventoryTransaction.findMany({ where: q ? { OR: [{ rowId: { contains: q, mode: 'insensitive' } }, { jobId: { contains: q, mode: 'insensitive' } }, { uniqueJobNumber: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }, { costCode: { contains: q, mode: 'insensitive' } }] } : undefined, include: { job: true }, orderBy: { transactionDate: 'desc' }, take: 500 }),
    prisma.inventoryTransaction.count()
  ]);
  return <AppShell><PageHeader title="Inventory" description="Inventory transactions by job, cost code, units, and amount." />
    <EntityGrid title="Inventory Transactions" description="Trace materials and inventory usage back to jobs." rows={rows} dataset="inventory" q={q} placeholder="Search row, job, cost code, description..." totalLabel={`${total.toLocaleString()} total rows`} columns={[{key:'rowId', label:'Row ID'},{key:'transactionDate', label:'Transaction Date', render:r=>date(r.transactionDate)},{key:'jobId', label:'Job', render:r=>r.jobId ? <RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink> : '—'},{key:'costCode', label:'Cost Code'},{key:'description', label:'Description'},{key:'units', label:'Units', align:'right', render:r=>String(r.units ?? '—')},{key:'amount', label:'Amount', align:'right', render:r=>money(r.amount)}]} />
  </AppShell>;
}
