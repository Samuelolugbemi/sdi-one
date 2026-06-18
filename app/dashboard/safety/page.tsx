import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
export default function SafetyPage(){return <AppShell><PageHeader title="Safety" description="Functional shell awaiting safety incident source data."/><EmptyState title="Awaiting Safety Data" message="This page is ready for Monday.com, safety forms, or CSV incident imports. It does not display fake incidents."/></AppShell>}
