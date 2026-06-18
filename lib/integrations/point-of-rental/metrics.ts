import { prisma } from '../../prisma';

export async function getPorEquipmentMetrics() {
  const [equipmentCount, repairCandidates, activeEquipment] = await Promise.all([
    prisma.equipment.count(),
    prisma.equipment.count({ where: { status: { contains: 'repair', mode: 'insensitive' } } }).catch(() => 0),
    prisma.equipment.count({ where: { status: { contains: 'active', mode: 'insensitive' } } }).catch(() => 0),
  ]);

  return {
    equipmentCount,
    activeEquipment,
    repairCandidates,
    readiness: equipmentCount > 0 ? 'Ready for POR enrichment' : 'Awaiting equipment import',
  };
}
