import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { ExecutiveMetric, MissionControlGrid, CommandPanel } from '@/components/ui/MissionControlGrid';
import { KpiCard } from '@/components/ui/KpiCard';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { getMissionControlSnapshot } from '@/lib/mission-control';
import { money, num, date } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export default async function CommandCenterPage() {
  const snapshot = await getMissionControlSnapshot();
  const jobs = await prisma.job.findMany({ orderBy: { importedAt: 'desc' }, take: 8, include: { customer: true } });
  const invoices = await prisma.invoice.findMany({ orderBy: { invoiceDate: 'desc' }, take: 8, include: { vendor: true } });
  return <AppShell>
    <PageHeader eyebrow="Milestone 3" title="Mission Control" description="Executive operating center combining finance, jobs, assets, approvals, alerts, imports and AI-ready recommendations." />
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ExecutiveMetric label="Known Cost" value={money(snapshot.financials.totalKnownCost)} detail="Invoice lines + inventory usage" tone="blue" />
      <ExecutiveMetric label="AP Spend" value={money(snapshot.financials.apSpend)} detail={`${num(snapshot.counts.invoices)} AP bills`} tone="green" />
      <ExecutiveMetric label="Jobs" value={num(snapshot.counts.jobs)} detail="Imported operational jobs" tone="slate" />
      <ExecutiveMetric label="Assets" value={num(snapshot.counts.equipment)} detail="Equipment and fleet assets" tone="amber" />
    </div>
    <MissionControlGrid>
      <CommandPanel title="AI Executive Briefing" eyebrow="Operational Intelligence" span="lg:col-span-7"><div className="space-y-3">{snapshot.briefing.map((line, i) => <p key={i} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-700">{line}</p>)}</div></CommandPanel>
      <CommandPanel title="Critical Work Queue" eyebrow="Alerts & Approvals" span="lg:col-span-5"><div className="grid gap-3"><KpiCard label="Open Alerts" value={num(snapshot.openAlerts.length)} /><KpiCard label="Pending Approvals" value={num(snapshot.pendingApprovals.length)} /><KpiCard label="Open Work Items" value={num(snapshot.workItems.length)} /></div></CommandPanel>
      <CommandPanel title="Recently Imported Jobs" eyebrow="Live Operations" span="lg:col-span-6"><SimpleTable rows={jobs} columns={[{key:'jobId', label:'Job', render:r=><RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>},{key:'status', label:'Status'},{key:'customerId', label:'Customer', render:r=>r.customerId ? <RecordLink href={`/dashboard/customers/${r.customerId}`}>{r.customer?.name ?? r.customerId}</RecordLink> : '—'}]} /></CommandPanel>
      <CommandPanel title="Latest AP Bills" eyebrow="Financial Pulse" span="lg:col-span-6"><SimpleTable rows={invoices} columns={[{key:'sageId', label:'Sage ID', render:r=><RecordLink href={`/dashboard/invoices/${r.sageId}`}>{r.sageId}</RecordLink>},{key:'invoiceDate', label:'Date', render:r=>date(r.invoiceDate)},{key:'vendorId', label:'Vendor', render:r=>r.vendorId ? <RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendor?.name ?? r.vendorId}</RecordLink> : '—'},{key:'amount', label:'Amount', render:r=>money(r.amount), align:'right'}]} /></CommandPanel>
    </MissionControlGrid>
  </AppShell>;
}
