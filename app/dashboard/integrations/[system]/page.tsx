import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';

import { integrations } from '@/lib/platform';
import Link from 'next/link';

export default function IntegrationDetailPage({ params }: { params: { system: string } }) {
  const item = integrations.find(i => i.slug === params.system) ?? { name: params.system, status: 'Ready to Configure', next: 'Connector setup' };
  return <AppShell><PageHeader eyebrow="Integration" title={item.name} description="Connector workspace for credentials, mappings, sync history, errors, schedules and ownership." />
    <WorkspaceTabs tabs={['Overview','Credentials','Mappings','Sync History','Errors','Schedule','Docs']} />
    <div className="grid gap-6 xl:grid-cols-3"><WorkspacePanel title="Status" eyebrow="Connector"><div className="text-3xl font-black">{item.status}</div><p className="mt-3 text-sm text-slate-600">Next: {item.next}</p></WorkspacePanel><WorkspacePanel title="Sync Controls" eyebrow="Operations"><div className="flex flex-wrap gap-2"><button className="btn btn-primary">Run Sync</button><button className="btn">Validate</button><button className="btn">View Logs</button></div></WorkspacePanel><WorkspacePanel title="Owner" eyebrow="Governance"><p className="text-sm text-slate-600">Assign business owner, technical owner and alert recipients before production activation.</p></WorkspacePanel></div>
    <div className="mt-6"><Link href="/dashboard/integrations" className="btn">Back to Integrations</Link></div>
  </AppShell>;
}
