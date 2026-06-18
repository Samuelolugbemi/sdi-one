import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const requirements = [
    ['job', 'Contract', 'Closeout', true, 'Required job contract or authorization document.'],
    ['job', 'Photo', 'Closeout', false, 'Field photos and job progress evidence.'],
    ['invoice', 'Invoice PDF', 'InvoiceReview', true, 'Original AP bill PDF or scanned invoice.'],
    ['invoice', 'Approval Support', 'InvoiceReview', false, 'Supporting approval or Paperless documentation.'],
    ['equipment', 'Maintenance Record', 'Maintenance', true, 'Inspection, repair and maintenance documentation.'],
    ['equipment', 'Photo', 'Maintenance', false, 'Equipment photos and condition evidence.'],
    ['vendor', 'Contract', 'Compliance', false, 'Vendor agreements, W-9s, insurance and compliance files.'],
    ['customer', 'Contract', 'CustomerFile', false, 'Customer contracts, correspondence and credit files.'],
  ] as const;

  for (const [entityType, category, requiredFor, isRequired, description] of requirements) {
    await prisma.documentRequirement.upsert({
      where: { entityType_category_requiredFor: { entityType, category, requiredFor } },
      update: { isRequired, description },
      create: { entityType, category, requiredFor, isRequired, description },
    });
  }

  const sampleDocs = [
    { entityType: 'job', entityKey: '07194-26-01', entityLabel: 'Sample Job', fileName: 'sample-job-contract.pdf', originalName: 'Sample Job Contract.pdf', category: 'Contract', description: 'Placeholder contract record for document engine validation.' },
    { entityType: 'invoice', entityKey: 'SMPR14740', entityLabel: 'Sample Invoice', fileName: 'sample-invoice.pdf', originalName: 'Sample Invoice.pdf', category: 'Invoice PDF', description: 'Placeholder AP invoice document record.' },
    { entityType: 'equipment', entityKey: '56-7065', entityLabel: 'Sample Equipment', fileName: 'sample-equipment-photo.jpg', originalName: 'Sample Equipment Photo.jpg', category: 'Photo', description: 'Placeholder equipment photo record.' },
  ];

  for (const doc of sampleDocs) {
    const exists = await prisma.documentRecord.findFirst({
      where: { entityType: doc.entityType, entityKey: doc.entityKey, fileName: doc.fileName },
    });
    if (!exists) {
      await prisma.documentRecord.create({
        data: {
          ...doc,
          fileType: doc.fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          mimeType: doc.fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          sizeBytes: 0,
          storageProvider: 'seed',
          storageKey: null,
          status: 'MetadataOnly',
          uploadedBy: 'system',
        },
      });
    }
  }

  console.log('Document engine seeded.');
}

main().finally(() => prisma.$disconnect());
