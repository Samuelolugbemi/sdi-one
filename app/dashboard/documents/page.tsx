import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { MetadataStat } from '@/components/ui/MetadataStat';
import { DocumentList } from '@/components/documents/DocumentList';
import { getDocumentStats, getRecentDocuments, documentEntityTypes } from '@/lib/document-engine';

export default async function DocumentsPage() {
  const [stats, documents] = await Promise.all([getDocumentStats(), getRecentDocuments(75)]);

  return <AppShell>
    <PageHeader eyebrow="Document Engine" title="Document Center" description="Upload, attach, audit and retrieve PDFs, photos, receipts, drawings, contracts and supporting files across every SDI One workspace." actions={<Link href="/dashboard/documents/upload" className="btn-primary">Upload Document</Link>} />

    <div className="grid gap-5 md:grid-cols-3 mb-6">
      <KpiCard label="Documents" value={stats.total.toLocaleString()} helper="All attached files" />
      <KpiCard label="Active" value={stats.active.toLocaleString()} helper="Available to users" />
      <KpiCard label="Deleted" value={stats.deleted.toLocaleString()} helper="Soft-deleted records" />
    </div>

    <div className="grid gap-5 lg:grid-cols-3 mb-6">
      <div className="card p-6 lg:col-span-2">
        <div className="section-title mb-4">Document Workspaces</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documentEntityTypes.map(type => <Link href={`/dashboard/documents?entityType=${type.key}`} key={type.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50">
            <div className="font-black text-slate-900">{type.label}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{type.description}</p>
          </Link>)}
        </div>
      </div>
      <div className="card p-6">
        <div className="section-title mb-4">Document Coverage</div>
        <div className="space-y-3">
          {stats.byEntity.map(row => <MetadataStat key={row.entityType} label={row.entityType} value={row._count.id.toLocaleString()} />)}
        </div>
      </div>
    </div>

    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-black text-slate-950">Recent Documents</h2>
      <Link href="/dashboard/documents/upload" className="text-sm font-black text-blue-700 hover:underline">Attach a file</Link>
    </div>
    <DocumentList documents={documents} />
  </AppShell>;
}
