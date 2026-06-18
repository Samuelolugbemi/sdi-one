export const platformModules = [
  { name: 'Entity Engine', status: 'Active', description: 'Defines customers, jobs, invoices, equipment and future SDI objects as platform entities.' },
  { name: 'Workspace Engine', status: 'Active', description: 'Provides overview, relationships, timeline, documents, analytics and AI panels for every record.' },
  { name: 'Relationship Engine', status: 'Foundation', description: 'Connects customer → job → invoice line → vendor and job → inventory → equipment.' },
  { name: 'Timeline Engine', status: 'Foundation', description: 'Captures business events from imports, integrations, updates and workflows.' },
  { name: 'Document Engine', status: 'Ready', description: 'Prepares file/document attachment support for jobs, invoices, equipment and vendors.' },
  { name: 'AI Context Engine', status: 'Ready', description: 'Prepares structured business context for executive briefings and operational explanations.' },
];

export const integrations = [
  { slug: 'intacct', name: 'Sage Intacct', status: 'CSV Import Active', next: 'Production connector and scheduled import validation' },
  { slug: 'salesforce', name: 'Salesforce', status: 'Ready to Configure', next: 'OAuth app, object mapping, sync jobs' },
  { slug: 'por', name: 'Point of Rental', status: 'Ready to Configure', next: 'Equipment rental and repair cost feed' },
  { slug: 'ford-pro', name: 'Ford Pro', status: 'Ready to Configure', next: 'Vehicle mileage, diagnostics and location' },
  { slug: 'fuel', name: 'Fuel System', status: 'Ready to Configure', next: 'Fuel cost, MPG and equipment profitability' },
  { slug: 'monday', name: 'Monday.com', status: 'Ready to Configure', next: 'Planning, project tasks and operational timeline events' },
  { slug: 'geotab', name: 'Geotab / Dispatch', status: 'Ready to Configure', next: 'Live fleet location and trip telemetry' },
];

export const roleTemplates = [
  { role: 'Executive', scope: 'All companies, all modules, executive intelligence, export access' },
  { role: 'System Admin', scope: 'All modules plus users, roles, integrations, mappings, settings' },
  { role: 'Company Admin', scope: 'Assigned companies, all jobs/assets/finance data inside scope' },
  { role: 'Project Manager', scope: 'Assigned jobs plus related customer, invoice, inventory and equipment records' },
  { role: 'Accounting', scope: 'Financial analytics, vendors, invoices, invoice lines, customers and jobs' },
  { role: 'Operations Manager', scope: 'Jobs, inventory, equipment, fleet and operations reporting' },
  { role: 'Read Only', scope: 'View-only access based on company/job assignments' },
];
