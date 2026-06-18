import { prisma } from '../../../../lib/prisma';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { StatusBadge } from '../../../../components/ui/StatusBadge';

export default async function WorkflowDesignerPage() {
  const workflows = await prisma.workflowDefinition.findMany({ include: { runs: true }, orderBy: { name: 'asc' } });
  const policies = await prisma.approvalPolicy.findMany({ orderBy: { name: 'asc' } });
  return <>
    <PageHeader title="Workflow Designer" description="A configuration-first workflow foundation for approvals, reviews, alerts, and cross-system automation." />
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="card p-6">
        <div className="section-title">Workflow Canvas</div>
        <h2 className="mt-1 text-2xl font-black">Invoice Approval Flow</h2>
        <div className="mt-6 grid gap-4">
          {['Invoice Imported','Amount / Job Rule Evaluation','Accounting Review','Company Admin Approval','Post / Sync / Notify'].map((step, i) => <div key={step} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 font-black text-white">{i+1}</div>
            <div><div className="font-black text-slate-900">{step}</div><div className="text-sm text-slate-500">Metadata-driven stage</div></div>
          </div>)}
        </div>
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="section-title">Policies</div>
          <div className="mt-4 space-y-3">
            {policies.map(p => <div key={p.key} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3"><div><div className="font-black">{p.name}</div><div className="text-sm text-slate-500">{p.description}</div></div><StatusBadge value={p.enabled ? 'Enabled' : 'Disabled'} /></div>
            </div>)}
          </div>
        </div>
        <div className="card p-6">
          <div className="section-title">Workflow Definitions</div>
          <div className="mt-4 space-y-3">
            {workflows.map(w => <div key={w.key} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">{w.name}</div><div className="text-sm text-slate-500">{w.description ?? w.triggerType}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  </>;
}
