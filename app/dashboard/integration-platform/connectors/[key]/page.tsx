import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../../lib/prisma';
import { PageHeader } from '../../../../../components/ui/PageHeader';
import { KpiCard } from '../../../../../components/ui/KpiCard';
import { SimpleTable } from '../../../../../components/ui/SimpleTable';
import { StatusBadge } from '../../../../../components/ui/StatusBadge';

export default async function ConnectorDetailPage({ params }: { params: { key: string } }) {
  const connector = await prisma.integrationConnector.findUnique({ where: { key: params.key }, include: { mappings: true, runs: { orderBy: { startedAt: 'desc' }, take: 20 }, logs: { orderBy: { createdAt: 'desc' }, take: 20 } } });
  if (!connector) notFound();
  return <>
    <PageHeader title={connector.name} description={connector.description ?? 'Integration connector workspace.'} />
    <div className="grid gap-4 md:grid-cols-4">
      <KpiCard label="Status" value={connector.status} tone="blue" />
      <KpiCard label="Mappings" value={String(connector.mappings.length)} tone="green" />
      <KpiCard label="Runs" value={String(connector.runs.length)} tone="slate" />
      <KpiCard label="Enabled" value={connector.enabled ? 'Yes' : 'No'} tone="amber" />
    </div>

    {connector.key === 'sage-intacct' && <div className="mt-6 card p-5">
      <div className="section-title">Sage Intacct v1.1 Workbench</div>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/sage-intacct/configure">Configure</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/sage-intacct/objects">Objects</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/sage-intacct/mappings">Mappings</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/sage-intacct/sync">Sync Plan</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/sage-intacct/logs">Runs & Logs</Link>
      </div>
    </div>}



    {connector.key === 'point-of-rental' && <div className="mt-6 card p-5">
      <div className="section-title">Point of Rental v1.3 Workbench</div>
      <div className="mt-4 grid gap-3 md:grid-cols-6">
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/point-of-rental/configure">Configure</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/point-of-rental/objects">Objects</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/point-of-rental/mappings">Mappings</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/point-of-rental/equipment-costs">Equipment Costs</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/point-of-rental/sync">Sync Plan</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/point-of-rental/logs">Runs & Logs</Link>
      </div>
    </div>}
    {connector.key === 'salesforce' && <div className="mt-6 card p-5">
      <div className="section-title">Salesforce v1.2 Workbench</div>
      <div className="mt-4 grid gap-3 md:grid-cols-6">
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/salesforce/configure">Configure</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/salesforce/oauth">OAuth</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/salesforce/objects">Objects</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/salesforce/mappings">Mappings</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/salesforce/sync">Sync Plan</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/salesforce/logs">Runs & Logs</Link>
      </div>
    </div>}


    {connector.key === 'ford-pro' && <div className="mt-6 card p-5">
      <div className="section-title">Ford Pro v1.4 Workbench</div>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/ford-pro/configure">Configure</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/ford-pro/vehicles">Vehicles</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/ford-pro/telematics">Telematics</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/ford-pro/sync">Sync Plan</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/ford-pro/logs">Runs & Logs</Link>
      </div>
    </div>}
    {connector.key === 'fuel-system' && <div className="mt-6 card p-5">
      <div className="section-title">Fuel System v1.4 Workbench</div>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/fuel-system/configure">Configure</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/fuel-system/transactions">Transactions</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/fuel-system/cards">Cards</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/fuel-system/sync">Sync Plan</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/fuel-system/logs">Runs & Logs</Link>
      </div>
    </div>}
    {connector.key === 'geotab' && <div className="mt-6 card p-5">
      <div className="section-title">Geotab v1.4 Workbench</div>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/geotab/configure">Configure</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/geotab/devices">Devices</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/geotab/trips">Trips & Status</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/geotab/sync">Sync Plan</Link>
        <Link className="btn btn-soft" href="/dashboard/integration-platform/connectors/geotab/logs">Runs & Logs</Link>
      </div>
    </div>}
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <div><h2 className="mb-3 text-xl font-black">Field Mappings</h2><SimpleTable rows={connector.mappings} columns={[{ key: 'sourceObject', label: 'Source Object' }, { key: 'targetEntity', label: 'Target Entity' }, { key: 'enabled', label: 'Status', render: r => <StatusBadge value={r.enabled ? 'Enabled' : 'Disabled'} /> }]} /></div>
      <div><h2 className="mb-3 text-xl font-black">Recent Runs</h2><SimpleTable rows={connector.runs} columns={[{ key: 'runType', label: 'Run Type' }, { key: 'status', label: 'Status', render: r => <StatusBadge value={r.status} /> }, { key: 'recordsRead', label: 'Read' }, { key: 'recordsWritten', label: 'Written' }, { key: 'recordsFailed', label: 'Failed' }]} /></div>
    </div>
  </>;
}
