
import { prisma } from '../lib/prisma';

async function main() {
  const connectors = [
    { key: 'sage-intacct', name: 'Sage Intacct', system: 'Sage Intacct', category: 'Finance', status: 'CSV active / API planned', authType: 'OAuth/API session', enabled: true, description: 'Financial source of truth for customers, jobs, vendors, invoices, invoice lines, inventory, and equipment.', config: { ingestion: ['csv','api'], priority: 1 } },
    { key: 'salesforce', name: 'Salesforce', system: 'Salesforce', category: 'CRM', status: 'Awaiting OAuth credentials', authType: 'OAuth 2.0', enabled: false, description: 'CRM opportunity, contact, job, and invoice context.', config: { objects: ['Account','Contact','Opportunity','Third_Party_Invoice__c'] } },
    { key: 'por', name: 'Point of Rental', system: 'POR', category: 'Equipment', status: 'Awaiting connector', authType: 'File/API', enabled: false, description: 'Equipment rental revenue, utilization, availability, and repair cost context.' },
    { key: 'geotab', name: 'Geotab', system: 'Geotab', category: 'Fleet', status: 'Awaiting credentials', authType: 'API', enabled: false, description: 'GPS, trips, vehicle telemetry, utilization, and driver context.' },
    { key: 'ford-pro', name: 'Ford Pro', system: 'Ford Pro', category: 'Fleet', status: 'Awaiting credentials', authType: 'API', enabled: false, description: 'Vehicle mileage, health, diagnostics, and fleet telematics.' },
    { key: 'fuel-system', name: 'Fuel System', system: 'Fuel', category: 'Fuel', status: 'Awaiting source details', authType: 'CSV/API', enabled: false, description: 'Fuel transactions, cost, MPG, and idle fuel analytics.' },
    { key: 'monday', name: 'Monday.com', system: 'Monday.com', category: 'Project Management', status: 'Awaiting API token', authType: 'API token', enabled: false, description: 'Project planning, task, milestone, and operational status context.' },
    { key: 'sharepoint', name: 'SharePoint / OneDrive', system: 'Microsoft 365', category: 'Documents', status: 'Future', authType: 'Microsoft Graph', enabled: false, description: 'Document storage and file synchronization.' },
  ];
  for (const c of connectors) await prisma.integrationConnector.upsert({ where: { key: c.key }, update: c as any, create: c as any });

  const sage = await prisma.integrationConnector.findUnique({ where: { key: 'sage-intacct' }});
  if (sage) {
    const mappings = [
      { sourceObject: 'customers.csv', targetEntity: 'customer', fieldMap: { Customer: 'customerId', Name: 'name', Address_1: 'address1', City: 'city', State: 'state', ZIP_Code: 'zipCode', Type: 'type' } },
      { sourceObject: 'jobs.csv', targetEntity: 'job', fieldMap: { Job: 'jobId', Unique_Job: 'uniqueJob', AR_Customer: 'customerId', Status: 'status' } },
      { sourceObject: 'invoice-lines.csv', targetEntity: 'invoiceLine', fieldMap: { Sage_ID: 'sageId', Invoice_Sage_ID: 'invoiceSageId', Job: 'jobId', Unique_Job: 'uniqueJob', Amount: 'amount' } },
    ];
    for (const m of mappings) await prisma.integrationMapping.create({ data: { connectorId: sage.id, ...m, enabled: true } }).catch(()=>{});
    await prisma.integrationRun.create({ data: { connectorId: sage.id, runType: 'seed/status', status: 'Completed', recordsRead: 0, recordsWritten: 0, message: 'Connector framework seeded. CSV importer remains active.' }}).catch(()=>{});
  }

  const policies = [
    { key: 'standard-api-retry', name: 'Standard API Retry', maxAttempts: 3, backoffType: 'exponential', retryableErrors: ['429','500','502','503','timeout'] },
    { key: 'file-import-retry', name: 'File Import Retry', maxAttempts: 2, backoffType: 'fixed', retryableErrors: ['locked_file','partial_upload','parse_error'] },
  ];
  for (const p of policies) await prisma.integrationRetryPolicy.upsert({ where: { key: p.key }, update: p as any, create: p as any });
  console.log('Seeded integration platform.');
}
main().finally(()=>prisma.$disconnect());
