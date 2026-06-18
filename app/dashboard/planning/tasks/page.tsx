import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/prisma';

export default async function PlanningTasksPage() {
  const tasks = await prisma.planningTask.findMany({ include: { item: true, board: true }, orderBy: [{ status: 'asc' }, { dueDate: 'asc' }], take: 250 });
  return <AppShell>
    <PageHeader title="Planning Tasks" description="Task/subitem execution view connected to jobs, Monday.com and resource planning." />
    <SimpleTable rows={tasks} columns={[{key:'title',label:'Task'},{key:'jobId',label:'Job',render:r=>r.jobId?<RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>:'—'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'taskType',label:'Type'},{key:'assigneeName',label:'Assignee'},{key:'percentDone',label:'Done %'},{key:'dueDate',label:'Due',render:r=>r.dueDate?.toLocaleDateString?.() ?? '—'},{key:'sourceSystem',label:'Source'}]} />
  </AppShell>;
}
