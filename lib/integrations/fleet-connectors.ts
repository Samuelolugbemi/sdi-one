import { fordProObjectCatalog } from './ford-pro/object-catalog';
import { fuelSystemObjectCatalog } from './fuel-system/object-catalog';
import { geotabObjectCatalog } from './geotab/object-catalog';

export const fleetConnectorDefinitions = [
  {
    key: 'ford-pro',
    name: 'Ford Pro',
    system: 'Ford Pro',
    category: 'Fleet / OEM Telematics',
    authType: 'OAuth 2.0 / API credentials',
    description: 'Ford Pro vehicle, odometer, location and diagnostic connector for fleet intelligence.',
    objects: fordProObjectCatalog,
  },
  {
    key: 'fuel-system',
    name: 'Fuel System',
    system: 'Fuel System',
    category: 'Fleet / Fuel',
    authType: 'CSV/API import',
    description: 'Fuel transaction, card, exception and fuel cost connector for vehicle profitability.',
    objects: fuelSystemObjectCatalog,
  },
  {
    key: 'geotab',
    name: 'Geotab',
    system: 'Geotab',
    category: 'Fleet / Telematics',
    authType: 'API credentials',
    description: 'Geotab device, GPS, status, fault and trip connector for live fleet telemetry.',
    objects: geotabObjectCatalog,
  },
];
