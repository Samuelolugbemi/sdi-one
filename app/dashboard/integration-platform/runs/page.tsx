import { prisma } from '../../../../lib/prisma';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { SimpleTable } from '../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../components/ui/StatusBadge';

export default async function IntegrationRunsPage() {
  const runs = await prisma.integrationRun.findMany({ include: { connector: true }, orderBy: { startedAt: 'desc' }, take: 100 });
  return <>
    <PageHeader title="Sync Monitoring" description="Central monitoring for connector runs, imports, retries, and integration health." />
    <SimpleTable rows={runs} columns={[
      { key: 'connector', label: 'Connector', render: r => r.connector.name },
      { key: 'runType', label: 'Type' },
      { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> },
      { key: 'recordsRead', label: 'Read' },
      { key: 'recordsWritten', label: 'Written' },
      { key: 'recordsFailed', label: 'Failed' },
      { key: 'message', label: 'Message' },
    ]} />
  </>;
}
