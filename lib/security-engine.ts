export const platformRoles = [
  { name: 'System Admin', scope: 'all', description: 'Full platform administration including users, settings, integrations, and security.' },
  { name: 'Executive', scope: 'all', description: 'Company-wide executive command center and all business modules.' },
  { name: 'Company Admin', scope: 'company', description: 'All records for assigned companies/entities.' },
  { name: 'Project Manager', scope: 'job', description: 'Assigned jobs plus related customers, invoices, inventory, and equipment.' },
  { name: 'Accounting', scope: 'financial', description: 'Vendors, invoices, AP spend, reports, exports, and financial analytics.' },
  { name: 'Operations Manager', scope: 'operations', description: 'Jobs, assets, equipment, fleet, inventory, and operational alerts.' },
  { name: 'Fleet / Equipment Manager', scope: 'assets', description: 'Fleet, equipment, utilization, maintenance, fuel, and repair analytics.' },
  { name: 'Read Only', scope: 'assigned', description: 'View-only access based on assigned company/job restrictions.' },
];

export const permissionMatrix = [
  ['executive.view','Executive dashboard','Executive, System Admin'],
  ['entity.read','View entity records','All roles subject to scope'],
  ['entity.export','Export entity data','Executive, Admin, Accounting'],
  ['entity.manage','Manage metadata/entity configuration','System Admin'],
  ['security.manage','Manage users/roles/permissions','System Admin'],
  ['integration.manage','Configure integrations','System Admin'],
  ['documents.upload','Upload documents','All operational roles subject to scope'],
  ['reports.build','Build reports','Executive, Admin, Accounting, Operations Manager'],
];

export function deriveCompanyFromJob(jobId?: string | null) { return jobId?.split('-')[1] ?? null; }
export function deriveCompanyFromEquipment(equipmentId?: string | null) { return equipmentId?.split('-')[0] ?? null; }
