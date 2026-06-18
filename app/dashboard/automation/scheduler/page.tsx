import { PageHeader } from '../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { prisma } from '../../../../lib/prisma';

export default async function SchedulerPage() {
  const [jobs, runs] = await Promise.all([
    prisma.scheduledJobDefinition.findMany({ orderBy: { name: 'asc' } }),
    prisma.scheduledJobRun.findMany({ orderBy: { startedAt: 'desc' }, take: 20 }),
  ]);
  return <>
    <PageHeader title="Scheduler" description="The scheduler will run imports, KPI refreshes, report delivery, integration syncs, and cleanup jobs." />
    <div className="grid gap-6 xl:grid-cols-2">
      <div><h2 className="mb-3 text-xl font-black">Scheduled Jobs</h2><SimpleTable rows={jobs} columns={[
        { key: 'name', label: 'Job' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'jobType', label: 'Type' },
        { key: 'status', label: 'Status', render: (r:any) => <StatusBadge value={r.status} /> },
      ]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Recent Runs</h2><SimpleTable rows={runs} columns={[
        { key: 'status', label: 'Status', render: (r:any) => <StatusBadge value={r.status} /> },
        { key: 'message', label: 'Message' },
        { key: 'startedAt', label: 'Started' },
      ]} /></div>
    </div>
  </>;
}
