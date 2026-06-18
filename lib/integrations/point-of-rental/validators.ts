const REQUIRED_KEYS = ['POR_IMPORT_FOLDER', 'POR_EXPORT_FOLDER', 'POR_MODE'];

export function getPorCredentialStatus() {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  const mode = (process.env.POR_MODE || 'csv-drop-folder') as 'csv-drop-folder' | 'odbc-readonly' | 'api-future';
  return {
    configured: missing.length === 0,
    missing,
    mode,
    importFolder: process.env.POR_IMPORT_FOLDER || 'C:\\POR\\imports',
    exportFolder: process.env.POR_EXPORT_FOLDER || 'C:\\POR\\exports',
    odbcDsn: process.env.POR_ODBC_DSN || 'Not configured',
  };
}

export function validatePorEquipmentId(value: string) {
  return /^\d{2}-[A-Za-z0-9]+$/.test(value);
}

export function derivePorEquipmentOwnerCompany(equipmentId: string) {
  return equipmentId?.split('-')?.[0] || null;
}
