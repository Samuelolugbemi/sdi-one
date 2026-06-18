export const fuelSystemObjectCatalog = [
  { key: 'fuel_transaction', sourceObject: 'Fuel Card Transactions', targetEntity: 'FuelTransaction', externalId: 'transactionId', readiness: 'file/API-ready' },
  { key: 'fuel_card', sourceObject: 'Fuel Cards', targetEntity: 'FleetVehicle', externalId: 'cardNumber', readiness: 'file/API-ready' },
  { key: 'fuel_exception', sourceObject: 'Fuel Exceptions', targetEntity: 'MaintenanceAlert', externalId: 'exceptionId', readiness: 'file/API-ready' },
];
