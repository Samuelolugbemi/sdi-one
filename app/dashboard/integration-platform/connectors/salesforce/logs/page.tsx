import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { prisma } from '../../../../../../lib/prisma';

export default async function SalesforceLogsPage() {
  const connector = await prisma.integrationConnector.findUnique({ where: { key: 'salesforce' }, include: { runs: { orderBy: { startedAt: 'desc' }, take: 25 }, logs: { orderBy: { createdAt: 'desc' }, take: 25 } } });
  const runs = connector?.runs ?? [];
  const logs = connector?.logs ?? [];
  return <>
    <PageHeader title="Salesforce Runs & Logs" description="Operational monitoring for Salesforce sync readiness, Data Loader bridge migration and API runs." />
    <div className="grid gap-6 xl:grid-cols-2">
      <div><h2 className="mb-3 text-xl font-black">Runs</h2><SimpleTable rows={runs as any[]} columns={[{ key: 'runType', label: 'Run Type' }, { key: 'status', label: 'Status', render: row => <StatusBadge value={row.status} /> }, { key: 'recordsRead', label: 'Read' }, { key: 'recordsWritten', label: 'Written' }, { key: 'recordsFailed', label: 'Failed' }]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Logs</h2><SimpleTable rows={logs as any[]} columns={[{ key: 'level', label: 'Level', render: row => <StatusBadge value={row.level} /> }, { key: 'message', label: 'Message' }, { key: 'createdAt', label: 'Created' }]} /></div>
    </div>
  </>;
}
