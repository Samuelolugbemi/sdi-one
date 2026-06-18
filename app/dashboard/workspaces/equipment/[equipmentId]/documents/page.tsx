import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { getEntityDocuments } from '@/lib/document-engine';

export default async function EquipmentDocumentsPage({ params }: { params: { equipmentId: string } }) {
  const documents = await getEntityDocuments('equipment', params.equipmentId);
  return <AppShell>
    <PageHeader eyebrow="Equipment Documents" title={`Documents for Equipment ${params.equipmentId}`} description="Asset photos, maintenance records, inspection files, repair support and warranty documents." />
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><DocumentList documents={documents} /><DocumentUploadForm defaultEntityType="equipment" defaultEntityKey={params.equipmentId} /></div>
  </AppShell>;
}
