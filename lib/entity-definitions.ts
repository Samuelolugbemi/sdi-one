export type EntityFieldDefinition = {
  key: string;
  label: string;
  fieldType?: string;
  sourceColumn?: string;
  description?: string;
  isPrimary?: boolean;
  isSearchable?: boolean;
  isListVisible?: boolean;
  isDetailVisible?: boolean;
  isFilterable?: boolean;
  isSortable?: boolean;
  required?: boolean;
};

export type EntityCapabilityDefinition = {
  key: string;
  label: string;
  description?: string;
  status?: string;
};

export type WorkspaceSectionDefinition = {
  key: string;
  label: string;
  description?: string;
  sectionType?: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
};

export type EntityPermissionDefinition = {
  action: string;
  key: string;
  label: string;
  description?: string;
  defaultRoles?: string[];
};

export type EntityRelationshipDefinition = {
  key: string;
  sourceEntityKey: string;
  targetEntityKey: string;
  label: string;
  inverseLabel?: string;
  relationshipType: string;
  sourceField: string;
  targetField: string;
  cardinality?: string;
  description?: string;
};

export type EntityDefinition = {
  key: string;
  displayName: string;
  pluralName: string;
  domain: string;
  description: string;
  icon: string;
  color: string;
  sourceModel: string;
  routePath: string;
  isSystem?: boolean;
  supportsSearch?: boolean;
  supportsTimeline?: boolean;
  supportsDocuments?: boolean;
  supportsAi?: boolean;
  fields: EntityFieldDefinition[];
  capabilities: EntityCapabilityDefinition[];
  workspaceSections: WorkspaceSectionDefinition[];
  permissions: EntityPermissionDefinition[];
};

const commonWorkspace = [
  { key: 'overview', label: 'Overview', description: 'Primary facts, KPIs, and business summary.' },
  { key: 'relationships', label: 'Relationships', description: 'Connected customers, jobs, invoices, vendors, assets, and transactions.' },
  { key: 'timeline', label: 'Timeline', description: 'Chronological business events from imports and future integrations.' },
  { key: 'documents', label: 'Documents', description: 'Files, PDFs, receipts, photos, contracts, and supporting records.' },
  { key: 'analytics', label: 'Analytics', description: 'Charts, KPIs, trends, and exception indicators.' },
  { key: 'ai', label: 'AI Insights', description: 'AI-ready context for explanations, risk notes, and recommendations.' },
];

const commonPermissions = (entity: string): EntityPermissionDefinition[] => [
  { action: 'read', key: `${entity}.read`, label: 'Read', defaultRoles: ['Executive', 'System Admin', 'Company Admin', 'Project Manager', 'Accounting', 'Operations Manager', 'Read Only'] },
  { action: 'export', key: `${entity}.export`, label: 'Export', defaultRoles: ['Executive', 'System Admin', 'Company Admin', 'Accounting'] },
  { action: 'manage', key: `${entity}.manage`, label: 'Manage', defaultRoles: ['System Admin'] },
];

export const entityDefinitions: EntityDefinition[] = [
  {
    key: 'customer', displayName: 'Customer', pluralName: 'Customers', domain: 'CRM', icon: 'Users', color: 'blue', sourceModel: 'Customer', routePath: '/dashboard/customers', isSystem: true,
    description: 'Global customer master record. Customers are not company-owned, but their related jobs and financial records may be permission-scoped.',
    fields: [
      { key: 'customerId', label: 'Customer ID', sourceColumn: 'Customer', isPrimary: true, isSearchable: true, isSortable: true, required: true },
      { key: 'name', label: 'Name', sourceColumn: 'Name', isSearchable: true, isSortable: true },
      { key: 'address1', label: 'Address', sourceColumn: 'Address_1' },
      { key: 'city', label: 'City', sourceColumn: 'City', isSearchable: true, isFilterable: true },
      { key: 'state', label: 'State', sourceColumn: 'State', isSearchable: true, isFilterable: true },
      { key: 'zipCode', label: 'ZIP Code', sourceColumn: 'ZIP_Code' },
      { key: 'type', label: 'Type', sourceColumn: 'Type', isFilterable: true },
    ],
    capabilities: [
      { key: 'customer-360', label: 'Customer 360', description: 'Show identity, jobs, invoices, timeline, and revenue context.' },
      { key: 'revenue-summary', label: 'Revenue Summary' },
      { key: 'job-relationships', label: 'Job Relationships' },
    ],
    workspaceSections: commonWorkspace,
    permissions: commonPermissions('customer'),
  },
  {
    key: 'job', displayName: 'Job', pluralName: 'Jobs', domain: 'Operations', icon: 'BriefcaseBusiness', color: 'cyan', sourceModel: 'Job', routePath: '/dashboard/jobs', isSystem: true,
    description: 'Revenue-generating SDI job. Owning company is derived from the middle segment of the job number.',
    fields: [
      { key: 'jobId', label: 'Job ID', sourceColumn: 'Job', isPrimary: true, isSearchable: true, isSortable: true, required: true },
      { key: 'uniqueJob', label: 'Unique Job', sourceColumn: 'Unique_Job', isSearchable: true, isSortable: true },
      { key: 'description', label: 'Description', sourceColumn: 'Description', isSearchable: true },
      { key: 'well', label: 'Well', sourceColumn: 'Well', isSearchable: true },
      { key: 'status', label: 'Status', sourceColumn: 'Status', isFilterable: true, isSortable: true },
      { key: 'customerId', label: 'AR Customer', sourceColumn: 'AR_Customer', isSearchable: true, isFilterable: true },
      { key: 'county', label: 'County', sourceColumn: 'County', isFilterable: true },
      { key: 'workTypeId', label: 'Work Type', sourceColumn: 'WorkTypeId', isFilterable: true },
    ],
    capabilities: [
      { key: 'profitability', label: 'Profitability', description: 'Revenue, cost, margin, inventory, equipment, vendor spend.' },
      { key: 'job-costing', label: 'Job Costing' },
      { key: 'operational-timeline', label: 'Operational Timeline' },
      { key: 'risk-insights', label: 'Risk Insights', status: 'AI Ready' },
    ],
    workspaceSections: [
      ...commonWorkspace,
      { key: 'financials', label: 'Financials', description: 'Revenue, invoice lines, inventory cost, vendor spend, and margin.' },
      { key: 'equipment', label: 'Equipment', description: 'Assets and fleet items connected to this job.' },
      { key: 'inventory', label: 'Inventory', description: 'Inventory transactions used on this job.' },
    ],
    permissions: commonPermissions('job'),
  },
  {
    key: 'vendor', displayName: 'Vendor', pluralName: 'Vendors', domain: 'Finance', icon: 'Building2', color: 'emerald', sourceModel: 'Vendor', routePath: '/dashboard/vendors', isSystem: true,
    description: 'Global vendor master record. Vendors are not company-owned; spend visibility can be controlled through related company/job permissions.',
    fields: [
      { key: 'vendorId', label: 'Vendor ID', sourceColumn: 'Vendor', isPrimary: true, isSearchable: true, isSortable: true, required: true },
      { key: 'name', label: 'Name', sourceColumn: 'Name', isSearchable: true, isSortable: true },
      { key: 'address1', label: 'Address', sourceColumn: 'Address_1' },
      { key: 'city', label: 'City', sourceColumn: 'City', isSearchable: true, isFilterable: true },
      { key: 'state', label: 'State', sourceColumn: 'State', isFilterable: true },
      { key: 'zipCode', label: 'ZIP', sourceColumn: 'ZIP' },
      { key: 'type', label: 'Type', sourceColumn: 'Type', isFilterable: true },
    ],
    capabilities: [
      { key: 'spend-analysis', label: 'Spend Analysis' },
      { key: 'invoice-history', label: 'Invoice History' },
      { key: 'job-cost-driver', label: 'Job Cost Driver' },
    ],
    workspaceSections: commonWorkspace,
    permissions: commonPermissions('vendor'),
  },
  {
    key: 'invoice', displayName: 'Invoice', pluralName: 'Invoices', domain: 'Finance', icon: 'ReceiptText', color: 'amber', sourceModel: 'Invoice', routePath: '/dashboard/invoices', isSystem: true,
    description: 'AP bill or invoice header. Invoice workspaces answer why money was spent and which jobs consumed it.',
    fields: [
      { key: 'sageId', label: 'Sage ID', sourceColumn: 'Sage_ID', isPrimary: true, isSearchable: true, isSortable: true, required: true },
      { key: 'vendorId', label: 'Vendor', sourceColumn: 'Vendor', isSearchable: true, isFilterable: true },
      { key: 'invoiceDate', label: 'Invoice Date', sourceColumn: 'Invoice_Date', fieldType: 'date', isSortable: true, isFilterable: true },
      { key: 'invoice', label: 'Invoice', sourceColumn: 'Invoice', isSearchable: true },
      { key: 'vendorInvoiceNumber', label: 'Vendor Invoice #', sourceColumn: 'Vendor_Invoice_Number', isSearchable: true },
      { key: 'description', label: 'Description', sourceColumn: 'Description', isSearchable: true },
      { key: 'amount', label: 'Amount', sourceColumn: 'Amount', fieldType: 'money', isSortable: true },
    ],
    capabilities: [
      { key: 'spend-explanation', label: 'Spend Explanation' },
      { key: 'line-drilldown', label: 'Line Drilldown' },
      { key: 'approval-status', label: 'Approval Status', status: 'Display Only' },
    ],
    workspaceSections: [...commonWorkspace, { key: 'lines', label: 'Invoice Lines', description: 'All invoice lines grouped under the invoice.' }],
    permissions: commonPermissions('invoice'),
  },
  {
    key: 'invoice_line', displayName: 'Invoice Line', pluralName: 'Invoice Lines', domain: 'Finance', icon: 'FileText', color: 'orange', sourceModel: 'InvoiceLine', routePath: '/dashboard/invoice-lines', isSystem: true,
    description: 'Invoice detail line connected to invoices, jobs, vendors, cost codes, and expense accounts.',
    fields: [
      { key: 'sageId', label: 'Sage ID', sourceColumn: 'Sage_ID', isPrimary: true, isSearchable: true, required: true },
      { key: 'invoiceSageId', label: 'Invoice Sage ID', sourceColumn: 'Invoice_Sage_ID', isSearchable: true, isFilterable: true },
      { key: 'jobId', label: 'Job', sourceColumn: 'Job', isSearchable: true, isFilterable: true },
      { key: 'uniqueJob', label: 'Unique Job', sourceColumn: 'Unique_Job', isSearchable: true },
      { key: 'costCode', label: 'Cost Code', sourceColumn: 'Cost_Code', isFilterable: true },
      { key: 'amount', label: 'Amount', sourceColumn: 'Amount', fieldType: 'money', isSortable: true },
      { key: 'vendorId', label: 'Vendor Sage ID', sourceColumn: 'Vendor_Sage_ID', isSearchable: true },
      { key: 'expenseAccount', label: 'Expense Account', sourceColumn: 'Expense_Account', isFilterable: true },
      { key: 'description', label: 'Description', sourceColumn: 'Description', isSearchable: true },
    ],
    capabilities: [
      { key: 'job-costing', label: 'Job Costing' },
      { key: 'cost-code-analysis', label: 'Cost Code Analysis' },
      { key: 'vendor-spend', label: 'Vendor Spend' },
    ],
    workspaceSections: commonWorkspace,
    permissions: commonPermissions('invoice_line'),
  },
  {
    key: 'equipment', displayName: 'Equipment', pluralName: 'Equipment', domain: 'Assets', icon: 'Wrench', color: 'purple', sourceModel: 'Equipment', routePath: '/dashboard/equipment', isSystem: true,
    description: 'Equipment and fleet asset. Owning company is derived from the first segment of the equipment ID.',
    fields: [
      { key: 'equipmentId', label: 'Equipment ID', sourceColumn: 'Equipment', isPrimary: true, isSearchable: true, isSortable: true, required: true },
      { key: 'description', label: 'Description', sourceColumn: 'Description', isSearchable: true },
      { key: 'status', label: 'Status', sourceColumn: 'Status', isFilterable: true, isSortable: true },
    ],
    capabilities: [
      { key: 'profitability', label: 'Profitability' },
      { key: 'maintenance', label: 'Maintenance' },
      { key: 'utilization', label: 'Utilization' },
      { key: 'location', label: 'Location', status: 'Integration Ready' },
    ],
    workspaceSections: [...commonWorkspace, { key: 'maintenance', label: 'Maintenance' }, { key: 'fuel', label: 'Fuel' }, { key: 'gps', label: 'GPS' }],
    permissions: commonPermissions('equipment'),
  },
  {
    key: 'inventory_transaction', displayName: 'Inventory Transaction', pluralName: 'Inventory Transactions', domain: 'Operations', icon: 'Package', color: 'rose', sourceModel: 'InventoryTransaction', routePath: '/dashboard/inventory', isSystem: true,
    description: 'Inventory usage transaction. Visibility is governed by the job relationship.',
    fields: [
      { key: 'rowId', label: 'Row ID', sourceColumn: 'Row_ID', isPrimary: true, isSearchable: true, required: true },
      { key: 'accountingDate', label: 'Accounting Date', sourceColumn: 'Accounting_Date', fieldType: 'date' },
      { key: 'amount', label: 'Amount', sourceColumn: 'Amount', fieldType: 'money', isSortable: true },
      { key: 'description', label: 'Description', sourceColumn: 'Description', isSearchable: true },
      { key: 'units', label: 'Units', sourceColumn: 'Units', fieldType: 'number' },
      { key: 'unitCost', label: 'Unit Cost', sourceColumn: 'Unit_Cost', fieldType: 'money' },
      { key: 'costCode', label: 'Cost Code', sourceColumn: 'Cost_Code', isFilterable: true },
      { key: 'jobId', label: 'Job', sourceColumn: 'Job', isSearchable: true, isFilterable: true },
      { key: 'uniqueJobNumber', label: 'Unique Job Number', sourceColumn: 'Unique_Job_Number', isSearchable: true },
    ],
    capabilities: [
      { key: 'usage-tracking', label: 'Usage Tracking' },
      { key: 'job-cost', label: 'Job Cost' },
      { key: 'stock-future', label: 'Stock/Reorder Ready', status: 'Future Ready' },
    ],
    workspaceSections: commonWorkspace,
    permissions: commonPermissions('inventory_transaction'),
  },
];

export const relationshipDefinitions: EntityRelationshipDefinition[] = [
  { key: 'customer_jobs', sourceEntityKey: 'job', targetEntityKey: 'customer', label: 'Job belongs to customer', inverseLabel: 'Customer has jobs', relationshipType: 'customer_job', sourceField: 'customerId', targetField: 'customerId', cardinality: 'many-to-one', description: 'Jobs connect to customers using AR_Customer/customerId.' },
  { key: 'invoice_vendor', sourceEntityKey: 'invoice', targetEntityKey: 'vendor', label: 'Invoice belongs to vendor', inverseLabel: 'Vendor has invoices', relationshipType: 'invoice_vendor', sourceField: 'vendorId', targetField: 'vendorId', cardinality: 'many-to-one' },
  { key: 'invoice_line_invoice', sourceEntityKey: 'invoice_line', targetEntityKey: 'invoice', label: 'Invoice line belongs to invoice', inverseLabel: 'Invoice has lines', relationshipType: 'invoice_line_invoice', sourceField: 'invoiceSageId', targetField: 'sageId', cardinality: 'many-to-one' },
  { key: 'invoice_line_job', sourceEntityKey: 'invoice_line', targetEntityKey: 'job', label: 'Invoice line charged to job', inverseLabel: 'Job has invoice lines', relationshipType: 'invoice_line_job', sourceField: 'jobId', targetField: 'jobId', cardinality: 'many-to-one' },
  { key: 'invoice_line_vendor', sourceEntityKey: 'invoice_line', targetEntityKey: 'vendor', label: 'Invoice line references vendor', inverseLabel: 'Vendor has invoice lines', relationshipType: 'invoice_line_vendor', sourceField: 'vendorId', targetField: 'vendorId', cardinality: 'many-to-one' },
  { key: 'inventory_job', sourceEntityKey: 'inventory_transaction', targetEntityKey: 'job', label: 'Inventory used on job', inverseLabel: 'Job has inventory usage', relationshipType: 'inventory_job', sourceField: 'jobId', targetField: 'jobId', cardinality: 'many-to-one' },

  ,{
    key: 'planning_item',
    label: 'Planning Item',
    pluralLabel: 'Planning Items',
    domain: 'planning',
    description: 'Project planning item linked to jobs, Monday.com boards and operational execution.',
    capabilities: ['planning', 'job_schedule', 'risk_tracking', 'resource_load'],
    workspaceSections: ['overview', 'job', 'tasks', 'timeline', 'resources', 'ai'],
    searchableFields: ['title', 'jobId', 'uniqueJob', 'ownerName'],
  }
];
