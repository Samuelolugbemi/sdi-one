import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable } from '@/components/ui/SimpleTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getMondayConnectorDashboard } from '@/lib/project-planning';

export default async function Page() {
  const { connector, mappings, runs, logs, boards } = await getMondayConnectorDashboard();
  return <AppShell>
    <PageHeader title="Monday.com Mappings" description="Project planning connector for boards, items, subitems, dependencies and job planning synchronization." actions={<Link className="btn btn-primary" href="/dashboard/planning">Project Planning</Link>} />
    <div className="grid gap-4 md:grid-cols-5">
      <KpiCard label="Status" value={connector?.status ?? 'Not seeded'} tone="blue" />
      <KpiCard label="Mappings" value={String(mappings.length)} tone="green" />
      <KpiCard label="Runs" value={String(runs.length)} tone="slate" />
      <KpiCard label="Boards" value={String(boards.length)} tone="amber" />
      <KpiCard label="Enabled" value={connector?.enabled ? 'Yes' : 'No'} tone="blue" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div><h2 className="mb-3 text-xl font-black">Object Mappings</h2><SimpleTable rows={mappings} columns={[{key:'sourceObject',label:'Source Object'},{key:'targetEntity',label:'Target Entity'},{key:'enabled',label:'Status',render:r=><StatusBadge value={r.enabled?'Enabled':'Disabled'}/>}]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Runs & Logs</h2><SimpleTable rows={runs.length ? runs : logs} columns={runs.length ? [{key:'runType',label:'Run Type'},{key:'status',label:'Status',render:r=><StatusBadge value={r.status}/>},{key:'recordsRead',label:'Read'},{key:'recordsWritten',label:'Written'}] : [{key:'level',label:'Level'},{key:'message',label:'Message'},{key:'createdAt',label:'Created',render:r=>r.createdAt?.toLocaleString?.()??'—'}]} /></div>
    </div>
  </AppShell>;
}
