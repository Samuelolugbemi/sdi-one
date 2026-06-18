import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetadataBadge } from '@/components/ui/MetadataBadge';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';
import { getEntityRecordCount, getEntityStats, getRegisteredEntity } from '@/lib/entity-engine';

export default async function GenericWorkspacePreviewPage({ params }: { params: { entityKey: string } }) {
  const [entity, stats] = await Promise.all([getRegisteredEntity(params.entityKey), getEntityStats()]);
  if (!entity) notFound();
  const recordCount = getEntityRecordCount(stats, entity.key);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace Engine Preview"
        title={`${entity.displayName} Workspace`}
        description="This preview shows how SDI One can render a consistent workspace from metadata. The business-specific workspace pages still exist, but the platform now knows how to describe and assemble them generically."
      />

      <WorkspaceTabs tabs={entity.workspaceSections.map(section => section.label)} />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <WorkspacePanel title={`${entity.displayName} Overview`} eyebrow="Metadata Rendered">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-blue-50 p-5"><div className="text-xs font-black uppercase text-blue-700">Records</div><div className="mt-2 text-3xl font-black text-blue-950">{recordCount.toLocaleString()}</div></div>
              <div className="rounded-3xl bg-emerald-50 p-5"><div className="text-xs font-black uppercase text-emerald-700">Capabilities</div><div className="mt-2 text-3xl font-black text-emerald-950">{entity.capabilities.length}</div></div>
              <div className="rounded-3xl bg-indigo-50 p-5"><div className="text-xs font-black uppercase text-indigo-700">Sections</div><div className="mt-2 text-3xl font-black text-indigo-950">{entity.workspaceSections.length}</div></div>
            </div>
            <p className="mt-5 leading-7 text-slate-600">{entity.description}</p>
          </WorkspacePanel>

          {entity.workspaceSections.slice(1, 5).map(section => (
            <WorkspacePanel key={section.key} title={section.label} eyebrow={section.sectionType}>
              <p className="leading-7 text-slate-600">{section.description}</p>
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-500">Runtime widget slot: {entity.key}.{section.key}</div>
            </WorkspacePanel>
          ))}
        </div>

        <aside className="space-y-6">
          <WorkspacePanel title="Capabilities" eyebrow="Capability Engine">
            <div className="flex flex-wrap gap-2">
              {entity.capabilities.map(capability => <MetadataBadge key={capability.key} tone="green">{capability.label}</MetadataBadge>)}
            </div>
          </WorkspacePanel>
          <WorkspacePanel title="Search Fields" eyebrow="Search Metadata">
            <div className="flex flex-wrap gap-2">
              {entity.fields.filter(field => field.isSearchable).map(field => <MetadataBadge key={field.key} tone="blue">{field.label}</MetadataBadge>)}
            </div>
          </WorkspacePanel>
          <WorkspacePanel title="Relationship Rules" eyebrow="Graph Metadata">
            <div className="space-y-3">
              {[...entity.relationshipRulesSource, ...entity.relationshipRulesTarget].map(rule => <div key={rule.id} className="rounded-2xl bg-slate-50 p-4 text-sm"><div className="font-black text-slate-950">{rule.label}</div><div className="mt-1 text-slate-500">{rule.sourceField} → {rule.targetField}</div></div>)}
            </div>
          </WorkspacePanel>
        </aside>
      </div>
    </AppShell>
  );
}
