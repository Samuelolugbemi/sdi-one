'use client';

import { useState } from 'react';

const examples = [
  'Why are our highest cost jobs expensive?',
  'Which vendors should accounting review first?',
  'What equipment risks should operations look at?',
  'Summarize the imported SDI data for executives.',
  'Explain our invoice and inventory cost picture.'
];

export function AiCopilotConsole() {
  const [question, setQuestion] = useState('Why are our highest cost jobs expensive?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState<boolean | null>(null);
  const [context, setContext] = useState<any>(null);

  async function ask(q = question) {
    setLoading(true);
    setAnswer('');
    setLive(null);
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    });
    const data = await res.json();
    setAnswer(data.answer ?? data.error ?? 'No answer returned.');
    setLive(Boolean(data.live));
    setContext(data.context ?? null);
    setLoading(false);
  }

  return <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
    <div className="card p-6">
      <div className="section-title">Live AI Copilot</div>
      <h2 className="mt-1 text-2xl font-black">Ask SDI One about the business</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">This console uses imported SDI data as context. If an OpenAI key is configured, it uses live AI; otherwise it falls back to deterministic local intelligence.</p>
      <textarea value={question} onChange={e => setQuestion(e.target.value)} className="mt-5 min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => ask()} disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{loading ? 'Thinking...' : 'Ask SDI One'}</button>
        <span className={`badge ${live ? 'badge-green' : 'badge-slate'}`}>{live ? 'Live AI' : live === false ? 'Local intelligence' : 'Ready'}</span>
      </div>
      {answer && <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50/70 p-5">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">Answer</div>
        <div className="whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-800">{answer}</div>
      </div>}
    </div>
    <div className="space-y-6">
      <div className="card p-6">
        <div className="section-title">Example Questions</div>
        <div className="mt-4 space-y-2">
          {examples.map(x => <button key={x} onClick={() => { setQuestion(x); ask(x); }} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50">{x}</button>)}
        </div>
      </div>
      <div className="card p-6">
        <div className="section-title">Context Loaded</div>
        {context ? <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {Object.entries(context).map(([k,v]) => <div key={k} className="rounded-2xl bg-slate-50 p-3"><div className="text-xs font-black uppercase text-slate-400">{k}</div><div className="mt-1 font-black text-slate-900">{String(v)}</div></div>)}
        </div> : <p className="mt-3 text-sm text-slate-500">Ask a question to see the context SDI One used.</p>}
      </div>
    </div>
  </div>;
}
