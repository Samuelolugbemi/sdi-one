import { getSageCredentialStatus } from '../lib/integrations/sage-intacct/validators';
import { buildSageXmlEnvelope, buildReadByQueryXml } from '../lib/integrations/sage-intacct/client';

const status = getSageCredentialStatus();
console.log('Sage Intacct credential status:', status);
const envelope = buildSageXmlEnvelope({
  controlId: `sdi-one-smoke-${Date.now()}`,
  functionXml: buildReadByQueryXml('CUSTOMER', ['CUSTOMERID', 'NAME'], '', 1),
});
console.log('Endpoint:', envelope.endpoint);
console.log('Configured:', envelope.configured);
console.log('Sample XML envelope generated. Credentials are not printed.');
