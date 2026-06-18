import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../components/ui/KpiCard';
import { SimpleTable } from '../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../components/ui/StatusBadge';
import { prisma } from '../../../../lib/prisma';
import { getWorkflowExecutionSummary, launchWorkflow } from '../../../../lib/workflow-runtime';

async function startDemoWorkflow() {
  'use server';
  await launchWorkflow({
    workflowKey: 'invoice-approval-flow',
    entityType: 'invoice',
    entityKey: 'DEMO-INVOICE',
    requestedBy: 'admin@sdi.local',
    context: { source: 'Manual demo launch', amount: 25000 },
  });
  revalidatePath('/dashboard/automation/execution');
}

export default async function WorkflowExecutionPage() {
  const [summary, runs, templates, queue] = await Promise.all([
    getWorkflowExecutionSummary(),
    prisma.workflowExecution.findMany({ orderBy: { startedAt: 'desc' }, take: 25 }),
    prisma.workflowStepTemplate.findMany({ orderBy: [{ workflowKey: 'asc' }, { sortOrder: 'asc' }] }),
    prisma.workflowQueueItem.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return <>
    <PageHeader title="Workflow Execution Engine" description="v0.9 turns workflow configuration into executable runs, steps, actions, queues, and event subscriptions." />
    <div className="grid gap-4 md:grid-cols-5">
      <KpiCard label="Executions" value={String(summary.executions)} sub="Workflow runs" tone="blue" />
      <KpiCard label="Queued" value={String(summary.queued)} sub="Waiting to start" tone="slate" />
      <KpiCard label="Waiting" value={String(summary.waiting)} sub="Approval/user action" tone="amber" />
      <KpiCard label="Completed" value={String(summary.completed)} sub="Finished runs" tone="green" />
      <KpiCard label="Step Templates" value={String(summary.templates)} sub="Workflow stages" tone="purple" />
    </div>

    <div className="mt-6 flex flex-wrap gap-3">
      <form action={startDemoWorkflow}><button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-700">Start demo invoice workflow</button></form>
      <Link href="/dashboard/automation/designer" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">Open designer</Link>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div>
        <h2 className="mb-3 text-xl font-black">Recent Executions</h2>
        <SimpleTable rows={runs} columns={[
          { key: 'runKey', label: 'Run', render: (r:any) => <Link className="font-black text-blue-700" href={`/dashboard/automation/execution/${r.runKey}`}>{r.runKey}</Link> },
          { key: 'workflowName', label: 'Workflow' },
          { key: 'entityType', label: 'Entity' },
          { key: 'status', label: 'Status', render: (r:any) => <StatusBadge value={r.status} /> },
        ]} />
      </div>
      <div>
        <h2 className="mb-3 text-xl font-black">Step Templates</h2>
        <SimpleTable rows={templates} columns={[
          { key: 'name', label: 'Step' },
          { key: 'workflowKey', label: 'Workflow' },
          { key: 'stepType', label: 'Type', render: (r:any) => <StatusBadge value={r.stepType} /> },
          { key: 'enabled', label: 'Enabled', render: (r:any) => <StatusBadge value={r.enabled ? 'Enabled' : 'Disabled'} /> },
        ]} />
      </div>
    </div>

    <div className="mt-6">
      <h2 className="mb-3 text-xl font-black">Queue</h2>
      <SimpleTable rows={queue} columns={[
        { key: 'queueKey', label: 'Queue Item' },
        { key: 'workflowKey', label: 'Workflow' },
        { key: 'entityType', label: 'Entity' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status', render: (r:any) => <StatusBadge value={r.status} /> },
      ]} />
    </div>
  </>;
}
