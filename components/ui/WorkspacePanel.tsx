import { ReactNode } from 'react';

export function WorkspacePanel({ title, eyebrow, children, action }: { title: string; eyebrow?: string; children: ReactNode; action?: ReactNode }) {
  return <section className="card p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow && <div className="section-title mb-2">{eyebrow}</div>}
        <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>;
}

export function WorkspaceTabs({ tabs }: { tabs: string[] }) {
  return <div className="mb-6 flex flex-wrap gap-2">
    {tabs.map((tab, i) => <span key={tab} className={`rounded-full px-4 py-2 text-xs font-black ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>{tab}</span>)}
  </div>;
}
