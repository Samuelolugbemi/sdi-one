import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { MetadataStat } from '@/components/ui/MetadataStat';
import { TimelineList } from '@/components/ui/TimelineList';
import { formatBytes } from '@/components/documents/DocumentList';

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const document = await prisma.documentRecord.findUnique({
    where: { id },
    include: { versions: true, shares: true, accessEvents: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
  if (!document) notFound();

  return <AppShell>
    <PageHeader eyebrow="Document Workspace" title={document.originalName || document.fileName} description={document.description || 'Attached SDI One document.'} actions={<a href={`/api/documents/${document.id}/download`} className="btn-primary">Download</a>} />

    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="card p-6">
          <div className="section-title mb-4">Document Details</div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetadataStat label="Entity" value={`${document.entityType}: ${document.entityKey}`} />
            <MetadataStat label="Category" value={document.category || 'Other'} />
            <MetadataStat label="Size" value={formatBytes(document.sizeBytes)} />
            <MetadataStat label="Status" value={document.status} />
            <MetadataStat label="Version" value={`v${document.version}`} />
            <MetadataStat label="Uploaded By" value={document.uploadedBy || 'Unknown'} />
          </div>
        </div>

        <div className="card p-6">
          <div className="section-title mb-4">Versions</div>
          <div className="space-y-3">{document.versions.map(v => <div key={v.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">Version {v.version}</div><div className="text-sm text-slate-600">{v.fileName} · {formatBytes(v.sizeBytes)}</div></div>)}</div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="card p-6">
          <div className="section-title mb-3">Related Workspace</div>
          <Link href={`/dashboard/workspaces/${document.entityType}/${document.entityKey}/documents`} className="font-black text-blue-700 hover:underline">Open related document workspace</Link>
        </div>
        <div className="card p-6">
          <div className="section-title mb-4">Access Audit</div>
          <TimelineList events={document.accessEvents.map(e => ({ id: e.id, title: e.eventType, description: e.actor || 'System', occurredAt: e.createdAt, source: 'Document Engine' }))} />
        </div>
      </div>
    </div>
  </AppShell>;
}
