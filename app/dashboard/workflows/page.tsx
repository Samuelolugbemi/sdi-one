import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceTabs } from '@/components/ui/WorkspacePanel';
import { workflowTemplates } from '@/lib/workflow-engine';

export default function WorkflowsPage() {
  return <AppShell><PageHeader eyebrow="Workflow Engine" title="Automation & Workflow Center" description="Reusable workflow templates for invoices, imports, job risk, equipment repairs, approvals, and future integrations." />
    <WorkspaceTabs tabs={['Workflow Templates','Active Runs','Approvals','Automation Rules','Future Builder']} />
    <div className="grid gap-5 lg:grid-cols-2">{workflowTemplates.map(w => <div key={w.key} className="card p-6"><div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{w.trigger}</div><h2 className="mt-2 text-2xl font-black text-slate-950">{w.name}</h2></div><span className="badge badge-green">Ready</span></div><div className="mt-5 grid gap-2">{w.stages.map((stage, i) => <div key={stage} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">{i + 1}</div><div className="text-sm font-bold text-slate-800">{stage}</div></div>)}</div></div>)}</div>
  </AppShell>;
}
