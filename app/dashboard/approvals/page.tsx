import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { SimpleTable, RecordLink } from '@/components/ui/SimpleTable';
import { prisma } from '@/lib/prisma';
import { date } from '@/lib/format';

export default async function ApprovalsPage() {
  const approvals = await prisma.approvalRequest.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);
  return <AppShell><PageHeader eyebrow="Milestone 1" title="Approval Center" description="Central queue for invoice approvals, job exceptions, equipment exceptions and future workflow approvals." />
    <SimpleTable rows={approvals} columns={[{key:'status', label:'Status'},{key:'title', label:'Request'},{key:'entityKey', label:'Record', render:r=>r.entityType && r.entityKey ? <RecordLink href={`/dashboard/workspaces/${r.entityType}/${r.entityKey}`}>{r.entityType}:{r.entityKey}</RecordLink> : '—'},{key:'assignedTo', label:'Assigned To'},{key:'createdAt', label:'Created', render:r=>date(r.createdAt)}]} empty="No approval requests yet." />
  </AppShell>;
}
