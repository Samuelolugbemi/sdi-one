import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { getPorCredentialStatus } from '../../../../../../lib/integrations/point-of-rental/validators';
import { buildPorSyncPlan } from '../../../../../../lib/integrations/point-of-rental/sync-plans';

export default function PorConfigurePage() {
  const credentials = getPorCredentialStatus();
  const plan = buildPorSyncPlan();
  const keys = ['POR_MODE', 'POR_IMPORT_FOLDER', 'POR_EXPORT_FOLDER', 'POR_ODBC_DSN', 'POR_API_BASE_URL', 'POR_API_KEY'];
  return <>
    <PageHeader title="Configure Point of Rental" description="v1.3 introduces the POR connector layer for equipment item files, repair cost snapshots, rental availability and future rental history sync." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Credential Status" value={credentials.configured ? 'Configured' : 'Missing'} sub={credentials.configured ? 'Ready for bridge sync' : `${credentials.missing.length} values needed`} tone={credentials.configured ? 'green' : 'amber'} />
      <KpiCard label="Mode" value={plan.mode} sub="CSV/ODBC/API-ready design" tone="blue" />
      <KpiCard label="Objects" value={String(plan.objects.length)} sub="Cataloged for sync" tone="slate" />
      <KpiCard label="Direction" value="Bi-ready" sub="POR ↔ SDI One" tone="blue" />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <div className="section-title">POR .env values</div>
        <div className="mt-4 space-y-2">
          {keys.map(key => <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="font-black">{key}</span><span className={credentials.missing.includes(key) ? 'badge badge-amber' : 'badge badge-green'}>{credentials.missing.includes(key) ? 'Missing/Optional' : 'Set'}</span></div>)}
        </div>
      </div>
      <div className="card p-6">
        <div className="section-title">Connector safeguards</div>
        <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-600">
          {plan.safeguards.map(item => <li key={item} className="rounded-2xl border border-slate-200 bg-white p-3">{item}</li>)}
        </ul>
      </div>
    </div>
  </>;
}
