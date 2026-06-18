import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetadataBadge } from '@/components/ui/MetadataBadge';
import { MetadataTable } from '@/components/ui/MetadataTable';
import { getRegisteredEntities } from '@/lib/entity-engine';

export default async function EntityEngineAdminPage() {
  const entities = await getRegisteredEntities();
  return (
    <AppShell>
      <PageHeader
        eyebrow="Admin Center"
        title="Metadata Entity Engine"
        description="Manage the metadata layer that turns imported business records into SDI One platform entities. This is the foundation for future custom modules, generic workspaces, permissions, timeline, relationships, search, documents, and AI context."
      />
      <div className="mb-6 rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <div className="text-xl font-black text-blue-950">Entity Engine v0.3 is active</div>
        <p className="mt-2 max-w-4xl leading-7 text-blue-800">Customers, Jobs, Vendors, Invoices, Invoice Lines, Equipment, and Inventory Transactions are now registered as metadata entities. Future modules can be added by registering metadata instead of manually duplicating platform capabilities.</p>
      </div>
      <MetadataTable
        columns={['Entity', 'Domain', 'Fields', 'Capabilities', 'Workspace', 'Relationships', 'Action']}
        rows={entities.map(entity => [
          <div key="entity"><div className="font-black text-slate-950">{entity.displayName}</div><div className="text-xs font-bold text-slate-500">{entity.key}</div></div>,
          <MetadataBadge key="domain" tone="blue">{entity.domain}</MetadataBadge>,
          entity.fields.length,
          entity.capabilities.length,
          entity.workspaceSections.length,
          entity.relationshipRulesSource.length + entity.relationshipRulesTarget.length,
          <Link key="action" className="font-black text-blue-700 hover:text-blue-900" href={`/dashboard/entities/${entity.key}`}>Open metadata</Link>,
        ])}
      />
    </AppShell>
  );
}
