import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { WorkspacePanel } from '@/components/ui/WorkspacePanel';
import { prisma } from '@/lib/prisma';
import { num } from '@/lib/format';

export default async function PlatformCorePage() {
  const [entities, fields, relationships, timeline, docs, workflows, permissions, search] = await Promise.all([
    prisma.entityType.count().catch(() => 0),
    prisma.entityField.count().catch(() => 0),
    prisma.entityRelationship.count().catch(() => 0),
    prisma.timelineEvent.count().catch(() => 0),
    prisma.documentRecord.count().catch(() => 0),
    prisma.workflowDefinition.count().catch(() => 0),
    prisma.permission.count().catch(() => 0),
    prisma.searchIndex.count().catch(() => 0),
  ]);
  const engines = [
    ['Entity Engine', entities, 'Registered metadata-driven business objects'],
    ['Field Metadata', fields, 'Searchable, list, detail and filter definitions'],
    ['Relationship Engine', relationships, 'Connected entity graph records'],
    ['Timeline Engine', timeline, 'Chronological business events'],
    ['Document Engine', docs, 'Entity-attached document records'],
    ['Workflow Engine', workflows, 'Reusable business process definitions'],
    ['Permission Engine', permissions, 'Role/action policy definitions'],
    ['Search Engine', search, 'Universal search index records'],
  ];
  return <AppShell><PageHeader eyebrow="Milestone 1" title="Enterprise Platform Core" description="Shared services that every SDI One module inherits: identity, permissions, metadata, relationships, timeline, documents, workflows, audit, notifications and search." />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{engines.map(([label, value, desc]) => <KpiCard key={String(label)} label={String(label)} value={num(Number(value))} detail={String(desc)} />)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><WorkspacePanel title="Platform Contract" eyebrow="Architecture"><ul className="space-y-2 text-sm font-semibold text-slate-600"><li>• Every module is represented as an EntityType.</li><li>• Every entity can inherit relationships, timeline, documents, workflow, search and permissions.</li><li>• Business modules are now extensions of the platform, not isolated pages.</li></ul></WorkspacePanel><WorkspacePanel title="Production Readiness" eyebrow="What remains"><ul className="space-y-2 text-sm font-semibold text-slate-600"><li>• Replace local/demo auth with Microsoft Entra ID when ready.</li><li>• Add background workers for scheduled connectors.</li><li>• Add automated test coverage and deployment pipelines.</li></ul></WorkspacePanel></div>
  </AppShell>;
}
