import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../../components/ui/KpiCard';
import { getSalesforceCredentialStatus } from '../../../../../../lib/integrations/salesforce/validators';

export default function SalesforceOAuthPage() {
  const status = getSalesforceCredentialStatus();
  return <>
    <PageHeader title="Salesforce OAuth Readiness" description="External Client App / Connected App readiness checklist for replacing SOAP login and Data Loader password-based flows." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Configured" value={status.configured ? 'Yes' : 'No'} tone={status.configured ? 'green' : 'amber'} />
      <KpiCard label="Auth Mode" value={status.authMode} tone="blue" />
      <KpiCard label="Instance" value={status.instanceUrl === 'not-configured' ? 'Missing' : 'Set'} tone="slate" />
      <KpiCard label="API" value={`v${status.apiVersion}`} tone="blue" />
    </div>
    <div className="mt-6 card p-6">
      <div className="section-title">Implementation checklist</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {[
          'Create Salesforce External Client App / Connected App.',
          'Enable OAuth scopes for API access and refresh token/offline access as approved.',
          'Store Client ID and Client Secret in .env or production secret manager.',
          'Confirm integration user permissions on Account, Contact, Opportunity, Third_Party_Invoice__c and Third_Party_Invoice_Line__c.',
          'Run smoke test before enabling scheduled sync.',
          'Keep current Data Loader jobs active until API results are reconciled.',
        ].map(item => <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}
      </div>
    </div>
  </>;
}
