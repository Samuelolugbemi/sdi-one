export const workflowTemplates = [
  { key: 'invoice-review', name: 'Invoice Review', trigger: 'Invoice imported', stages: ['Imported','Vendor Matched','Job Matched','Manager Review','Accounting Review','Ready for Sage'] },
  { key: 'import-failure', name: 'Import Failure Response', trigger: 'Import failed', stages: ['Failure Detected','Owner Notified','Error Reviewed','Reprocessed','Closed'] },
  { key: 'job-risk', name: 'Job Risk Escalation', trigger: 'Margin/risk exception', stages: ['Detected','PM Notified','Operations Review','Executive Review','Action Taken'] },
  { key: 'equipment-repair', name: 'Equipment Repair Workflow', trigger: 'Equipment status repair', stages: ['Repair Opened','Diagnosis','Parts Needed','Repair Complete','Returned to Service'] },
];
