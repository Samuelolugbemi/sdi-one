import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

function num(v: unknown) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export default async function ResourceLoadPage() {
  const rows = await prisma.resourceAssignment.findMany({ orderBy: [{ startDate: 'asc' }], take: 250 });
  const planned = rows.reduce((s, r) => s + num(r.plannedHours), 0);
  const actual = rows.reduce((s, r) => s + num(r.actualHours), 0);
  return <AppShell>
    <PageHeader title="Resource Load" description="Planned vs actual resource assignments across people, equipment and jobs." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Assignments" value={String(rows.length)} tone="blue" />
      <KpiCard label="Planned Hours" value={planned.toFixed(1)} tone="green" />
      <KpiCard label="Actual Hours" value={actual.toFixed(1)} tone="slate" />
      <KpiCard label="Utilized" value={planned ? `${((actual/planned)*100).toFixed(0)}%` : '0%'} tone="amber" />
    </div>
    <div className="mt-6"><SimpleTable rows={rows} columns={[{key:'resourceName',label:'Resource'},{key:'resourceType',label:'Type',render:r=><StatusBadge value={r.resourceType}/>},{key:'jobId',label:'Job',render:r=>r.jobId?<RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>:'—'},{key:'plannedHours',label:'Planned'},{key:'actualHours',label:'Actual'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'startDate',label:'Start',render:r=>r.startDate?.toLocaleDateString?.() ?? '—'},{key:'endDate',label:'End',render:r=>r.endDate?.toLocaleDateString?.() ?? '—'}]} /></div>
  </AppShell>;
}
