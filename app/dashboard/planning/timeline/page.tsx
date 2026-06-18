import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function PlanningTimelinePage() {
  const items = await prisma.planningItem.findMany({ orderBy: [{ startDate: 'asc' }], take: 200 });
  return <AppShell>
    <PageHeader title="Planning Timeline" description="Schedule view for project plans, Monday.com items, start dates and deadlines." />
    <SimpleTable rows={items} columns={[{key:'title',label:'Planning Item'},{key:'jobId',label:'Job',render:r=>r.jobId?<RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>:'—'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'priority',label:'Priority',render:r=><StatusBadge value={r.priority}/>},{key:'startDate',label:'Start',render:r=>r.startDate?.toLocaleDateString?.() ?? '—'},{key:'dueDate',label:'Due',render:r=>r.dueDate?.toLocaleDateString?.() ?? '—'},{key:'riskLevel',label:'Risk',render:r=><StatusBadge value={r.riskLevel}/>}]} />
  </AppShell>;
}
