import { NextResponse } from 'next/server';
import { launchWorkflow } from '../../../../lib/workflow-runtime';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const workflowKey = body.workflowKey ?? 'invoice-approval-flow';
  const execution = await launchWorkflow({
    workflowKey,
    entityType: body.entityType,
    entityKey: body.entityKey,
    requestedBy: body.requestedBy ?? 'api',
    context: body.context ?? {},
  });
  return NextResponse.json({ ok: true, execution });
}
