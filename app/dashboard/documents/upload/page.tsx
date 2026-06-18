import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';

export default function UploadDocumentPage() {
  return <AppShell>
    <PageHeader eyebrow="Document Engine" title="Upload Document" description="Attach a file to a customer, job, invoice, equipment asset, vendor or other platform entity." />
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <DocumentUploadForm />
      <div className="card p-6">
        <div className="section-title mb-3">Upload Rules</div>
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          <li><strong>Entity Type</strong> controls where the document appears.</li>
          <li><strong>Entity Key</strong> should match SDI identifiers such as job numbers, customer IDs or equipment IDs.</li>
          <li>Every upload creates a timeline event and access audit trail.</li>
          <li>Storage is local for development and MinIO-ready for production.</li>
        </ul>
      </div>
    </div>
  </AppShell>;
}
