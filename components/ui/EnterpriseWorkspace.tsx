import Link from 'next/link';
import { ReactNode } from 'react';
import { WorkspaceTabs } from '@/components/ui/WorkspacePanel';

export function EnterpriseWorkspace({
  entityType,
  title,
  subtitle,
  tabs,
  children,
}: {
  entityType: string;
  title: string;
  subtitle?: string | null;
  tabs: string[];
  children: ReactNode;
}) {
  return <div>
    <div className="card mb-6 overflow-hidden p-0">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-7 text-white">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{entityType} Workspace</div>
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-300">{subtitle ?? '360° operational workspace with relationships, timeline, analytics, documents and AI-ready context.'}</p>
        <div className="mt-5 flex flex-wrap gap-2"><Link href="/search" className="btn border-white/20 bg-white/10 text-white hover:bg-white/20">Search Related</Link><Link href="/dashboard/relationships" className="btn border-white/20 bg-white/10 text-white hover:bg-white/20">Open Graph</Link><Link href="/dashboard/timeline" className="btn border-white/20 bg-white/10 text-white hover:bg-white/20">Timeline</Link></div>
      </div>
    </div>
    <WorkspaceTabs tabs={tabs} />
    {children}
  </div>;
}
