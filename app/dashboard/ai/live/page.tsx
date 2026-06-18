import { PageHeader } from '../../../../components/ui/PageHeader';
import { prisma } from '../../../../lib/prisma';

export default async function AiLiveStatusPage() {
  const [conversations, logs, recommendations] = await Promise.all([
    prisma.aiConversation.count().catch(() => 0),
    prisma.naturalLanguageQueryLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }).catch(() => []),
    prisma.aiRecommendation.findMany({ where: { status: 'Open' }, take: 6, orderBy: { createdAt: 'desc' } }).catch(() => []),
  ]);
  return <>
    <PageHeader title="Live AI Status" description="Monitor copilot usage, query logs, AI recommendations, provider readiness, and SDI context grounding." />
    <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
      <div className="card p-6">
        <div className="section-title">Provider</div>
        <h2 className="mt-1 text-2xl font-black">{process.env.OPENAI_API_KEY ? 'OpenAI configured' : 'Local intelligence fallback'}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">Set OPENAI_API_KEY in .env to enable live model calls. Without it, SDI One produces safe deterministic answers from imported business context.</p>
        <div className="mt-5 badge badge-blue">{process.env.OPENAI_MODEL || 'gpt-4o-mini'}</div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="section-title">Conversations</div><div className="mt-1 text-3xl font-black">{conversations}</div></div>
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="section-title">Recent Natural Language Queries</div>
          <div className="mt-4 space-y-3">
            {logs.map((l:any) => <div key={l.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">{l.query}</div><div className="mt-1 text-xs text-slate-500">{l.createdAt.toLocaleString()}</div></div>)}
            {!logs.length && <p className="text-sm text-slate-500">No AI queries yet.</p>}
          </div>
        </div>
        <div className="card p-6">
          <div className="section-title">Open AI Recommendations</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recommendations.map((r:any) => <div key={r.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-black">{r.title}</div><div className="mt-1 text-sm text-slate-500">{r.recommendation}</div></div>)}
            {!recommendations.length && <p className="text-sm text-slate-500">No recommendations seeded yet.</p>}
          </div>
        </div>
      </div>
    </div>
  </>;
}
