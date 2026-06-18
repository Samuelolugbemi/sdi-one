import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { getEntityDocuments } from '@/lib/document-engine';

export default async function InvoiceDocumentsPage({ params }: { params: { sageId: string } }) {
  const documents = await getEntityDocuments('invoice', params.sageId);
  return <AppShell>
    <PageHeader eyebrow="Invoice Documents" title={`Documents for Invoice ${params.sageId}`} description="AP bill PDFs, receipts, Paperless approval support and invoice documentation." />
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><DocumentList documents={documents} /><DocumentUploadForm defaultEntityType="invoice" defaultEntityKey={params.sageId} /></div>
  </AppShell>;
}
