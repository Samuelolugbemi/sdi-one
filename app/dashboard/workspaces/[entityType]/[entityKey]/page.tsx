import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { EnterpriseWorkspace } from '@/components/ui/EnterpriseWorkspace';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { WorkspacePanel } from '@/components/ui/WorkspacePanel';
import { TimelineList } from '@/components/ui/TimelineList';
import { RelationshipGraphTable } from '@/components/ui/RelationshipGraphTable';
import { getWorkspaceData } from '@/lib/workspace-data';
import { money, num, date } from '@/lib/format';

export default async function GenericWorkspacePage({ params }: { params: { entityType: string; entityKey: string } }) {
  const entityType = decodeURIComponent(params.entityType);
  const entityKey = decodeURIComponent(params.entityKey);
  const data: any = await getWorkspaceData(entityType, entityKey);
  if (!data) notFound();
  const metrics = data.metrics ?? {};
  return <AppShell><div className="p-6"><EnterpriseWorkspace entityType={data.type} title={data.title} subtitle={data.subtitle} tabs={data.tabs}>
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Invoice Lines" value={num(metrics.invoiceLineCount ?? data.invoiceLines?.length ?? 0)} />
      <KpiCard label="Invoice/Line Spend" value={money(metrics.invoiceLineTotal ?? metrics.lineTotal ?? metrics.invoiceTotal ?? 0)} />
      <KpiCard label="Inventory Rows" value={num(metrics.inventoryCount ?? data.inventory?.length ?? 0)} />
      <KpiCard label="Inventory Cost" value={money(metrics.inventoryTotal ?? 0)} />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-3">
      <WorkspacePanel title="AI Workspace Summary" eyebrow="AI Ready"><p className="text-sm font-semibold leading-7 text-slate-600">This workspace has enough connected context for SDI One AI to answer: what happened, why it happened, and what should be reviewed next. Live model integration will connect in the AI phase.</p></WorkspacePanel>
      <WorkspacePanel title="Timeline" eyebrow="Events"><TimelineList events={data.timeline ?? []} /></WorkspacePanel>
      <WorkspacePanel title="Relationships" eyebrow="Graph"><RelationshipGraphTable relationships={data.relationships ?? []} /></WorkspacePanel>
    </div>
    {data.jobs?.length ? <div className="mt-6"><h2 className="mb-3 text-lg font-black">Related Jobs</h2><SimpleTable rows={data.jobs} columns={[{key:'jobId', label:'Job', render:r=><RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>},{key:'status', label:'Status'},{key:'description', label:'Description'}]} /></div> : null}
    {data.invoiceLines?.length ? <div className="mt-6"><h2 className="mb-3 text-lg font-black">Invoice Lines</h2><SimpleTable rows={data.invoiceLines} columns={[{key:'sageId', label:'Line'},{key:'transactionDate', label:'Date', render:r=>date(r.transactionDate)},{key:'jobId', label:'Job', render:r=>r.jobId ? <RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink> : '—'},{key:'vendorId', label:'Vendor', render:r=>r.vendorId ? <RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendor?.name ?? r.vendorId}</RecordLink> : '—'},{key:'amount', label:'Amount', render:r=>money(r.amount), align:'right'},{key:'description', label:'Description'}]} /></div> : null}
    {data.inventory?.length ? <div className="mt-6"><h2 className="mb-3 text-lg font-black">Inventory Usage</h2><SimpleTable rows={data.inventory} columns={[{key:'rowId', label:'Row'},{key:'transactionDate', label:'Date', render:r=>date(r.transactionDate)},{key:'jobId', label:'Job'},{key:'costCode', label:'Cost Code'},{key:'amount', label:'Amount', render:r=>money(r.amount), align:'right'},{key:'description', label:'Description'}]} /></div> : null}
  </EnterpriseWorkspace></div></AppShell>;
}
