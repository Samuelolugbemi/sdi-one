import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { getEntityDocuments } from '@/lib/document-engine';

export default async function JobDocumentsPage({ params }: { params: { jobId: string } }) {
  const documents = await getEntityDocuments('job', params.jobId);
  return <AppShell>
    <PageHeader eyebrow="Job Documents" title={`Documents for Job ${params.jobId}`} description="Contracts, field photos, drawings, closeout packages, invoices and supporting documents attached to this job." />
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><DocumentList documents={documents} /><DocumentUploadForm defaultEntityType="job" defaultEntityKey={params.jobId} /></div>
  </AppShell>;
}
