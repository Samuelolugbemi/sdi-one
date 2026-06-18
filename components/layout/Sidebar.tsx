'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BriefcaseBusiness, Building2, CircleDollarSign, Database, FileText, Gauge, GitBranch, HardHat, Home, Package, ReceiptText, Search, Settings, Shield, ShieldAlert, Sparkles, Truck, Users, Wrench, Bell, Clock3, LayoutDashboard, Boxes, PanelsTopLeft, Route, Workflow, Bot, PlugZap, ClipboardCheck, CalendarClock, Fuel, MapPinned, CarFront, Stethoscope, ClipboardList, KanbanSquare } from 'lucide-react';

const groups = [
  { title: 'Command', links: [
    { href: '/dashboard/executive', label: 'Executive Overview', icon: Home },
    { href: '/dashboard/mission-control', label: 'Mission Control', icon: Gauge },
    { href: '/dashboard/command-center', label: 'Command Center', icon: LayoutDashboard },
    { href: '/dashboard/financial', label: 'Financial Analytics', icon: CircleDollarSign },
    { href: '/dashboard/ai', label: 'AI Insights', icon: Sparkles },
  ]},
  { title: 'Business', links: [
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { href: '/dashboard/planning', label: 'Project Planning', icon: KanbanSquare },
    { href: '/dashboard/vendors', label: 'Vendors', icon: Building2 },
    { href: '/dashboard/invoices', label: 'Invoices', icon: ReceiptText },
  ]},
  { title: 'Operations', links: [
    { href: '/dashboard/equipment', label: 'Equipment', icon: Wrench },
    { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
    { href: '/dashboard/fleet', label: 'Fleet', icon: Truck },
    { href: '/dashboard/fleet/vehicles', label: 'Fleet Vehicles', icon: CarFront },
    { href: '/dashboard/fleet/fuel', label: 'Fuel Intelligence', icon: Fuel },
    { href: '/dashboard/fleet/maintenance', label: 'Fleet Maintenance', icon: Stethoscope },
    { href: '/dashboard/fleet/telematics', label: 'Telematics', icon: MapPinned },
    { href: '/dashboard/safety', label: 'Safety', icon: ShieldAlert },
  ]},
  { title: 'Platform', links: [
    { href: '/dashboard/entities', label: 'Entity Registry', icon: Boxes },
    { href: '/dashboard/workspaces', label: 'Workspaces', icon: Route },
    { href: '/dashboard/platform-core', label: 'Platform Core', icon: PanelsTopLeft },
    { href: '/dashboard/digital-twin', label: 'Digital Twin', icon: GitBranch },
    { href: '/dashboard/relationships', label: 'Relationships', icon: GitBranch },
    { href: '/dashboard/timeline', label: 'Timeline', icon: Clock3 },
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/workflows', label: 'Workflows', icon: Workflow },
    { href: '/dashboard/automation', label: 'Automation', icon: ClipboardCheck },
    { href: '/dashboard/automation/designer', label: 'Workflow Designer', icon: Workflow },
    { href: '/dashboard/automation/execution', label: 'Workflow Execution', icon: Workflow },
    { href: '/dashboard/automation/tasks', label: 'Tasks', icon: ClipboardCheck },
    { href: '/dashboard/automation/scheduler', label: 'Scheduler', icon: CalendarClock },
    { href: '/dashboard/automation/event-bus', label: 'Event Bus', icon: GitBranch },
    { href: '/dashboard/ai/copilot', label: 'AI Copilot', icon: Bot },
    { href: '/dashboard/ai/executive-briefing', label: 'Executive Briefing', icon: Sparkles },
    { href: '/dashboard/ai/live', label: 'Live AI Status', icon: Bot },
    { href: '/search', label: 'Universal Search', icon: Search },
  ]},
  { title: 'Administration', links: [
    { href: '/dashboard/integrations', label: 'Data Integrations', icon: Database },
    { href: '/dashboard/integration-platform', label: 'Integration Platform', icon: PlugZap },
    { href: '/dashboard/integration-platform/runs', label: 'Sync Monitoring', icon: CalendarClock },
    { href: '/dashboard/integration-platform/connectors/ford-pro', label: 'Ford Pro', icon: Truck },
    { href: '/dashboard/integration-platform/connectors/fuel-system', label: 'Fuel System', icon: Fuel },
    { href: '/dashboard/integration-platform/connectors/geotab', label: 'Geotab', icon: MapPinned },
    { href: '/dashboard/integration-platform/connectors/monday-com', label: 'Monday.com', icon: ClipboardList },
    { href: '/dashboard/security', label: 'Security & Access', icon: Shield },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/roles', label: 'Roles', icon: Shield },
    { href: '/dashboard/admin/permissions', label: 'Permissions', icon: ShieldAlert },
    { href: '/dashboard/admin/access', label: 'Access Control', icon: Shield },
    { href: '/dashboard/approvals', label: 'Approvals', icon: ShieldAlert },
    { href: '/dashboard/data-quality', label: 'Data Quality', icon: Database },
    { href: '/dashboard/admin', label: 'Admin Center', icon: Settings },
    { href: '/dashboard/admin/entity-engine', label: 'Entity Engine', icon: PanelsTopLeft },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/reports/builder', label: 'Report Builder', icon: LayoutDashboard },
  ]}
];

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 overflow-y-auto bg-slate-950 text-white lg:block">
    <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 font-black shadow-lg shadow-blue-500/25">SDI</div>
      <div><div className="font-black tracking-tight">SDI One</div><div className="text-xs font-semibold text-slate-400">Enterprise Operations Platform</div></div>
    </div>
    <nav className="space-y-5 p-4">
      {groups.map(group => <div key={group.title}>
        <div className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{group.title}</div>
        <div className="space-y-1">
          {group.links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${active ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</Link>;
          })}
        </div>
      </div>)}
    </nav>
  </aside>;
}
