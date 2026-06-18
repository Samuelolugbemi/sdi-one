import { getSageCredentialStatus } from './validators';

export type SageApiRequest = {
  controlId: string;
  functionXml: string;
};

export function buildSageXmlEnvelope(request: SageApiRequest) {
  const endpoint = getSageCredentialStatus();
  const senderId = process.env.INTACCT_SENDER_ID || 'SENDER_ID_NOT_CONFIGURED';
  const senderPassword = process.env.INTACCT_SENDER_PASSWORD || 'SENDER_PASSWORD_NOT_CONFIGURED';
  const companyId = process.env.INTACCT_COMPANY_ID || 'COMPANY_ID_NOT_CONFIGURED';
  const userId = process.env.INTACCT_USER_ID || 'USER_ID_NOT_CONFIGURED';
  const userPassword = process.env.INTACCT_USER_PASSWORD || 'USER_PASSWORD_NOT_CONFIGURED';

  return {
    endpoint: endpoint.endpoint,
    configured: endpoint.configured,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <control>
    <senderid>${senderId}</senderid>
    <password>${senderPassword}</password>
    <controlid>${request.controlId}</controlid>
    <uniqueid>false</uniqueid>
    <dtdversion>3.0</dtdversion>
  </control>
  <operation>
    <authentication>
      <login>
        <userid>${userId}</userid>
        <companyid>${companyId}</companyid>
        <password>${userPassword}</password>
      </login>
    </authentication>
    <content>
      <function controlid="${request.controlId}">
        ${request.functionXml}
      </function>
    </content>
  </operation>
</request>`,
  };
}

export function buildReadByQueryXml(objectName: string, fields: string[], query = '', pagesize = 100) {
  return `<readByQuery>
  <object>${objectName}</object>
  <fields>${fields.join(',')}</fields>
  <query>${query}</query>
  <pagesize>${pagesize}</pagesize>
</readByQuery>`;
}
