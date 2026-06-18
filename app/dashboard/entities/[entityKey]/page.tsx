import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetadataBadge } from '@/components/ui/MetadataBadge';
import { MetadataTable } from '@/components/ui/MetadataTable';
import { WorkspacePanel, WorkspaceTabs } from '@/components/ui/WorkspacePanel';
import { getRegisteredEntity } from '@/lib/entity-engine';

export default async function EntityMetadataPage({ params }: { params: { entityKey: string } }) {
  const entity = await getRegisteredEntity(params.entityKey);
  if (!entity) notFound();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Entity Metadata"
        title={entity.displayName}
        description={entity.description ?? undefined}
        action={<Link className="btn-primary" href={`/dashboard/entities/${entity.key}/workspace`}>Preview Workspace</Link>}
      />

      <WorkspaceTabs tabs={['Definition', 'Fields', 'Capabilities', 'Workspace', 'Relationships', 'Permissions']} />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <WorkspacePanel title="Field Definitions" eyebrow="Data Contract">
            <MetadataTable
              columns={['Field', 'Label', 'CSV Source', 'Type', 'Behavior']}
              rows={entity.fields.map(field => [
                <span className="font-black text-slate-950" key="key">{field.key}</span>,
                field.label,
                field.sourceColumn || '—',
                field.fieldType,
                <div className="flex flex-wrap gap-2" key="behavior">
                  {field.isPrimary && <MetadataBadge tone="blue">primary</MetadataBadge>}
                  {field.isSearchable && <MetadataBadge tone="green">search</MetadataBadge>}
                  {field.isFilterable && <MetadataBadge tone="indigo">filter</MetadataBadge>}
                  {field.isSortable && <MetadataBadge tone="amber">sort</MetadataBadge>}
                  {field.required && <MetadataBadge tone="slate">required</MetadataBadge>}
                </div>,
              ])}
            />
          </WorkspacePanel>

          <WorkspacePanel title="Relationship Rules" eyebrow="Graph Metadata">
            <MetadataTable
              columns={['Direction', 'Relationship', 'Field Match', 'Cardinality']}
              rows={[
                ...entity.relationshipRulesSource.map(rule => [
                  <MetadataBadge tone="blue" key="direction">outbound</MetadataBadge>,
                  <div key="rel"><div className="font-black text-slate-950">{rule.label}</div><div className="text-xs text-slate-500">to {rule.targetEntityType.displayName}</div></div>,
                  `${rule.sourceField} → ${rule.targetField}`,
                  rule.cardinality,
                ]),
                ...entity.relationshipRulesTarget.map(rule => [
                  <MetadataBadge tone="green" key="direction">inbound</MetadataBadge>,
                  <div key="rel"><div className="font-black text-slate-950">{rule.inverseLabel ?? rule.label}</div><div className="text-xs text-slate-500">from {rule.sourceEntityType.displayName}</div></div>,
                  `${rule.sourceField} → ${rule.targetField}`,
                  rule.cardinality,
                ]),
              ]}
            />
          </WorkspacePanel>
        </div>

        <div className="space-y-6">
          <WorkspacePanel title="Platform Capabilities" eyebrow="Capability Engine">
            <div className="space-y-3">
              {entity.capabilities.map(capability => <div key={capability.key} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><div className="font-black text-slate-950">{capability.label}</div><MetadataBadge tone="green">{capability.status}</MetadataBadge></div>{capability.description && <p className="mt-2 text-sm leading-6 text-slate-600">{capability.description}</p>}</div>)}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Workspace Sections" eyebrow="Workspace Engine">
            <div className="space-y-3">
              {entity.workspaceSections.map(section => <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="font-black text-slate-950">{section.label}</div><p className="mt-1 text-sm leading-6 text-slate-600">{section.description}</p></div>)}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Permission Templates" eyebrow="Security Metadata">
            <div className="space-y-3">
              {entity.permissionTemplates.map(permission => <div key={permission.action} className="rounded-2xl bg-slate-50 p-4"><div className="font-black text-slate-950">{permission.label}</div><div className="mt-1 text-xs font-bold text-slate-500">{permission.key}</div></div>)}
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </AppShell>
  );
}
