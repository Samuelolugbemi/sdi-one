export const fordProObjectCatalog = [
  { key: 'ford_vehicle', sourceObject: 'Ford Pro Vehicles', targetEntity: 'FleetVehicle', externalId: 'vin', readiness: 'credential-ready' },
  { key: 'ford_odometer', sourceObject: 'Ford Pro Odometer', targetEntity: 'TelematicsSnapshot', externalId: 'vin+capturedAt', readiness: 'credential-ready' },
  { key: 'ford_diagnostics', sourceObject: 'Ford Pro Diagnostics', targetEntity: 'MaintenanceAlert', externalId: 'faultCode+vin+capturedAt', readiness: 'credential-ready' },
  { key: 'ford_location', sourceObject: 'Ford Pro Location', targetEntity: 'TelematicsSnapshot', externalId: 'vin+capturedAt', readiness: 'credential-ready' },
];
