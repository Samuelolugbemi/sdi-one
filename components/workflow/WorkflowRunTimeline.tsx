import { StatusBadge } from '../ui/StatusBadge';

export function WorkflowRunTimeline({ steps }: { steps: any[] }) {
  if (!steps.length) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No workflow steps have been created for this run.</div>;
  }
  return <div className="space-y-3">
    {steps.map((step, index) => <div key={step.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 font-black text-white">{index + 1}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-black text-slate-950">{step.stepName}</div>
              <div className="text-sm text-slate-500">{step.stepType} · {step.stepKey}</div>
            </div>
            <StatusBadge value={step.status} />
          </div>
          {step.message ? <p className="mt-3 text-sm text-slate-600">{step.message}</p> : null}
        </div>
      </div>
    </div>)}
  </div>;
}
