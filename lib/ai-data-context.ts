import { prisma } from '@/lib/prisma';
import { spendByVendor, revenueByJob, getExecutiveMetrics } from '@/lib/queries';

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export type AiContext = {
  executive: Awaited<ReturnType<typeof getExecutiveMetrics>>;
  topJobs: Awaited<ReturnType<typeof revenueByJob>>;
  topVendors: Awaited<ReturnType<typeof spendByVendor>>;
  recentImports: { source: string; rowsImported: number; rowsFailed: number; status: string; startedAt: Date }[];
  riskyJobs: { jobId: string; description: string | null; status: string | null; cost: number; inventory: number; total: number }[];
  equipmentSummary: { total: number; active: number; inactive: number; repair: number; rented: number };
  invoiceSummary: { totalAmount: number; count: number; largest: { sageId: string; vendorId: string | null; amount: number; description: string | null }[] };
};

export async function buildCompanyContext(): Promise<AiContext> {
  const [executive, topJobs, topVendors, recentImports, equipmentRows, invoiceAgg, largestInvoices, jobCostRows] = await Promise.all([
    getExecutiveMetrics(),
    revenueByJob(8),
    spendByVendor(8),
    prisma.importRun.findMany({ orderBy: { startedAt: 'desc' }, take: 8, select: { source: true, rowsImported: true, rowsFailed: true, status: true, startedAt: true } }),
    prisma.equipment.findMany({ select: { status: true } }),
    prisma.invoice.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.invoice.findMany({ orderBy: { amount: 'desc' }, take: 5, select: { sageId: true, vendorId: true, amount: true, description: true } }),
    prisma.invoiceLine.groupBy({ by: ['jobId'], _sum: { amount: true }, where: { jobId: { not: null } }, orderBy: { _sum: { amount: 'desc' } }, take: 8 })
  ]);

  const jobIds = jobCostRows.map(j => j.jobId!).filter(Boolean);
  const jobs = await prisma.job.findMany({ where: { jobId: { in: jobIds } }, select: { jobId: true, description: true, status: true } });
  const inventoryCosts = await prisma.inventoryTransaction.groupBy({ by: ['jobId'], _sum: { amount: true }, where: { jobId: { in: jobIds } } });
  const invMap = new Map(inventoryCosts.map(x => [x.jobId, Number(x._sum.amount ?? 0)]));
  const jobMap = new Map(jobs.map(j => [j.jobId, j]));

  const status = (s?: string | null) => (s || '').toLowerCase();
  const equipmentSummary = {
    total: equipmentRows.length,
    active: equipmentRows.filter(e => status(e.status).includes('active')).length,
    inactive: equipmentRows.filter(e => status(e.status).includes('inactive')).length,
    repair: equipmentRows.filter(e => status(e.status).includes('repair')).length,
    rented: equipmentRows.filter(e => status(e.status).includes('rented')).length,
  };

  return {
    executive,
    topJobs,
    topVendors,
    recentImports,
    riskyJobs: jobCostRows.map(row => {
      const cost = Number(row._sum.amount ?? 0);
      const inventory = invMap.get(row.jobId) ?? 0;
      const job = jobMap.get(row.jobId!);
      return { jobId: row.jobId!, description: job?.description ?? null, status: job?.status ?? null, cost, inventory, total: cost + inventory };
    }),
    equipmentSummary,
    invoiceSummary: {
      totalAmount: Number(invoiceAgg._sum.amount ?? 0),
      count: invoiceAgg._count,
      largest: largestInvoices.map(i => ({ sageId: i.sageId, vendorId: i.vendorId, amount: Number(i.amount ?? 0), description: i.description }))
    }
  };
}

export function summarizeContextForPrompt(ctx: AiContext) {
  return [
    `Executive metrics: ${ctx.executive.customers} customers, ${ctx.executive.jobs} jobs, ${ctx.executive.vendors} vendors, ${ctx.executive.equipment} equipment records.`,
    `Invoices: ${ctx.invoiceSummary.count} invoices totaling ${money(ctx.invoiceSummary.totalAmount)}. Invoice lines total ${money(ctx.executive.lineTotal)}. Inventory cost total ${money(ctx.executive.inventoryTotal)}.`,
    `Equipment: ${ctx.equipmentSummary.total} total, ${ctx.equipmentSummary.active} active, ${ctx.equipmentSummary.inactive} inactive, ${ctx.equipmentSummary.repair} in repair, ${ctx.equipmentSummary.rented} rented.`,
    `Top jobs by cost: ${ctx.riskyJobs.map(j => `${j.jobId} (${money(j.total)})`).join(', ') || 'none'}.`,
    `Top vendors by spend: ${ctx.topVendors.map(v => `${v.vendor?.name ?? v.vendorId} (${money(v.amount)})`).join(', ') || 'none'}.`,
    `Recent imports: ${ctx.recentImports.map(i => `${i.source}: ${i.rowsImported} imported/${i.rowsFailed} failed`).join('; ') || 'none'}.`
  ].join('\n');
}

export function generateDeterministicAnswer(question: string, ctx: AiContext) {
  const q = question.toLowerCase();
  const risks: string[] = [];
  if (ctx.executive.inventoryTotal > 0) risks.push(`Inventory costs are material at ${money(ctx.executive.inventoryTotal)} and should be shown separately from AP/vendor spend in job profitability.`);
  if (ctx.equipmentSummary.repair > 0) risks.push(`${ctx.equipmentSummary.repair} equipment records are marked repair and should be reviewed for utilization and cost impact.`);
  const failedImports = ctx.recentImports.filter(i => i.rowsFailed > 0);
  if (failedImports.length) risks.push(`Some recent imports had failures: ${failedImports.map(i => `${i.source} (${i.rowsFailed})`).join(', ')}.`);

  if (q.includes('vendor')) {
    return `Vendor spend is concentrated among ${ctx.topVendors.slice(0, 3).map(v => v.vendor?.name ?? v.vendorId).join(', ')}. The highest visible vendor spend is ${ctx.topVendors[0]?.vendor?.name ?? ctx.topVendors[0]?.vendorId ?? 'not available'} at ${money(ctx.topVendors[0]?.amount ?? 0)}. Recommended action: review top vendor invoice lines by job and cost code before approving additional spend.`;
  }
  if (q.includes('equipment') || q.includes('asset')) {
    return `Equipment health summary: ${ctx.equipmentSummary.total} assets loaded, ${ctx.equipmentSummary.active} active, ${ctx.equipmentSummary.repair} in repair, and ${ctx.equipmentSummary.rented} rented. Recommended action: connect POR/Ford/Fuel next so SDI One can calculate utilization, revenue, repair cost, and true equipment profitability.`;
  }
  if (q.includes('job') || q.includes('over budget') || q.includes('cost')) {
    return `The jobs currently carrying the largest visible costs are ${ctx.riskyJobs.slice(0, 5).map(j => `${j.jobId} at ${money(j.total)}`).join(', ')}. These totals combine AP invoice line cost and inventory cost where available. Recommended action: open the Job Workspace, review invoice lines by cost code, then compare inventory usage against expected production.`;
  }
  if (q.includes('invoice')) {
    return `There are ${ctx.invoiceSummary.count} invoices totaling ${money(ctx.invoiceSummary.totalAmount)}. The largest visible invoices include ${ctx.invoiceSummary.largest.slice(0, 3).map(i => `${i.sageId} (${money(i.amount)})`).join(', ')}. Recommended action: prioritize invoice review by amount, vendor, job, and supporting documents.`;
  }

  return `SDI One sees ${ctx.executive.customers} customers, ${ctx.executive.jobs} jobs, ${ctx.executive.vendors} vendors, ${ctx.executive.equipment} equipment records, ${ctx.executive.invoiceCount} invoices, ${ctx.executive.invoiceLineCount} invoice lines, and ${ctx.executive.inventoryCount} inventory transactions. ${risks.length ? `Key risks: ${risks.join(' ')}` : 'No major system risk is visible from the current imported data.'} Recommended action: continue strengthening job, equipment, and invoice workspaces, then connect Sage/POR/Fuel/Ford data for live operational intelligence.`;
}
