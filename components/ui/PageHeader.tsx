import type React from 'react';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <div className="section-title">SDI Command Center</div>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
      {description && <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex gap-2">{actions}</div>}
  </div>;
}
