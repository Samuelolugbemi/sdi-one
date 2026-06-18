import { getSalesforceCredentialStatus } from './validators';

export type SalesforceSoqlRequest = {
  objectName: string;
  fields: string[];
  where?: string;
  limit?: number;
};

export function buildSalesforceRestUrl(path: string) {
  const status = getSalesforceCredentialStatus();
  const base = status.instanceUrl === 'not-configured' ? 'https://instance.my.salesforce.com' : status.instanceUrl;
  return `${base}/services/data/v${status.apiVersion}${path}`;
}

export function buildSalesforceSoql({ objectName, fields, where, limit = 100 }: SalesforceSoqlRequest) {
  const query = `SELECT ${fields.join(', ')} FROM ${objectName}${where ? ` WHERE ${where}` : ''} LIMIT ${limit}`;
  return {
    query,
    url: buildSalesforceRestUrl(`/query?q=${encodeURIComponent(query)}`),
  };
}

export function buildSalesforceUpsertUrl(objectName: string, externalIdField: string, externalIdValue: string) {
  return buildSalesforceRestUrl(`/sobjects/${objectName}/${externalIdField}/${encodeURIComponent(externalIdValue)}`);
}
