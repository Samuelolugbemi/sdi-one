export const geotabObjectCatalog = [
  { key: 'geotab_device', sourceObject: 'Geotab Devices', targetEntity: 'FleetVehicle', externalId: 'deviceId', readiness: 'credential-ready' },
  { key: 'geotab_status', sourceObject: 'Geotab Status Data', targetEntity: 'TelematicsSnapshot', externalId: 'deviceId+dateTime', readiness: 'credential-ready' },
  { key: 'geotab_fault', sourceObject: 'Geotab Fault Data', targetEntity: 'MaintenanceAlert', externalId: 'deviceId+faultCode+dateTime', readiness: 'credential-ready' },
  { key: 'geotab_trip', sourceObject: 'Geotab Trips', targetEntity: 'TelematicsSnapshot', externalId: 'tripId', readiness: 'credential-ready' },
];
