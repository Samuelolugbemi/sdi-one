import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { getSageCredentialStatus } from '../../../../../../lib/integrations/sage-intacct/validators';
import { buildSageIntacctSyncPlan } from '../../../../../../lib/integrations/sage-intacct/sync-plans';

export default function SageIntacctConfigurePage() {
  const credentials = getSageCredentialStatus();
  const plan = buildSageIntacctSyncPlan();
  return <>
    <PageHeader title="Configure Sage Intacct" description="v1.1 introduces the production connector layer for Sage Intacct. CSV import remains active while API credentials are added and tested." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Credential Status" value={credentials.configured ? 'Configured' : 'Missing'} sub={credentials.configured ? 'Ready for API smoke test' : `${credentials.missing.length} values needed`} tone={credentials.configured ? 'green' : 'amber'} />
      <KpiCard label="Mode" value={plan.mode} sub="CSV fallback remains enabled" tone="blue" />
      <KpiCard label="Objects" value={String(plan.objects.length)} sub="Cataloged for sync" tone="slate" />
      <KpiCard label="Endpoint" value="XML API" sub={credentials.endpoint.replace('https://', '')} tone="blue" />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <div className="section-title">Required .env values</div>
        <div className="mt-4 space-y-2">
          {['INTACCT_COMPANY_ID','INTACCT_USER_ID','INTACCT_USER_PASSWORD','INTACCT_SENDER_ID','INTACCT_SENDER_PASSWORD','INTACCT_API_ENDPOINT'].map(key => <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="font-black">{key}</span><span className={credentials.missing.includes(key) ? 'badge badge-amber' : 'badge badge-green'}>{credentials.missing.includes(key) ? 'Missing' : 'Set'}</span></div>)}
        </div>
      </div>
      <div className="card p-6">
        <div className="section-title">Safeguards</div>
        <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-600">
          {plan.safeguards.map(item => <li key={item} className="rounded-2xl border border-slate-200 bg-white p-3">{item}</li>)}
        </ul>
      </div>
    </div>
  </>;
}
