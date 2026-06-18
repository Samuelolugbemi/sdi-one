import { PageHeader } from '../../../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../../components/ui/StatusBadge';
import { prisma } from '../../../../../../lib/prisma';

export default async function PorLogsPage() {
  const connector = await prisma.integrationConnector.findUnique({ where: { key: 'point-of-rental' }, include: { runs: { orderBy: { startedAt: 'desc' }, take: 25 }, logs: { orderBy: { createdAt: 'desc' }, take: 25 } } });
  return <>
    <PageHeader title="POR Runs & Logs" description="Connector monitoring for equipment master, repair cost and rental availability flows." />
    <div className="grid gap-6 xl:grid-cols-2">
      <div><h2 className="mb-3 text-xl font-black">Runs</h2><SimpleTable rows={connector?.runs ?? []} columns={[{ key: 'runType', label: 'Run Type' }, { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }, { key: 'recordsRead', label: 'Read' }, { key: 'recordsWritten', label: 'Written' }, { key: 'recordsFailed', label: 'Failed' }]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Logs</h2><SimpleTable rows={connector?.logs ?? []} columns={[{ key: 'level', label: 'Level', render: r => <StatusBadge value={r.level} /> }, { key: 'message', label: 'Message' }]} /></div>
    </div>
  </>;
}
