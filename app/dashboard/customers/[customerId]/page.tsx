import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';
import { money, num } from '@/lib/format';

export default async function CustomerDetail({ params }: { params: { customerId: string } }) {
  const customer = await prisma.customer.findUnique({ where: { customerId: decodeURIComponent(params.customerId) }, include: { jobs: true } });
  if (!customer) notFound();
  const jobIds = customer.jobs.map(j => j.jobId);
  const [lineAgg, inventoryAgg] = await Promise.all([
    prisma.invoiceLine.aggregate({ where: { jobId: { in: jobIds } }, _sum: { amount: true }, _count: true }),
    prisma.inventoryTransaction.aggregate({ where: { jobId: { in: jobIds } }, _sum: { amount: true }, _count: true })
  ]);
  return <AppShell><PageHeader title={customer.name ?? customer.customerId} description={`Customer ${customer.customerId}`} />
    <div className="grid gap-4 md:grid-cols-4"><KpiCard label="Jobs" value={num(customer.jobs.length)} /><KpiCard label="Invoice Line Amount" value={money(lineAgg._sum.amount)} /><KpiCard label="Invoice Lines" value={num(lineAgg._count)} /><KpiCard label="Inventory Cost" value={money(inventoryAgg._sum.amount)} /></div>
    <div className="mt-6 card p-5"><h2 className="mb-4 text-lg font-bold">Customer Profile</h2><div className="grid gap-3 text-sm md:grid-cols-3"><div><b>Address:</b> {customer.address1 || '—'}</div><div><b>City:</b> {customer.city || '—'}</div><div><b>State:</b> {customer.state || '—'}</div><div><b>ZIP:</b> {customer.zipCode || '—'}</div><div><b>Type:</b> {customer.type || '—'}</div></div></div>
    <div className="mt-6"><h2 className="mb-3 text-lg font-bold">Related Jobs</h2><SimpleTable rows={customer.jobs} columns={[{key:'jobId', label:'Job', render:r=><RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>},{key:'description', label:'Description'},{key:'status', label:'Status'},{key:'uniqueJob', label:'Unique Job'}]} /></div>
  </AppShell>;
}
