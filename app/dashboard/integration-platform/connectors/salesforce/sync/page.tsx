import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { buildSalesforceSyncPlan } from '../../../../../../lib/integrations/salesforce/sync-plans';

export default function SalesforceSyncPage() {
  const plan = buildSalesforceSyncPlan();
  return <>
    <PageHeader title="Salesforce Sync Plan" description="Production plan for moving from Data Loader tasks to OAuth/API-managed sync without disrupting current Salesforce operations." />
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard label="Mode" value={plan.mode} tone="blue" />
      <KpiCard label="Objects" value={String(plan.objects.length)} tone="green" />
      <KpiCard label="Safeguards" value={String(plan.safeguards.length)} tone="slate" />
    </div>
    <div className="mt-6"><SimpleTable rows={plan.objects as any[]} columns={[
      { key: 'label', label: 'Object' },
      { key: 'source', label: 'Source' },
      { key: 'targetEntity', label: 'Target' },
      { key: 'externalId', label: 'External ID' },
      { key: 'status', label: 'Status', render: row => <StatusBadge value={row.status} /> },
      { key: 'cadence', label: 'Cadence' },
    ]} /></div>
    <div className="mt-6 card p-6"><div className="section-title">Next Actions</div><div className="mt-4 grid gap-3 md:grid-cols-2">{plan.nextActions.map(action => <div key={action} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{action}</div>)}</div></div>
  </>;
}
