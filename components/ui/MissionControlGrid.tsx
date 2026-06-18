import { ReactNode } from 'react';

export function MissionControlGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 lg:grid-cols-12">{children}</div>;
}

export function CommandPanel({ title, eyebrow, children, span = 'lg:col-span-6' }: { title: string; eyebrow?: string; children: ReactNode; span?: string }) {
  return <section className={`card p-6 ${span}`}><div className="mb-4"><div className="section-title mb-2">{eyebrow ?? 'Mission Control'}</div><h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2></div>{children}</section>;
}

export function ExecutiveMetric({ label, value, detail, tone = 'blue' }: { label: string; value: string; detail?: string; tone?: 'blue' | 'green' | 'amber' | 'slate' }) {
  const styles = { blue: 'from-blue-600 to-cyan-500', green: 'from-emerald-600 to-teal-500', amber: 'from-amber-500 to-orange-500', slate: 'from-slate-700 to-slate-900' };
  return <div className="card overflow-hidden p-0"><div className={`h-2 bg-gradient-to-r ${styles[tone]}`} /><div className="p-5"><div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</div><div className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</div>{detail && <p className="mt-2 text-sm font-semibold text-slate-500">{detail}</p>}</div></div>;
}
