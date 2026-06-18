import { getPorCredentialStatus } from './validators';

export function buildPorFilePaths() {
  const status = getPorCredentialStatus();
  return {
    inboundEquipment: `${status.exportFolder}\\por-equipment.csv`,
    inboundRepairCosts: `${status.exportFolder}\\por-repair-costs.csv`,
    inboundRentalHistory: `${status.exportFolder}\\por-rental-history.csv`,
    outboundCostUpdates: `${status.importFolder}\\sdi-equipment-cost-updates.csv`,
  };
}

export function buildPorSmokeTest() {
  const status = getPorCredentialStatus();
  return {
    configured: status.configured,
    mode: status.mode,
    folders: buildPorFilePaths(),
    message: status.configured
      ? 'POR bridge configuration values are present.'
      : 'POR bridge is not fully configured. Local connector metadata is still ready.',
  };
}
