import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { ExportButton } from '@/components/ui/ExportButton';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { getExecutiveMetrics, revenueByJob, spendByVendor } from '@/lib/queries';
import { money, num } from '@/lib/format';

export default async function FinancialPage() {
  const metrics = await getExecutiveMetrics();
  const topJobs = await revenueByJob(15);
  const topVendors = await spendByVendor(15);
  return <AppShell><PageHeader title="Financial Analytics" description="Invoice, vendor spend, inventory, and job-cost signals from imported Intacct records." actions={<ExportButton dataset="financial" />} />
    <div className="grid gap-4 md:grid-cols-4"><KpiCard href="/dashboard/invoices" label="Invoices" value={num(metrics.invoiceCount)} tone="blue" /><KpiCard href="/dashboard/invoices" label="Invoice Total" value={money(metrics.invoiceTotal)} tone="green" /><KpiCard href="/dashboard/invoices" label="Invoice Lines" value={num(metrics.invoiceLineCount)} tone="slate" /><KpiCard href="/dashboard/inventory" label="Inventory Cost" value={money(metrics.inventoryTotal)} tone="amber" /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><BarChartCard title="Top Jobs by Line Amount" data={topJobs.slice(0, 10).map(j => ({ name: j.jobId, amount: j.amount }))} xKey="name" yKey="amount" /><BarChartCard title="Top Vendors by Invoice Amount" data={topVendors.slice(0, 10).map(v => ({ name: v.vendor?.name ?? v.vendorId, amount: v.amount }))} xKey="name" yKey="amount" /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><SimpleTable rows={topJobs} columns={[{key:'jobId', label:'Job', render:r=><RecordLink href={`/dashboard/jobs/${r.jobId}`}>{r.jobId}</RecordLink>},{key:'description', label:'Description', render:r=>r.job?.description ?? '—'},{key:'amount', label:'Line Amount', align:'right', render:r=>money(r.amount)}]} /><SimpleTable rows={topVendors} columns={[{key:'vendorId', label:'Vendor', render:r=><RecordLink href={`/dashboard/vendors/${r.vendorId}`}>{r.vendor?.name ?? r.vendorId}</RecordLink>},{key:'count', label:'Invoices', align:'right'},{key:'amount', label:'Invoice Amount', align:'right', render:r=>money(r.amount)}]} /></div>
  </AppShell>;
}
