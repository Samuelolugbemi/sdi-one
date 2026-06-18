import type React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { ExportButton } from '@/components/ui/ExportButton';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { getExecutiveMetrics, revenueByJob, spendByVendor } from '@/lib/queries';
import { money, num, date } from '@/lib/format';
import { Activity, ArrowUpRight, Database, Sparkles } from 'lucide-react';

export default async function ExecutivePage() {
  const metrics = await getExecutiveMetrics();
  const topJobs = await revenueByJob(8);
  const topVendors = await spendByVendor(8);
  const lastImport = metrics.imports[0];
  const avgInvoice = metrics.invoiceCount ? metrics.invoiceTotal / metrics.invoiceCount : 0;
  return <AppShell>
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300">
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-100 ring-1 ring-white/10"><Sparkles className="h-3.5 w-3.5" /> SDI Command Center</div>
          <h1 className="text-4xl font-black tracking-tight lg:text-5xl">Executive Overview</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">Company-wide operating snapshot from imported Intacct exports. Every number below is calculated from the PostgreSQL reporting database.</p>
        </div>
        <ExportButton dataset="executive" />
      </div>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard href="/dashboard/customers" label="Customers" value={num(metrics.customers)} sub="Imported customer master" tone="blue" />
      <KpiCard href="/dashboard/jobs" label="Jobs" value={num(metrics.jobs)} sub="Previously Projects" tone="green" />
      <KpiCard href="/dashboard/invoices" label="Invoice Total" value={money(metrics.invoiceTotal)} sub={`${num(metrics.invoiceCount)} invoices`} tone="blue" />
      <KpiCard href="/dashboard/invoices" label="Average Invoice" value={money(avgInvoice)} sub="Invoice total / invoice count" tone="slate" />
      <KpiCard href="/dashboard/vendors" label="Vendors" value={num(metrics.vendors)} sub="Imported vendor master" tone="amber" />
      <KpiCard href="/dashboard/equipment" label="Equipment" value={num(metrics.equipment)} sub="Asset register" tone="green" />
      <KpiCard href="/dashboard/inventory" label="Inventory Usage" value={money(metrics.inventoryTotal)} sub={`${num(metrics.inventoryCount)} inventory rows`} tone="amber" />
      <KpiCard href="/dashboard/integrations" label="Last Import" value={lastImport ? lastImport.status : 'None'} sub={lastImport ? date(lastImport.finishedAt ?? lastImport.startedAt) : 'Awaiting data'} tone={lastImport?.status === 'Success' ? 'green' : 'slate'} />
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
      <div className="grid gap-6 xl:grid-cols-2">
        <BarChartCard title="Top Jobs by Invoice Line Amount" data={topJobs.map(j => ({ name: j.jobId, amount: j.amount }))} xKey="name" yKey="amount" />
        <BarChartCard title="Top Vendors by Invoice Amount" data={topVendors.map(v => ({ name: v.vendor?.name ?? v.vendorId, amount: v.amount }))} xKey="name" yKey="amount" />
      </div>
      <div className="card p-6">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Activity className="h-5 w-5" /></div><div><div className="section-title">Automated insights</div><h2 className="text-lg font-black">What deserves attention</h2></div></div>
        <div className="mt-5 space-y-3">
          <Insight icon={<ArrowUpRight className="h-4 w-4" />} title="Top job concentration" text={topJobs[0] ? `${topJobs[0].jobId} leads imported invoice-line amount at ${money(topJobs[0].amount)}.` : 'Import invoice lines to calculate top job concentration.'} />
          <Insight icon={<Database className="h-4 w-4" />} title="Data freshness" text={lastImport ? `Most recent import: ${lastImport.source} on ${date(lastImport.finishedAt ?? lastImport.startedAt)}.` : 'No imports found yet.'} />
          <Insight icon={<Sparkles className="h-4 w-4" />} title="Next enrichment" text="This foundation is ready for Salesforce, Ford Pro, Monday.com, fuel, and POR connectors without rebuilding the UI." />
        </div>
      </div>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <SimpleTable rows={topJobs} columns={[{key:'jobId', label:'Job', render:r=><RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>},{key:'description', label:'Description', render:r=>r.job?.description ?? '—'},{key:'amount', label:'Amount', align:'right', render:r=>money(r.amount)}]} />
      <SimpleTable rows={topVendors} columns={[{key:'vendorId', label:'Vendor', render:r=><RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendor?.name ?? r.vendorId}</RecordLink>},{key:'count', label:'Invoices', align:'right'},{key:'amount', label:'Amount', align:'right', render:r=>money(r.amount)}]} />
    </div>
  </AppShell>;
}

function Insight({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex gap-3"><div className="mt-0.5 text-blue-700">{icon}</div><div><div className="text-sm font-black text-slate-900">{title}</div><p className="mt-1 text-sm leading-5 text-slate-600">{text}</p></div></div>
  </div>;
}
