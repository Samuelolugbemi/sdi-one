import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EntityGrid, RecordLink } from '@/components/ui/EntityGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function JobsPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const [rows, total] = await Promise.all([
    prisma.job.findMany({ where: q ? { OR: [{ jobId: { contains: q, mode: 'insensitive' } }, { uniqueJob: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }, { well: { contains: q, mode: 'insensitive' } }, { customerId: { contains: q, mode: 'insensitive' } }] } : undefined, include: { customer: true }, orderBy: { jobId: 'asc' }, take: 500 }),
    prisma.job.count()
  ]);
  return <AppShell><PageHeader title="Jobs" description="Projects have been renamed to Jobs throughout Command Center." />
    <EntityGrid title="Jobs" description="Operational job master with customer relationships and unique job keys." rows={rows} dataset="jobs" q={q} placeholder="Search job, unique job, description, customer..." totalLabel={`${total.toLocaleString()} total jobs`} columns={[{key:'jobId', label:'Job', render:r=><RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>},{key:'description', label:'Description'},{key:'status', label:'Status', render:r=><StatusBadge value={r.status} />},{key:'customerId', label:'Customer', render:r=>r.customerId ? <RecordLink href={`/dashboard/customers/${r.customerId}`}>{r.customer?.name ?? r.customerId}</RecordLink> : '—'},{key:'uniqueJob', label:'Unique Job'}]} />
  </AppShell>;
}
