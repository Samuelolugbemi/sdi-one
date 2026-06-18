import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { PageHeader } from '../../../components/ui/PageHeader';
import { KpiCard } from '../../../components/ui/KpiCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default async function IntegrationPlatformPage() {
  const [connectors, runs, logs] = await Promise.all([
    prisma.integrationConnector.findMany({ include: { mappings: true, runs: true }, orderBy: { category: 'asc' }}),
    prisma.integrationRun.findMany({ orderBy: { startedAt: 'desc' }, take: 8, include: { connector: true } }),
    prisma.integrationLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { connector: true } }),
  ]);
  return <>
    <PageHeader title="Enterprise Integration Platform" description="Milestone 8 establishes reusable connector architecture: authentication, mapping, transformation, scheduling, retry, monitoring, and logs." />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Connectors" value={String(connectors.length)} sub="Sage, Salesforce, POR, Geotab, Ford, Fuel, Monday" tone="blue" />
      <KpiCard label="Enabled" value={String(connectors.filter(c=>c.enabled).length)} sub="Ready or active" tone="green" />
      <KpiCard label="Mappings" value={String(connectors.reduce((a,c)=>a+c.mappings.length,0))} sub="Field maps" tone="slate" />
      <KpiCard label="Recent Runs" value={String(runs.length)} sub="Sync monitoring" tone="amber" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <div className="grid gap-4 md:grid-cols-2">
        {connectors.map(c => <Link href={`/dashboard/integration-platform/connectors/${c.key}`} key={c.key} className="card card-hover p-5">
          <div className="flex items-start justify-between gap-3"><div><div className="section-title">{c.category}</div><h2 className="mt-1 text-xl font-black">{c.name}</h2></div><StatusBadge value={c.status} /></div>
          <p className="mt-3 text-sm leading-6 text-slate-500">{c.description}</p>
          <div className="mt-4 flex gap-2"><span className="badge badge-blue">{c.authType ?? 'Auth TBD'}</span><span className="badge badge-slate">{c.mappings.length} mappings</span></div>
        </Link>)}
      </div>
      <div className="space-y-6">
        <div className="card p-5"><div className="section-title">Recent Runs</div><div className="mt-3 space-y-3">{runs.map(r => <div key={r.id} className="rounded-2xl border border-slate-200 p-3"><div className="font-black">{r.connector.name}</div><div className="text-sm text-slate-500">{r.status} · {r.runType}</div></div>)}</div></div>
        <div className="card p-5"><div className="section-title">Integration Logs</div><div className="mt-3 space-y-3">{logs.map(l => <div key={l.id} className="rounded-2xl border border-slate-200 p-3"><div className="font-black">{l.level}</div><div className="text-sm text-slate-500">{l.message}</div></div>)}</div></div>
      </div>
    </div>
  </>;
}
