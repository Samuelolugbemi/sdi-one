import Link from 'next/link';
import { ArrowUpRight, Bot, Clock3, FileText, GitBranch, ShieldCheck, Sparkles } from 'lucide-react';

export function WorkspaceShell({
  entityLabel,
  entityKey,
  title,
  subtitle,
  badges = [],
  children,
}: {
  entityLabel: string;
  entityKey: string;
  title: string;
  subtitle?: string;
  badges?: string[];
  children: React.ReactNode;
}) {
  return <div className="space-y-6">
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white shadow-xl">
      <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">{entityLabel} Workspace</div>
          <h1 className="text-4xl font-black tracking-tight">{title}</h1>
          {subtitle && <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-300">{subtitle}</p>}
          <div className="mt-4 flex flex-wrap gap-2">{badges.map(b => <span key={b} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">{b}</span>)}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-black sm:grid-cols-3">
          <WorkspaceAction href={`/dashboard/workspaces/${entityLabel.toLowerCase()}/${entityKey}`} label="Workspace" icon={<ArrowUpRight className="h-4 w-4" />} />
          <WorkspaceAction href={`/dashboard/relationships?entity=${entityLabel.toLowerCase()}&key=${entityKey}`} label="Graph" icon={<GitBranch className="h-4 w-4" />} />
          <WorkspaceAction href={`/dashboard/timeline?entity=${entityLabel.toLowerCase()}&key=${entityKey}`} label="Timeline" icon={<Clock3 className="h-4 w-4" />} />
          <WorkspaceAction href={`/dashboard/documents?entity=${entityLabel.toLowerCase()}&key=${entityKey}`} label="Docs" icon={<FileText className="h-4 w-4" />} />
          <WorkspaceAction href={`/dashboard/ai?entity=${entityLabel.toLowerCase()}&key=${entityKey}`} label="AI" icon={<Bot className="h-4 w-4" />} />
          <WorkspaceAction href={`/dashboard/security?entity=${entityLabel.toLowerCase()}&key=${entityKey}`} label="Access" icon={<ShieldCheck className="h-4 w-4" />} />
        </div>
      </div>
    </div>
    {children}
  </div>;
}

function WorkspaceAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-white transition hover:bg-white hover:text-slate-950">{icon}{label}</Link>;
}

export function WorkspaceSection({ title, description, children, actionHref, actionLabel }: { title: string; description?: string; children: React.ReactNode; actionHref?: string; actionLabel?: string }) {
  return <section className="card p-5">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div><h2 className="text-lg font-black text-slate-950">{title}</h2>{description && <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{description}</p>}</div>
      {actionHref && <Link href={actionHref} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white hover:bg-blue-700">{actionLabel ?? 'Open'}</Link>}
    </div>
    {children}
  </section>;
}

export function AiInsightPanel({ insights }: { insights: string[] }) {
  return <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
    <div className="mb-3 flex items-center gap-2 text-sm font-black text-blue-800"><Sparkles className="h-4 w-4" /> AI Operational Brief</div>
    <div className="space-y-2">{insights.map(i => <div key={i} className="rounded-2xl bg-white/75 p-3 text-sm font-semibold leading-6 text-slate-700">{i}</div>)}</div>
  </div>;
}
