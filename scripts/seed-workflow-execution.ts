
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function upsertStep(workflowKey: string, stepKey: string, name: string, stepType: string, sortOrder: number, description?: string) {
  await prisma.workflowStepTemplate.upsert({
    where: { workflowKey_stepKey: { workflowKey, stepKey } },
    update: { name, stepType, sortOrder, description, enabled: true },
    create: { workflowKey, stepKey, name, stepType, sortOrder, description, enabled: true },
  });
}

async function upsertAction(workflowKey: string, stepKey: string, actionKey: string, name: string, actionType: string, description?: string, config: any = {}) {
  await prisma.workflowActionTemplate.upsert({
    where: { workflowKey_stepKey_actionKey: { workflowKey, stepKey, actionKey } },
    update: { name, actionType, description, config, enabled: true },
    create: { workflowKey, stepKey, actionKey, name, actionType, description, config, enabled: true },
  });
}

async function main() {
  const workflowKey = 'invoice-approval-flow';
  await prisma.workflowDefinition.upsert({
    where: { key: workflowKey },
    update: { name: 'Invoice Approval Flow', triggerType: 'invoice.imported', enabled: true },
    create: { key: workflowKey, name: 'Invoice Approval Flow', description: 'Routes imported AP bills through review, approval, notification, and timeline updates.', triggerType: 'invoice.imported', enabled: true, config: { version: '0.9' } },
  });

  await upsertStep(workflowKey, 'trigger', 'Invoice Imported', 'Trigger', 1, 'Starts when an AP bill or invoice enters SDI One.');
  await upsertStep(workflowKey, 'evaluate', 'Evaluate Amount and Job Rules', 'Condition', 2, 'Checks amount, job, company, vendor, and exception rules.');
  await upsertStep(workflowKey, 'accounting-review', 'Accounting Review', 'Approval', 3, 'Accounting validates invoice coding and job allocation.');
  await upsertStep(workflowKey, 'company-approval', 'Company / Project Approval', 'Approval', 4, 'Company admin or project manager approves high-impact spend.');
  await upsertStep(workflowKey, 'complete', 'Complete and Notify', 'Action', 5, 'Creates timeline event, notifications, and integration queue records.');

  await upsertAction(workflowKey, 'trigger', 'timeline-start', 'Record invoice workflow started', 'CreateTimelineEvent', 'Adds a timeline event to the invoice or job.');
  await upsertAction(workflowKey, 'evaluate', 'notify-exception', 'Notify exception owner', 'CreateNotification', 'Alerts accounting when the invoice needs review.');
  await upsertAction(workflowKey, 'accounting-review', 'task-accounting', 'Create accounting review task', 'CreateTask', 'Creates a task for accounting review.', { role: 'Accounting' });
  await upsertAction(workflowKey, 'company-approval', 'approval-manager', 'Create manager approval request', 'CreateApproval', 'Creates an approval request for the responsible company or project manager.');
  await upsertAction(workflowKey, 'complete', 'timeline-complete', 'Record workflow complete', 'CreateTimelineEvent', 'Adds completion event to timeline.');

  await prisma.workflowEventSubscription.upsert({
    where: { key: 'invoice-imported-starts-approval' },
    update: { eventType: 'invoice.imported', workflowKey, enabled: true },
    create: { key: 'invoice-imported-starts-approval', eventType: 'invoice.imported', workflowKey, description: 'Starts invoice approval workflow for imported invoices.', enabled: true },
  });

  const existing = await prisma.workflowExecution.findFirst({ where: { workflowKey } });
  if (!existing) {
    const runKey = 'invoice-approval-demo-001';
    await prisma.workflowExecution.create({ data: { runKey, workflowKey, workflowName: 'Invoice Approval Flow', status: 'Waiting', entityType: 'invoice', entityKey: 'DEMO-INVOICE', currentStep: 'accounting-review', requestedBy: 'admin@sdi.local', context: { amount: 25000, vendor: 'Demo Vendor', job: '07194-26-01' } } });
    for (const [i, step] of [
      ['trigger','Invoice Imported','Trigger','Completed'],
      ['evaluate','Evaluate Amount and Job Rules','Condition','Completed'],
      ['accounting-review','Accounting Review','Approval','Waiting'],
      ['company-approval','Company / Project Approval','Approval','Pending'],
      ['complete','Complete and Notify','Action','Pending'],
    ].entries() as any) {
      await prisma.workflowExecutionStep.create({ data: { executionRunKey: runKey, stepKey: step[0], stepName: step[1], stepType: step[2], status: step[3], startedAt: i < 3 ? new Date() : null, completedAt: i < 2 ? new Date() : null } });
    }
  }
}

main().finally(() => prisma.$disconnect());
