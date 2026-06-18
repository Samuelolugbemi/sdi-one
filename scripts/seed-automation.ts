
import { prisma } from '../lib/prisma';

async function main() {
  const rules = [
    { key: 'invoice-large-spend-review', name: 'Large invoice review', domain: 'Finance', entityType: 'invoice', triggerType: 'record_imported', severity: 'High', description: 'Creates an approval task when a vendor invoice exceeds the configured spend threshold.', condition: { field: 'amount', operator: 'gte', value: 25000 }, action: { type: 'create_approval', assignTo: 'Accounting Manager' } },
    { key: 'job-margin-risk-alert', name: 'Job margin risk alert', domain: 'Operations', entityType: 'job', triggerType: 'kpi_changed', severity: 'High', description: 'Flags jobs whose cost trend indicates margin deterioration.', condition: { kpi: 'margin', operator: 'lt', value: 0.15 }, action: { type: 'notify', audience: ['Executive','Operations Manager'] } },
    { key: 'equipment-repair-cost-alert', name: 'Equipment repair cost alert', domain: 'Assets', entityType: 'equipment', triggerType: 'cost_threshold', severity: 'Warning', description: 'Flags equipment whose repair cost exceeds expected operating range.', condition: { field: 'repair_cost_mtd', operator: 'gte', value: 5000 }, action: { type: 'create_task', taskType: 'maintenance_review' } },
    { key: 'import-failure-notification', name: 'Import failure notification', domain: 'Integrations', entityType: 'importRun', triggerType: 'job_failed', severity: 'Critical', description: 'Notifies admins when any scheduled import fails.', condition: { status: 'failed' }, action: { type: 'notify', audience: ['System Admin'] } },
  ];
  for (const r of rules) await prisma.automationRule.upsert({ where: { key: r.key }, update: r as any, create: r as any });

  const schedules = [
    { key: 'nightly-intacct-import', name: 'Nightly Intacct import', schedule: '0 2 * * *', jobType: 'import', status: 'Enabled', description: 'Imports SDI Intacct CSV/API data into the reporting database.', config: { sources: ['customers','jobs','vendors','invoices','invoice-lines','equipment','inventory'] } },
    { key: 'daily-kpi-recalculation', name: 'Daily KPI recalculation', schedule: '30 3 * * *', jobType: 'analytics', status: 'Enabled', description: 'Refreshes executive KPIs, job health scores, and equipment profitability metrics.', config: { domains: ['finance','operations','assets'] } },
    { key: 'weekly-executive-report', name: 'Weekly executive report', schedule: '0 7 * * MON', jobType: 'report', status: 'Enabled', description: 'Prepares weekly executive briefing and report package.', config: { audience: 'Executive' } },
  ];
  for (const j of schedules) await prisma.scheduledJobDefinition.upsert({ where: { key: j.key }, update: j as any, create: j as any });

  const approvals = [
    { key: 'ap-bill-approval-policy', name: 'AP bill approval policy', entityType: 'invoice', domain: 'Finance', description: 'Approval policy for AP bills based on amount, vendor, and job.', condition: { amount: { gte: 10000 } }, steps: [{ role: 'Accounting', action: 'review' }, { role: 'Company Admin', action: 'approve' }] },
    { key: 'job-cost-exception-policy', name: 'Job cost exception policy', entityType: 'job', domain: 'Operations', description: 'Routes jobs with unusual cost increases for review.', condition: { costVariancePercent: { gte: 15 } }, steps: [{ role: 'Project Manager', action: 'review' }, { role: 'Executive', action: 'acknowledge' }] },
  ];
  for (const p of approvals) await prisma.approvalPolicy.upsert({ where: { key: p.key }, update: p as any, create: p as any });

  await prisma.taskItem.createMany({ data: [
    { title: 'Review large vendor invoice exceptions', taskType: 'Approval', priority: 'High', status: 'Open', entityType: 'invoice', source: 'Automation' },
    { title: 'Validate job margin risk candidates', taskType: 'Review', priority: 'High', status: 'Open', entityType: 'job', source: 'Analytics' },
    { title: 'Configure Salesforce connector credentials', taskType: 'Integration', priority: 'Normal', status: 'Open', entityType: 'integration', source: 'Setup' },
  ], skipDuplicates: true }).catch(()=>{});
  console.log('Seeded automation platform.');
}
main().finally(()=>prisma.$disconnect());
