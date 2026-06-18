import { prisma } from '../lib/prisma';
import { fleetConnectorDefinitions } from '../lib/integrations/fleet-connectors';

function companyFromUnit(unitNumber: string) {
  return unitNumber.includes('-') ? unitNumber.split('-')[0] : null;
}

async function upsertMapping(connectorId: number, sourceObject: string, targetEntity: string, fieldMap: any, transformRules: any) {
  const existing = await prisma.integrationMapping.findFirst({ where: { connectorId, sourceObject, targetEntity } });
  if (existing) return prisma.integrationMapping.update({ where: { id: existing.id }, data: { fieldMap, transformRules, enabled: true } as any });
  return prisma.integrationMapping.create({ data: { connectorId, sourceObject, targetEntity, fieldMap, transformRules, enabled: true } as any });
}

async function seedConnectors() {
  for (const definition of fleetConnectorDefinitions) {
    const connector = await prisma.integrationConnector.upsert({
      where: { key: definition.key },
      update: {
        name: definition.name,
        system: definition.system,
        category: definition.category,
        status: 'Credential-ready / model-ready',
        authType: definition.authType,
        enabled: true,
        description: definition.description,
        config: { objects: definition.objects, v: '1.4' } as any,
      },
      create: {
        key: definition.key,
        name: definition.name,
        system: definition.system,
        category: definition.category,
        status: 'Credential-ready / model-ready',
        authType: definition.authType,
        enabled: true,
        description: definition.description,
        config: { objects: definition.objects, v: '1.4' } as any,
      },
    });

    for (const object of definition.objects) {
      await upsertMapping(connector.id, object.sourceObject, object.targetEntity, {
        sourceKey: object.externalId,
        targetEntity: object.targetEntity,
        ownerCompanyRule: 'first segment of unit/equipment number before dash',
      }, object);
    }

    await prisma.integrationRun.create({
      data: {
        connectorId: connector.id,
        runType: 'v1.4 fleet connector readiness seed',
        status: 'Completed',
        recordsRead: definition.objects.length,
        recordsWritten: definition.objects.length,
        recordsFailed: 0,
        message: `${definition.name} connector metadata seeded for fleet intelligence.`,
        metrics: { objects: definition.objects.length, readiness: 'awaiting production credentials' } as any,
      },
    });
  }
}

async function seedFleetData() {
  const vehicles = [
    { unitNumber: '24-1134', equipmentId: '24-1134', vin: '1FDUF5HT0SDI241134', make: 'Ford', model: 'F-550', modelYear: 2022, status: 'Active', currentJobId: '07194-26-01', odometerMiles: 84215.4, engineHours: 3120.5, fuelCostMtd: 3248.72, fuelGallonsMtd: 612.3, mpg: 8.8, utilizationPct: 72.5, lastLocation: 'Akron, OH', healthStatus: 'Attention', sourceSystem: 'Ford Pro / Fuel System' },
    { unitNumber: '26-2077', equipmentId: '26-2077', vin: '1FD0W5HT0SDI262077', make: 'Ford', model: 'F-450', modelYear: 2021, status: 'In Use', currentJobId: '07193-26-01', odometerMiles: 102441.9, engineHours: 3984.2, fuelCostMtd: 2871.66, fuelGallonsMtd: 533.0, mpg: 9.2, utilizationPct: 81.1, lastLocation: 'Charleston, WV', healthStatus: 'Healthy', sourceSystem: 'Geotab / Fuel System' },
    { unitNumber: '58-0188', equipmentId: '58-0188', vin: '1FT8W3DT0SDI580188', make: 'Ford', model: 'F-350', modelYear: 2023, status: 'Active', currentJobId: '07009-58-01', odometerMiles: 31428.2, engineHours: 1188.8, fuelCostMtd: 1322.41, fuelGallonsMtd: 245.9, mpg: 10.5, utilizationPct: 64.0, lastLocation: 'Pittsburgh, PA', healthStatus: 'Healthy', sourceSystem: 'Ford Pro' },
    { unitNumber: '24-1566', equipmentId: '24-1566', vin: '1FDXF46P0SDI241566', make: 'Ford', model: 'Service Truck', modelYear: 2019, status: 'Repair', currentJobId: null, odometerMiles: 126002.0, engineHours: 5021.4, fuelCostMtd: 508.12, fuelGallonsMtd: 96.4, mpg: 7.7, utilizationPct: 22.5, lastLocation: 'SDI Yard', healthStatus: 'Critical', sourceSystem: 'Fleet Manual' },
  ];

  for (const v of vehicles) {
    await prisma.fleetVehicle.upsert({
      where: { unitNumber: v.unitNumber },
      update: { ...v, ownerCompanyId: companyFromUnit(v.unitNumber), lastSeenAt: new Date(), raw: v as any } as any,
      create: { ...v, ownerCompanyId: companyFromUnit(v.unitNumber), lastSeenAt: new Date(), raw: v as any } as any,
    });
  }

  const allVehicles = await prisma.fleetVehicle.findMany();
  const byUnit = Object.fromEntries(allVehicles.map(v => [v.unitNumber, v]));

  const fuelRows = [
    ['fuel-24-1134-001', '24-1134', 'Speedway', 64.1, 351.43, 'Diesel', 'Akron, OH'],
    ['fuel-26-2077-001', '26-2077', 'Pilot', 71.6, 389.91, 'Diesel', 'Charleston, WV'],
    ['fuel-58-0188-001', '58-0188', 'Sheetz', 48.0, 251.08, 'Diesel', 'Pittsburgh, PA'],
    ['fuel-24-1566-001', '24-1566', 'Marathon', 32.3, 172.58, 'Diesel', 'SDI Yard'],
  ];
  for (const [key, unit, vendor, gallons, amount, fuelType, location] of fuelRows as any[]) {
    await prisma.fuelTransaction.upsert({
      where: { transactionKey: key },
      update: { vehicleId: byUnit[unit]?.id, unitNumber: unit, vendorName: vendor, gallons, amount, fuelType, location, transactionDate: new Date(), costPerGallon: amount / gallons, sourceSystem: 'Fuel System' } as any,
      create: { transactionKey: key, vehicleId: byUnit[unit]?.id, unitNumber: unit, vendorName: vendor, gallons, amount, fuelType, location, transactionDate: new Date(), costPerGallon: amount / gallons, sourceSystem: 'Fuel System' } as any,
    });
  }

  for (const v of allVehicles) {
    await prisma.telematicsSnapshot.upsert({
      where: { snapshotKey: `telematics-${v.unitNumber}-latest` },
      update: { vehicleId: v.id, unitNumber: v.unitNumber, sourceSystem: v.sourceSystem?.includes('Geotab') ? 'Geotab' : 'Ford Pro', latitude: 40.0 + v.id / 100, longitude: -81.0 - v.id / 100, speedMph: v.status === 'In Use' ? 42.5 : 0, odometerMiles: v.odometerMiles, engineHours: v.engineHours, isCommunicating: v.status !== 'Repair', currentState: v.status, faultCount: v.healthStatus === 'Critical' ? 4 : v.healthStatus === 'Attention' ? 1 : 0, capturedAt: new Date() } as any,
      create: { snapshotKey: `telematics-${v.unitNumber}-latest`, vehicleId: v.id, unitNumber: v.unitNumber, sourceSystem: v.sourceSystem?.includes('Geotab') ? 'Geotab' : 'Ford Pro', latitude: 40.0 + v.id / 100, longitude: -81.0 - v.id / 100, speedMph: v.status === 'In Use' ? 42.5 : 0, odometerMiles: v.odometerMiles, engineHours: v.engineHours, isCommunicating: v.status !== 'Repair', currentState: v.status, faultCount: v.healthStatus === 'Critical' ? 4 : v.healthStatus === 'Attention' ? 1 : 0, capturedAt: new Date() } as any,
    });
  }

  const alerts = [
    { alertKey: 'maint-24-1134-oil', unitNumber: '24-1134', severity: 'Medium', status: 'Open', category: 'Preventive Maintenance', title: 'Oil service due soon', description: 'Vehicle is within service threshold based on mileage and engine hours.' },
    { alertKey: 'maint-24-1566-critical', unitNumber: '24-1566', severity: 'Critical', status: 'Open', category: 'Diagnostics', title: 'Truck in repair status', description: 'Unit is not currently available. Review repair cost and availability impact.' },
    { alertKey: 'maint-26-2077-tires', unitNumber: '26-2077', severity: 'Low', status: 'Open', category: 'Inspection', title: 'Tire inspection recommended', description: 'High utilization vehicle should be inspected at next yard return.' },
  ];
  for (const a of alerts) {
    const vehicle = byUnit[a.unitNumber];
    await prisma.maintenanceAlert.upsert({ where: { alertKey: a.alertKey }, update: { ...a, vehicleId: vehicle?.id } as any, create: { ...a, vehicleId: vehicle?.id } as any });
  }
}

async function main() {
  await seedConnectors();
  await seedFleetData();
  console.log('Seeded v1.4 fleet, Ford Pro, Fuel System and Geotab readiness.');
}

main().finally(() => prisma.$disconnect());
