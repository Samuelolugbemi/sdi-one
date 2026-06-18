import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getProjectPlanningDashboard } from '@/lib/project-planning';

export default async function PlanningPage() {
  const { boards, items, tasks, metrics } = await getProjectPlanningDashboard();
  return <AppShell>
    <PageHeader title="Project Planning" description="Monday.com-ready planning layer connecting boards, tasks, resources and job execution." actions={<Link className="btn btn-primary" href="/dashboard/integration-platform/connectors/monday-com/configure">Configure Monday.com</Link>} />
    <div className="grid gap-4 md:grid-cols-6">
      <KpiCard label="Boards" value={String(metrics.totalBoards)} tone="blue" />
      <KpiCard label="Planning Items" value={String(metrics.totalItems)} tone="green" />
      <KpiCard label="Tasks" value={String(metrics.totalTasks)} tone="slate" />
      <KpiCard label="At Risk" value={String(metrics.atRisk)} tone="red" />
      <KpiCard label="Overdue" value={String(metrics.overdue)} tone="amber" />
      <KpiCard label="Avg Completion" value={`${metrics.avgCompletion.toFixed(0)}%`} tone="blue" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2"><h2 className="mb-3 text-xl font-black">Active Planning Items</h2><SimpleTable rows={items} columns={[{key:'title',label:'Plan Item',render:r=><RecordLink href={`/dashboard/planning/tasks?item=${r.itemKey}`}>{r.title}</RecordLink>},{key:'jobId',label:'Job',render:r=>r.jobId?<RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>:'—'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'priority',label:'Priority',render:r=><StatusBadge value={r.priority}/>},{key:'riskLevel',label:'Risk',render:r=><StatusBadge value={r.riskLevel}/>},{key:'completionPct',label:'Done %'}]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Boards</h2><SimpleTable rows={boards} columns={[{key:'name',label:'Board',render:r=><RecordLink href={`/dashboard/planning/boards?board=${r.boardKey}`}>{r.name}</RecordLink>},{key:'ownerTeam',label:'Team'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>}]} /></div>
    </div>
    <div className="mt-6"><h2 className="mb-3 text-xl font-black">Upcoming Tasks</h2><SimpleTable rows={tasks.slice(0, 10)} columns={[{key:'title',label:'Task'},{key:'jobId',label:'Job',render:r=>r.jobId?<RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>:'—'},{key:'assigneeName',label:'Assignee'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'taskType',label:'Type'},{key:'dueDate',label:'Due',render:r=>r.dueDate?.toLocaleDateString?.() ?? '—'}]} /></div>
  </AppShell>;
}
