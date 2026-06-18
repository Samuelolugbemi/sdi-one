import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { getEntityDocuments } from '@/lib/document-engine';

export default async function CustomerDocumentsPage({ params }: { params: { customerId: string } }) {
  const documents = await getEntityDocuments('customer', params.customerId);
  return <AppShell>
    <PageHeader eyebrow="Customer Documents" title={`Documents for Customer ${params.customerId}`} description="Customer files, contracts, correspondence, credit documents and support." />
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><DocumentList documents={documents} /><DocumentUploadForm defaultEntityType="customer" defaultEntityKey={params.customerId} /></div>
  </AppShell>;
}
