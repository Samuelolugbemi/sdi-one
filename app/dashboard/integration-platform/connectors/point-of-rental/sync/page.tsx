import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { buildPorSyncPlan } from '../../../../../../lib/integrations/point-of-rental/sync-plans';
import { buildPorFilePaths } from '../../../../../../lib/integrations/point-of-rental/client';

export default function PorSyncPage() {
  const plan = buildPorSyncPlan();
  const paths = buildPorFilePaths();
  return <>
    <PageHeader title="POR Sync Plan" description="Production-ready sync plan for the POR bridge and future ODBC/API connector." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Scheduled Jobs" value={String(plan.scheduledJobs.length)} sub="Registered syncs" tone="blue" />
      <KpiCard label="Ready Objects" value={String(plan.objects.filter(o => o.readiness === 'ready').length)} sub="Can start now" tone="green" />
      <KpiCard label="Bridge Objects" value={String(plan.objects.filter(o => o.readiness === 'bridge').length)} sub="CSV/staged" tone="amber" />
      <KpiCard label="Future Objects" value={String(plan.objects.filter(o => o.readiness === 'future').length)} sub="API/ODBC later" tone="slate" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div className="card p-6"><div className="section-title">Scheduled sync jobs</div><div className="mt-4 space-y-3">{plan.scheduledJobs.map(job => <div key={job.key} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="font-black">{job.name}</div><div className="text-sm text-slate-500">{job.cadence} · {job.direction}</div></div>)}</div></div>
      <div className="card p-6"><div className="section-title">Bridge file paths</div><div className="mt-4 space-y-3">{Object.entries(paths).map(([key, value]) => <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black">{key}</div><div className="text-sm text-slate-500">{value}</div></div>)}</div></div>
    </div>
  </>;
}
