import type { SageIntacctCredentialStatus } from './types';

const requiredApiVariables = [
  'INTACCT_COMPANY_ID',
  'INTACCT_USER_ID',
  'INTACCT_USER_PASSWORD',
  'INTACCT_SENDER_ID',
  'INTACCT_SENDER_PASSWORD',
];

export function getSageCredentialStatus(): SageIntacctCredentialStatus {
  const missing = requiredApiVariables.filter((key) => !process.env[key]);
  return {
    configured: missing.length === 0,
    missing,
    authMode: missing.length === 0 ? 'xml-api-session' : 'csv-import',
    endpoint: process.env.INTACCT_API_ENDPOINT || 'https://api.intacct.com/ia/xml/xmlgw.phtml',
  };
}

export function validateCsvHeaders(sourceKey: string, headers: string[], requiredFields: string[]) {
  const missing = requiredFields.filter((field) => !headers.includes(field));
  return {
    sourceKey,
    valid: missing.length === 0,
    missing,
    headers,
  };
}
