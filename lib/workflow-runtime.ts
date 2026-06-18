
import { prisma } from './prisma';

function nowKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export type WorkflowLaunchInput = {
  workflowKey: string;
  entityType?: string;
  entityKey?: string;
  requestedBy?: string;
  context?: Record<string, unknown>;
};

export async function launchWorkflow(input: WorkflowLaunchInput) {
  const workflow = await prisma.workflowDefinition.findUnique({ where: { key: input.workflowKey } });
  const steps = await prisma.workflowStepTemplate.findMany({
    where: { workflowKey: input.workflowKey, enabled: true },
    orderBy: { sortOrder: 'asc' },
  });
  const runKey = nowKey(input.workflowKey);
  const firstStep = steps[0]?.stepKey ?? null;

  const execution = await prisma.workflowExecution.create({
    data: {
      runKey,
      workflowKey: input.workflowKey,
      workflowName: workflow?.name ?? input.workflowKey,
      status: steps.length ? 'Running' : 'Completed',
      entityType: input.entityType,
      entityKey: input.entityKey,
      currentStep: firstStep,
      requestedBy: input.requestedBy,
      context: input.context ?? {},
      completedAt: steps.length ? null : new Date(),
    },
  });

  for (const step of steps) {
    await prisma.workflowExecutionStep.create({
      data: {
        executionRunKey: runKey,
        stepKey: step.stepKey,
        stepName: step.name,
        stepType: step.stepType,
        status: step.stepKey === firstStep ? 'Running' : 'Pending',
        startedAt: step.stepKey === firstStep ? new Date() : null,
      },
    });
  }

  await prisma.platformEvent.create({
    data: {
      eventType: 'workflow.started',
      entityType: input.entityType,
      entityKey: input.entityKey,
      title: `Workflow started: ${workflow?.name ?? input.workflowKey}`,
      description: `Run ${runKey} was launched.`,
      severity: 'Info',
      source: 'Workflow Engine',
      payload: { runKey, workflowKey: input.workflowKey },
    },
  });

  return execution;
}

export async function advanceWorkflow(runKey: string) {
  const execution = await prisma.workflowExecution.findUnique({ where: { runKey } });
  if (!execution || ['Completed', 'Failed', 'Cancelled'].includes(execution.status)) return execution;

  const steps = await prisma.workflowExecutionStep.findMany({
    where: { executionRunKey: runKey },
    orderBy: { id: 'asc' },
  });
  const currentIndex = steps.findIndex((s) => s.stepKey === execution.currentStep);
  const current = steps[currentIndex] ?? steps.find((s) => s.status === 'Running') ?? steps[0];
  if (!current) return execution;

  await prisma.workflowExecutionStep.update({
    where: { id: current.id },
    data: { status: 'Completed', completedAt: new Date(), message: 'Step completed by workflow runtime.' },
  });

  const actions = await prisma.workflowActionTemplate.findMany({
    where: { workflowKey: execution.workflowKey, stepKey: current.stepKey, enabled: true },
  });
  for (const action of actions) {
    await prisma.workflowActionRun.create({
      data: {
        executionRunKey: runKey,
        stepKey: current.stepKey,
        actionKey: action.actionKey,
        actionType: action.actionType,
        status: 'Completed',
        message: `Executed ${action.actionType}`,
        startedAt: new Date(),
        completedAt: new Date(),
        result: action.config ?? {},
      },
    });
    if (action.actionType === 'CreateNotification') {
      await prisma.notificationItem.create({ data: { title: action.name, message: action.description, severity: 'Info', entityType: execution.entityType, entityKey: execution.entityKey, href: `/dashboard/automation/execution/${runKey}` } });
    }
    if (action.actionType === 'CreateTimelineEvent') {
      await prisma.timelineEvent.create({ data: { entityType: execution.entityType ?? 'workflow', entityKey: execution.entityKey ?? runKey, eventType: 'Workflow', title: action.name, description: action.description, source: 'Workflow Engine' } });
    }
  }

  const next = steps[currentIndex + 1];
  if (!next) {
    return prisma.workflowExecution.update({ where: { runKey }, data: { status: 'Completed', currentStep: null, completedAt: new Date() } });
  }

  await prisma.workflowExecutionStep.update({ where: { id: next.id }, data: { status: next.stepType === 'Approval' ? 'Waiting' : 'Running', startedAt: new Date() } });
  return prisma.workflowExecution.update({ where: { runKey }, data: { status: next.stepType === 'Approval' ? 'Waiting' : 'Running', currentStep: next.stepKey } });
}

export async function getWorkflowExecutionSummary() {
  const [executions, queued, waiting, completed, failed, templates] = await Promise.all([
    prisma.workflowExecution.count(),
    prisma.workflowExecution.count({ where: { status: 'Queued' } }),
    prisma.workflowExecution.count({ where: { status: 'Waiting' } }),
    prisma.workflowExecution.count({ where: { status: 'Completed' } }),
    prisma.workflowExecution.count({ where: { status: 'Failed' } }),
    prisma.workflowStepTemplate.count(),
  ]);
  return { executions, queued, waiting, completed, failed, templates };
}
