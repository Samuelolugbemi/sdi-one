import { buildCompanyContext, generateDeterministicAnswer } from '@/lib/ai-data-context';

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export async function ExecutiveBriefingLive() {
  const ctx = await buildCompanyContext();
  const briefing = generateDeterministicAnswer('Summarize the imported SDI data for executives.', ctx);
  const cards = [
    ['Customers', ctx.executive.customers],
    ['Jobs', ctx.executive.jobs],
    ['Vendors', ctx.executive.vendors],
    ['Equipment', ctx.executive.equipment],
    ['Invoice Total', money(ctx.invoiceSummary.totalAmount)],
    ['Inventory Cost', money(ctx.executive.inventoryTotal)],
  ];
  return <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
      {cards.map(([label, value]) => <div key={label} className="card p-5"><div className="section-title">{label}</div><div className="mt-2 text-3xl font-black text-slate-950">{value}</div></div>)}
    </div>
    <div className="card p-6">
      <div className="section-title">AI Executive Briefing</div>
      <h2 className="mt-1 text-2xl font-black">Today’s operational briefing</h2>
      <p className="mt-4 rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm font-semibold leading-7 text-slate-800">{briefing}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {ctx.riskyJobs.slice(0, 4).map(job => <div key={job.jobId} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">{job.jobId}</div><div className="mt-1 text-sm text-slate-500">Visible cost: {money(job.total)}</div><div className="mt-2 badge badge-yellow">Review job cost</div></div>)}
      </div>
    </div>
  </div>;
}
