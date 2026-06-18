import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetadataBadge } from '@/components/ui/MetadataBadge';
import { MetadataStat } from '@/components/ui/MetadataStat';
import { getEntityRecordCount, getEntityStats, getRegisteredEntities } from '@/lib/entity-engine';

export default async function EntityRegistryPage() {
  const [entities, stats] = await Promise.all([getRegisteredEntities(), getEntityStats()]);
  const relationshipRuleCount = entities.reduce((sum, entity) => sum + entity.relationshipRulesSource.length, 0);
  const fieldCount = entities.reduce((sum, entity) => sum + entity.fields.length, 0);
  const capabilityCount = entities.reduce((sum, entity) => sum + entity.capabilities.length, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Metadata Entity Engine"
        title="Entity Registry"
        description="The registry is the SDI One metadata layer. It defines what each business object is, where it lives, how it searches, what workspace sections it owns, which capabilities it exposes, and how it connects to other entities."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetadataStat label="Registered Entities" value={entities.length} help="Business objects known by SDI One." />
        <MetadataStat label="Metadata Fields" value={fieldCount} help="Fields driving lists, search, filters, and workspaces." />
        <MetadataStat label="Capabilities" value={capabilityCount} help="Business capabilities exposed to dashboards and AI." />
        <MetadataStat label="Relationship Rules" value={relationshipRuleCount} help="Rules powering the relationship graph." />
      </div>

      <section className="grid gap-5 xl:grid-cols-2">
        {entities.map(entity => {
          const count = getEntityRecordCount(stats, entity.key);
          return (
            <Link href={`/dashboard/entities/${entity.key}`} key={entity.key} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">{entity.domain}</div>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{entity.displayName}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{entity.description}</p>
                </div>
                <MetadataBadge tone="blue">{entity.key}</MetadataBadge>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-500">Records</div><div className="mt-1 text-2xl font-black text-slate-950">{count.toLocaleString()}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-500">Fields</div><div className="mt-1 text-2xl font-black text-slate-950">{entity.fields.length}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-500">Workspace</div><div className="mt-1 text-2xl font-black text-slate-950">{entity.workspaceSections.length}</div></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-500">Relations</div><div className="mt-1 text-2xl font-black text-slate-950">{entity.relationshipRulesSource.length + entity.relationshipRulesTarget.length}</div></div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {entity.capabilities.slice(0, 5).map(capability => <MetadataBadge key={capability.key} tone="green">{capability.label}</MetadataBadge>)}
              </div>
            </Link>
          );
        })}
      </section>
    </AppShell>
  );
}
