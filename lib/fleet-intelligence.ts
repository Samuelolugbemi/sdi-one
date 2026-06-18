import { prisma } from './prisma';

export async function getFleetDashboard() {
  const [vehicles, fuel, alerts, telematics] = await Promise.all([
    prisma.fleetVehicle.findMany({ orderBy: [{ healthStatus: 'asc' }, { unitNumber: 'asc' }], take: 100 }),
    prisma.fuelTransaction.findMany({ orderBy: { transactionDate: 'desc' }, take: 100 }),
    prisma.maintenanceAlert.findMany({ orderBy: [{ status: 'asc' }, { severity: 'desc' }, { createdAt: 'desc' }], take: 100 }),
    prisma.telematicsSnapshot.findMany({ orderBy: { capturedAt: 'desc' }, take: 100 }),
  ]);

  const totalFuelCost = fuel.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const totalGallons = fuel.reduce((sum, row) => sum + Number(row.gallons ?? 0), 0);
  const activeVehicles = vehicles.filter(v => ['Active', 'In Use', 'Assigned'].includes(v.status)).length;
  const openAlerts = alerts.filter(a => a.status !== 'Resolved').length;
  const communicating = telematics.filter(t => t.isCommunicating).length;

  return { vehicles, fuel, alerts, telematics, metrics: { totalVehicles: vehicles.length, activeVehicles, totalFuelCost, totalGallons, openAlerts, communicating } };
}

export function ownerCompanyFromUnit(unitNumber?: string | null) {
  if (!unitNumber || !unitNumber.includes('-')) return null;
  return unitNumber.split('-')[0];
}
