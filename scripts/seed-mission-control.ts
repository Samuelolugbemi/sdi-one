import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const dashboard = await prisma.dashboardDefinition.upsert({
    where: { key: 'mission-control' },
    update: {},
    create: { key: 'mission-control', name: 'Mission Control', audience: 'Executive', description: 'Executive operating center for SDI One.' }
  });
  const widgets = [
    ['known-cost', 'Known Cost', 'metric', 'finance'],
    ['ap-spend', 'AP Spend', 'metric', 'finance'],
    ['jobs-pulse', 'Jobs Pulse', 'metric', 'operations'],
    ['assets-pulse', 'Asset Pulse', 'metric', 'assets'],
    ['critical-work-queue', 'Critical Work Queue', 'queue', 'platform'],
    ['ai-executive-briefing', 'AI Executive Briefing', 'briefing', 'ai'],
  ];
  for (let i = 0; i < widgets.length; i++) {
    const [key, title, widgetType, domain] = widgets[i];
    await prisma.dashboardWidget.upsert({ where: { key }, update: { dashboardId: dashboard.id, sortOrder: i }, create: { key, title, widgetType, domain, sortOrder: i, dashboardId: dashboard.id } });
  }
  const kpis = [
    ['known_cost', 'Known Cost', 'finance', 'currency'],
    ['ap_spend', 'AP Spend', 'finance', 'currency'],
    ['job_count', 'Jobs', 'operations', 'number'],
    ['equipment_count', 'Assets', 'assets', 'number'],
    ['inventory_cost', 'Inventory Cost', 'operations', 'currency'],
  ];
  for (const [key, name, domain, format] of kpis) {
    await prisma.kpiDefinition.upsert({ where: { key }, update: {}, create: { key, name, domain, format, description: `${name} shown on SDI One executive and workspace dashboards.` } });
  }
  const checks = [
    ['job_missing_customer', 'Jobs Missing Customer', 'operations', 'Warning'],
    ['invoice_missing_vendor', 'Invoices Missing Vendor', 'finance', 'Warning'],
    ['invoice_line_missing_job', 'Invoice Lines Missing Job', 'finance', 'Critical'],
    ['inventory_missing_job', 'Inventory Rows Missing Job', 'operations', 'Critical'],
    ['equipment_missing_status', 'Equipment Missing Status', 'assets', 'Info'],
  ];
  for (const [key, name, domain, severity] of checks) {
    await prisma.dataQualityCheck.upsert({ where: { key }, update: {}, create: { key, name, domain, severity, status: 'Ready', description: `${name} data quality control.` } });
  }
  await prisma.operationalAlert.createMany({ data: [
    { title: 'Integration credentials pending', description: 'Sage, Salesforce, POR, Ford Pro, Fuel and Monday connectors are scaffolded but not configured.', severity: 'Info', domain: 'integrations', source: 'system' },
    { title: 'AI model not connected', description: 'AI briefing is using deterministic business summaries until model credentials are configured.', severity: 'Info', domain: 'ai', source: 'system' },
  ], skipDuplicates: true }).catch(() => undefined);
  console.log('Seeded mission control, KPIs, data quality checks and baseline alerts.');
}

main().finally(async () => prisma.$disconnect());
