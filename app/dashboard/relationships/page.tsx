import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { RelationshipGraphTable } from '@/components/ui/RelationshipGraphTable';
import { WorkspaceTabs } from '@/components/ui/WorkspacePanel';
import { getRelationshipGraph } from '@/lib/relationship-engine';

export default async function RelationshipsPage({ searchParams }: { searchParams?: { entity?: string; key?: string } }) {
  const edges = await getRelationshipGraph(searchParams?.entity, searchParams?.key);
  const scoped = searchParams?.entity && searchParams?.key;
  return <AppShell><PageHeader eyebrow="Relationship Engine" title={scoped ? `Relationship Graph: ${searchParams!.entity} ${searchParams!.key}` : 'Universal Relationship Graph'} description="Records are connected through metadata rules and derived SDI business logic so users can walk from customers to jobs, invoices, inventory, vendors, equipment, and documents." />
    <WorkspaceTabs tabs={['Entity Graph','Relationship Rules','Data Quality','Future Visual Graph']} />
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card p-5"><div className="text-sm font-black text-slate-500">Relationships</div><div className="mt-2 text-3xl font-black">{edges.length}</div><div className="mt-2 text-xs font-semibold text-slate-500">Direct and derived edges</div></div>
      <div className="card p-5"><div className="text-sm font-black text-slate-500">Engine Mode</div><div className="mt-2 text-3xl font-black">Metadata</div><div className="mt-2 text-xs font-semibold text-slate-500">Rules first, custom code second</div></div>
      <div className="card p-5"><div className="text-sm font-black text-slate-500">Coverage</div><div className="mt-2 text-3xl font-black">SDI Core</div><div className="mt-2 text-xs font-semibold text-slate-500">Customers, jobs, vendors, invoices, assets</div></div>
    </div>
    <div className="mt-6"><RelationshipGraphTable edges={edges} /></div>
  </AppShell>;
}
