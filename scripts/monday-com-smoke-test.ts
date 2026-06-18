import { prisma } from '../lib/prisma';

async function main() {
  const connector = await prisma.integrationConnector.findUnique({ where: { key: 'monday-com' }, include: { mappings: true } });
  const boards = await prisma.planningBoard.count();
  const items = await prisma.planningItem.count();
  const tasks = await prisma.planningTask.count();
  console.log({ connector: connector?.name, mappings: connector?.mappings.length ?? 0, boards, items, tasks });
}

main().finally(() => prisma.$disconnect());
