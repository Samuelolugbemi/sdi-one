import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { PageHeader } from '../../../../../components/ui/PageHeader';
import { StatusBadge } from '../../../../../components/ui/StatusBadge';
import { SimpleTable } from '../../../../../components/ui/SimpleTable';
import { WorkflowRunTimeline } from '../../../../../components/workflow/WorkflowRunTimeline';
import { prisma } from '../../../../../lib/prisma';
import { advanceWorkflow } from '../../../../../lib/workflow-runtime';

async function advanceRun(formData: FormData) {
  'use server';
  const runKey = String(formData.get('runKey') ?? '');
  if (runKey) await advanceWorkflow(runKey);
  revalidatePath(`/dashboard/automation/execution/${runKey}`);
  revalidatePath('/dashboard/automation/execution');
}

export default async function WorkflowRunPage({ params }: { params: { runKey: string } }) {
  const run = await prisma.workflowExecution.findUnique({ where: { runKey: params.runKey } });
  if (!run) notFound();
  const [steps, actions] = await Promise.all([
    prisma.workflowExecutionStep.findMany({ where: { executionRunKey: run.runKey }, orderBy: { id: 'asc' } }),
    prisma.workflowActionRun.findMany({ where: { executionRunKey: run.runKey }, orderBy: { id: 'asc' } }),
  ]);
  return <>
    <PageHeader title={run.workflowName ?? run.workflowKey} description={`Execution ${run.runKey}`} />
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      <div className="card p-5"><div className="section-title">Status</div><div className="mt-2"><StatusBadge value={run.status} /></div></div>
      <div className="card p-5"><div className="section-title">Entity</div><div className="mt-2 font-black">{run.entityType ?? '—'} / {run.entityKey ?? '—'}</div></div>
      <div className="card p-5"><div className="section-title">Current Step</div><div className="mt-2 font-black">{run.currentStep ?? 'Complete'}</div></div>
      <div className="card p-5"><div className="section-title">Requested By</div><div className="mt-2 font-black">{run.requestedBy ?? 'System'}</div></div>
    </div>
    <form action={advanceRun} className="mb-6">
      <input type="hidden" name="runKey" value={run.runKey} />
      <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-700" disabled={run.status === 'Completed'}>Advance workflow</button>
    </form>
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div><h2 className="mb-3 text-xl font-black">Execution Timeline</h2><WorkflowRunTimeline steps={steps} /></div>
      <div><h2 className="mb-3 text-xl font-black">Action Runs</h2><SimpleTable rows={actions} columns={[
        { key: 'actionKey', label: 'Action' },
        { key: 'actionType', label: 'Type' },
        { key: 'status', label: 'Status', render: (r:any) => <StatusBadge value={r.status} /> },
      ]} /></div>
    </div>
  </>;
}
