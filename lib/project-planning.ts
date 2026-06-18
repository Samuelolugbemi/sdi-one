import { prisma } from './prisma';

function toNumber(value: unknown) {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function getProjectPlanningDashboard() {
  const [boards, items, tasks, assignments] = await Promise.all([
    prisma.planningBoard.findMany({ include: { items: true, tasks: true }, orderBy: { name: 'asc' } }),
    prisma.planningItem.findMany({ orderBy: [{ riskLevel: 'desc' }, { dueDate: 'asc' }], take: 100 }),
    prisma.planningTask.findMany({ orderBy: [{ dueDate: 'asc' }], take: 100 }),
    prisma.resourceAssignment.findMany({ orderBy: [{ startDate: 'asc' }], take: 100 }),
  ]);

  const atRisk = items.filter(i => ['High', 'Critical'].includes(i.riskLevel ?? '')).length;
  const overdue = tasks.filter(t => t.dueDate && t.status !== 'Completed' && t.dueDate < new Date()).length;
  const plannedHours = assignments.reduce((sum, a) => sum + toNumber(a.plannedHours), 0);
  const actualHours = assignments.reduce((sum, a) => sum + toNumber(a.actualHours), 0);
  const avgCompletion = items.length ? items.reduce((sum, i) => sum + toNumber(i.completionPct), 0) / items.length : 0;

  return {
    boards,
    items,
    tasks,
    assignments,
    metrics: {
      totalBoards: boards.length,
      totalItems: items.length,
      totalTasks: tasks.length,
      atRisk,
      overdue,
      plannedHours,
      actualHours,
      avgCompletion,
    },
  };
}

export async function getMondayConnectorDashboard() {
  const connector = await prisma.integrationConnector.findUnique({
    where: { key: 'monday-com' },
    include: { mappings: true, runs: { orderBy: { startedAt: 'desc' }, take: 20 }, logs: { orderBy: { createdAt: 'desc' }, take: 20 } },
  });
  const boards = await prisma.planningBoard.findMany({ include: { items: true }, take: 20 });
  return { connector, mappings: connector?.mappings ?? [], runs: connector?.runs ?? [], logs: connector?.logs ?? [], boards };
}
