import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { entityDefinitions } from '@/lib/entity-definitions';

export default function WorkspacesPage() {
  return <AppShell><PageHeader eyebrow="Workspace Engine" title="Enterprise Workspaces" description="Every major business object gets a consistent workspace: overview, relationships, timeline, documents, analytics, and AI context." />
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{entityDefinitions.map(entity => <Link key={entity.key} href={`/dashboard/entities/${entity.key}`} className="card card-hover p-6"><div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{entity.domain}</div><div className="mt-2 text-2xl font-black text-slate-950">{entity.pluralName}</div><p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{entity.description}</p><div className="mt-4 flex flex-wrap gap-2">{entity.workspaceSections?.slice(0,5).map(s => <span key={s.key} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-black text-indigo-700">{s.label}</span>)}</div></Link>)}</div>
  </AppShell>;
}
