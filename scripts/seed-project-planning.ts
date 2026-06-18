import { prisma } from '../lib/prisma';
import { mondayConnectorDefinition } from '../lib/integrations/monday-com/object-catalog';

async function upsertMapping(connectorId: number, sourceObject: string, targetEntity: string, fieldMap: any, transformRules: any) {
  const existing = await prisma.integrationMapping.findFirst({ where: { connectorId, sourceObject, targetEntity } });
  if (existing) return prisma.integrationMapping.update({ where: { id: existing.id }, data: { fieldMap, transformRules, enabled: true } as any });
  return prisma.integrationMapping.create({ data: { connectorId, sourceObject, targetEntity, fieldMap, transformRules, enabled: true } as any });
}

async function seedMondayConnector() {
  const definition = mondayConnectorDefinition;
  const connector = await prisma.integrationConnector.upsert({
    where: { key: definition.key },
    update: {
      name: definition.name,
      system: definition.system,
      category: definition.category,
      status: 'Credential-ready / planning model-ready',
      authType: definition.authType,
      enabled: true,
      description: definition.description,
      config: { objects: definition.objects, v: '1.5', scopes: ['boards:read', 'items:read', 'updates:read'] } as any,
    },
    create: {
      key: definition.key,
      name: definition.name,
      system: definition.system,
      category: definition.category,
      status: 'Credential-ready / planning model-ready',
      authType: definition.authType,
      enabled: true,
      description: definition.description,
      config: { objects: definition.objects, v: '1.5', scopes: ['boards:read', 'items:read', 'updates:read'] } as any,
    },
  });

  for (const object of definition.objects) {
    await upsertMapping(connector.id, object.sourceObject, object.targetEntity, {
      sourceKey: object.externalId,
      targetEntity: object.targetEntity,
      jobLinkRule: 'match Job or Unique_Job column to SDI jobId/uniqueJob',
    }, object);
  }

  await prisma.integrationRun.create({
    data: {
      connectorId: connector.id,
      runType: 'v1.5 Monday.com connector readiness seed',
      status: 'Completed',
      recordsRead: definition.objects.length,
      recordsWritten: definition.objects.length,
      recordsFailed: 0,
      message: 'Monday.com connector metadata seeded for project planning.',
      metrics: { objects: definition.objects.length, readiness: 'awaiting Monday.com API token' } as any,
    },
  });
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function seedPlanningData() {
  const boards = [
    { boardKey: 'board-sdi-active-jobs', name: 'SDI Active Jobs Planning', ownerTeam: 'Operations', mondayBoardId: '100001', description: 'Planning board for active drilling and construction jobs.' },
    { boardKey: 'board-equipment-mobilization', name: 'Equipment Mobilization', ownerTeam: 'Equipment', mondayBoardId: '100002', description: 'Equipment movement, staging, and assignment planning.' },
    { boardKey: 'board-executive-initiatives', name: 'Executive Initiatives', ownerTeam: 'Executive', mondayBoardId: '100003', description: 'Company-level strategic initiatives and follow-ups.' },
  ];

  for (const b of boards) {
    await prisma.planningBoard.upsert({ where: { boardKey: b.boardKey }, update: { ...b, status: 'Active', sourceSystem: 'Monday.com', raw: b as any }, create: { ...b, status: 'Active', sourceSystem: 'Monday.com', raw: b as any } });
  }

  const boardMap = Object.fromEntries((await prisma.planningBoard.findMany()).map(b => [b.boardKey, b]));
  const planningItems = [
    { itemKey: 'plan-07194-mobilization', boardId: boardMap['board-sdi-active-jobs']?.id, jobId: '07194-26-01', uniqueJob: '07194-26-01', title: 'Mobilize crew and equipment for 07194-26-01', status: 'In Progress', priority: 'High', ownerName: 'Operations Manager', startDate: daysFromNow(-3), dueDate: daysFromNow(4), completionPct: 65, riskLevel: 'Medium', mondayItemId: '200001' },
    { itemKey: 'plan-07193-invoice-review', boardId: boardMap['board-sdi-active-jobs']?.id, jobId: '07193-26-01', uniqueJob: '07193-26-01', title: 'Review high-value AP invoices for 07193-26-01', status: 'Planned', priority: 'High', ownerName: 'Accounting Lead', startDate: daysFromNow(0), dueDate: daysFromNow(3), completionPct: 20, riskLevel: 'High', mondayItemId: '200002' },
    { itemKey: 'plan-equipment-24-1134', boardId: boardMap['board-equipment-mobilization']?.id, jobId: '07194-26-01', uniqueJob: '07194-26-01', title: 'Assign truck 24-1134 and confirm availability', status: 'In Progress', priority: 'Normal', ownerName: 'Fleet Manager', startDate: daysFromNow(-1), dueDate: daysFromNow(2), completionPct: 50, riskLevel: 'Low', mondayItemId: '200003' },
    { itemKey: 'plan-exec-integration-roadmap', boardId: boardMap['board-executive-initiatives']?.id, jobId: null, uniqueJob: null, title: 'Finalize SDI One integration rollout roadmap', status: 'Planned', priority: 'Critical', ownerName: 'System Admin', startDate: daysFromNow(0), dueDate: daysFromNow(10), completionPct: 35, riskLevel: 'High', mondayItemId: '200004' },
  ];

  for (const item of planningItems) {
    await prisma.planningItem.upsert({ where: { itemKey: item.itemKey }, update: { ...item, sourceSystem: 'Monday.com', raw: item as any } as any, create: { ...item, sourceSystem: 'Monday.com', raw: item as any } as any });
  }

  const itemMap = Object.fromEntries((await prisma.planningItem.findMany()).map(i => [i.itemKey, i]));
  const tasks = [
    { taskKey: 'task-07194-crew', itemId: itemMap['plan-07194-mobilization']?.id, boardId: boardMap['board-sdi-active-jobs']?.id, jobId: '07194-26-01', title: 'Confirm crew assignments', status: 'Completed', taskType: 'Labor', assigneeName: 'Project Manager', startDate: daysFromNow(-3), dueDate: daysFromNow(-1), completedAt: daysFromNow(-1), percentDone: 100 },
    { taskKey: 'task-07194-equipment', itemId: itemMap['plan-07194-mobilization']?.id, boardId: boardMap['board-sdi-active-jobs']?.id, jobId: '07194-26-01', title: 'Stage equipment and tools', status: 'In Progress', taskType: 'Equipment', assigneeName: 'Equipment Manager', startDate: daysFromNow(-2), dueDate: daysFromNow(2), percentDone: 60 },
    { taskKey: 'task-07193-ap-review', itemId: itemMap['plan-07193-invoice-review']?.id, boardId: boardMap['board-sdi-active-jobs']?.id, jobId: '07193-26-01', title: 'Review vendor invoice variance', status: 'Not Started', taskType: 'Accounting', assigneeName: 'Accounting Lead', startDate: daysFromNow(0), dueDate: daysFromNow(3), percentDone: 0 },
    { taskKey: 'task-integration-api-list', itemId: itemMap['plan-exec-integration-roadmap']?.id, boardId: boardMap['board-executive-initiatives']?.id, jobId: null, title: 'Collect API credentials and owners', status: 'In Progress', taskType: 'Integration', assigneeName: 'System Admin', startDate: daysFromNow(0), dueDate: daysFromNow(7), percentDone: 30 },
  ];

  for (const task of tasks) {
    await prisma.planningTask.upsert({ where: { taskKey: task.taskKey }, update: { ...task, sourceSystem: 'Monday.com', raw: task as any } as any, create: { ...task, sourceSystem: 'Monday.com', raw: task as any } as any });
  }

  const assignments = [
    { assignmentKey: 'res-07194-pm', jobId: '07194-26-01', resourceType: 'Person', resourceName: 'Project Manager', plannedHours: 32, actualHours: 18, startDate: daysFromNow(-3), endDate: daysFromNow(7), status: 'Active' },
    { assignmentKey: 'res-07194-truck-24-1134', jobId: '07194-26-01', resourceType: 'Equipment', resourceName: '24-1134', resourceId: '24-1134', plannedHours: 64, actualHours: 22, startDate: daysFromNow(-2), endDate: daysFromNow(8), status: 'Active' },
    { assignmentKey: 'res-07193-accounting', jobId: '07193-26-01', resourceType: 'Person', resourceName: 'Accounting Lead', plannedHours: 12, actualHours: 2, startDate: daysFromNow(0), endDate: daysFromNow(3), status: 'Planned' },
  ];
  for (const assignment of assignments) {
    await prisma.resourceAssignment.upsert({ where: { assignmentKey: assignment.assignmentKey }, update: { ...assignment, sourceSystem: 'SDI One', raw: assignment as any } as any, create: { ...assignment, sourceSystem: 'SDI One', raw: assignment as any } as any });
  }

  await prisma.planningDependency.upsert({ where: { dependencyKey: 'dep-07194-crew-before-equipment' }, update: { predecessorKey: 'task-07194-crew', successorKey: 'task-07194-equipment', status: 'Active' }, create: { dependencyKey: 'dep-07194-crew-before-equipment', predecessorKey: 'task-07194-crew', successorKey: 'task-07194-equipment', status: 'Active' } });
}

async function main() {
  await seedMondayConnector();
  await seedPlanningData();
  console.log('Seeded v1.5 Monday.com and project planning readiness.');
}

main().finally(() => prisma.$disconnect());
