import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { getSalesforceCredentialStatus } from '../../../../../../lib/integrations/salesforce/validators';
import { buildSalesforceSyncPlan } from '../../../../../../lib/integrations/salesforce/sync-plans';

export default function SalesforceConfigurePage() {
  const credentials = getSalesforceCredentialStatus();
  const plan = buildSalesforceSyncPlan();
  const keys = ['SALESFORCE_INSTANCE_URL','SALESFORCE_CLIENT_ID','SALESFORCE_CLIENT_SECRET','SALESFORCE_USERNAME','SALESFORCE_PASSWORD','SALESFORCE_SECURITY_TOKEN','SALESFORCE_API_VERSION','SALESFORCE_ORG_ID'];
  return <>
    <PageHeader title="Configure Salesforce" description="v1.2 introduces the Salesforce connector layer for OAuth/API sync while preserving current Data Loader automations." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Credential Status" value={credentials.configured ? 'Configured' : 'Missing'} sub={credentials.configured ? 'Ready for API smoke test' : `${credentials.missing.length} values needed`} tone={credentials.configured ? 'green' : 'amber'} />
      <KpiCard label="Mode" value={plan.mode} sub="Data Loader bridge remains supported" tone="blue" />
      <KpiCard label="Objects" value={String(plan.objects.length)} sub="Cataloged for sync" tone="slate" />
      <KpiCard label="API Version" value={`v${credentials.apiVersion}`} sub={credentials.instanceUrl} tone="blue" />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <div className="section-title">Salesforce .env values</div>
        <div className="mt-4 space-y-2">
          {keys.map(key => <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><span className="font-black">{key}</span><span className={credentials.missing.includes(key) ? 'badge badge-amber' : 'badge badge-green'}>{credentials.missing.includes(key) ? 'Missing' : 'Set'}</span></div>)}
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
