import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';
import { money, num, date } from '@/lib/format';

export default async function JobDetail({ params }: { params: { jobId: string } }) {
  const jobId = decodeURIComponent(params.jobId);
  const job = await prisma.job.findUnique({ where: { jobId }, include: { customer: true } });
  if (!job) notFound();
  const lineWhere: any = job.uniqueJob ? { OR: [{ jobId }, { uniqueJob: job.uniqueJob }] } : { jobId };
  const invWhere: any = job.uniqueJob ? { OR: [{ jobId }, { uniqueJobNumber: job.uniqueJob }] } : { jobId };
  const [lines, invRows, lineAgg, invAgg] = await Promise.all([
    prisma.invoiceLine.findMany({ where: lineWhere, include: { vendor: true, invoice: true }, orderBy: { transactionDate: 'desc' }, take: 100 }),
    prisma.inventoryTransaction.findMany({ where: invWhere, orderBy: { transactionDate: 'desc' }, take: 100 }),
    prisma.invoiceLine.aggregate({ where: lineWhere, _sum: { amount: true }, _count: true }),
    prisma.inventoryTransaction.aggregate({ where: invWhere, _sum: { amount: true }, _count: true })
  ]);
  return <AppShell><PageHeader title={job.jobId} description={job.description ?? job.well ?? 'Job detail'} />
    <div className="grid gap-4 md:grid-cols-4"><KpiCard label="Invoice Line Amount" value={money(lineAgg._sum.amount)} /><KpiCard label="Invoice Lines" value={num(lineAgg._count)} /><KpiCard label="Inventory Cost" value={money(invAgg._sum.amount)} /><KpiCard label="Inventory Rows" value={num(invAgg._count)} /></div>
    <div className="mt-6 card p-5"><h2 className="mb-4 text-lg font-bold">Job Profile</h2><div className="grid gap-3 text-sm md:grid-cols-3"><div><b>Status:</b> {job.status || '—'}</div><div><b>Customer:</b> {job.customerId ? <RecordLink href={`/dashboard/customers/${job.customerId}`}>{job.customer?.name ?? job.customerId}</RecordLink> : '—'}</div><div><b>Unique Job:</b> {job.uniqueJob || '—'}</div><div><b>County:</b> {job.county || '—'}</div><div><b>Well:</b> {job.well || '—'}</div><div><b>Record Type:</b> {job.recordTypeName || '—'}</div></div></div>
    <div className="mt-6"><h2 className="mb-3 text-lg font-bold">Invoice Lines</h2><SimpleTable rows={lines} columns={[{key:'sageId', label:'Line ID'},{key:'transactionDate', label:'Date', render:r=>date(r.transactionDate)},{key:'invoiceSageId', label:'Invoice', render:r=>r.invoiceSageId ? <RecordLink href={`/dashboard/invoices/${r.invoiceSageId}`}>{r.invoiceSageId}</RecordLink> : '—'},{key:'vendorId', label:'Vendor', render:r=>r.vendorId ? <RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendor?.name ?? r.vendorId}</RecordLink> : '—'},{key:'costCode', label:'Cost Code'},{key:'amount', label:'Amount', render:r=>money(r.amount)},{key:'description', label:'Description'}]} /></div>
    <div className="mt-6"><h2 className="mb-3 text-lg font-bold">Inventory Usage</h2><SimpleTable rows={invRows} columns={[{key:'rowId', label:'Row'},{key:'transactionDate', label:'Date', render:r=>date(r.transactionDate)},{key:'costCode', label:'Cost Code'},{key:'description', label:'Description'},{key:'units', label:'Units', render:r=>String(r.units ?? '—')},{key:'amount', label:'Amount', render:r=>money(r.amount)}]} /></div>
  </AppShell>;
}
