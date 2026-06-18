import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { getEntityDocuments } from '@/lib/document-engine';

export default async function VendorDocumentsPage({ params }: { params: { vendorId: string } }) {
  const documents = await getEntityDocuments('vendor', params.vendorId);
  return <AppShell>
    <PageHeader eyebrow="Vendor Documents" title={`Documents for Vendor ${params.vendorId}`} description="W-9s, insurance, agreements, vendor compliance files and supporting records." />
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><DocumentList documents={documents} /><DocumentUploadForm defaultEntityType="vendor" defaultEntityKey={params.vendorId} /></div>
  </AppShell>;
}
