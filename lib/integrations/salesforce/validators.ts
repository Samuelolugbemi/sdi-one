import type { SalesforceCredentialStatus } from './types';

const oauthVariables = ['SALESFORCE_CLIENT_ID', 'SALESFORCE_CLIENT_SECRET'];
const usernamePasswordVariables = ['SALESFORCE_USERNAME', 'SALESFORCE_PASSWORD', 'SALESFORCE_SECURITY_TOKEN'];

export function getSalesforceCredentialStatus(): SalesforceCredentialStatus {
  const oauthMissing = oauthVariables.filter((key) => !process.env[key]);
  const userMissing = usernamePasswordVariables.filter((key) => !process.env[key]);
  const hasInstance = Boolean(process.env.SALESFORCE_INSTANCE_URL);

  const configured = (oauthMissing.length === 0 || userMissing.length === 0) && hasInstance;
  const missing = [...new Set([...oauthMissing, ...userMissing, ...(hasInstance ? [] : ['SALESFORCE_INSTANCE_URL'])])];

  return {
    configured,
    missing,
    authMode: configured
      ? oauthMissing.length === 0
        ? 'oauth-client-credentials'
        : 'username-password'
      : 'manual-export',
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL || 'not-configured',
    apiVersion: process.env.SALESFORCE_API_VERSION || '64.0',
  };
}

export function validateSalesforceObjectConfig(sourceKey: string, fields: string[], requiredFields: string[]) {
  const missing = requiredFields.filter((field) => !fields.includes(field));
  return { sourceKey, valid: missing.length === 0, missing, fields };
}
