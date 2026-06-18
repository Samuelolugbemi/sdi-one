import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { integrations } from '@/lib/platform';
import Link from 'next/link';

export default function IntegrationsPage(){return <AppShell><PageHeader eyebrow="Integration Hub" title="Data Integrations" description="Connector command center for Intacct, Salesforce, POR, Ford Pro, Fuel, Monday.com and dispatch/telematics." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{integrations.map(i => <Link href={`/dashboard/integrations/${i.slug}`} key={i.slug} className="card p-6 card-hover"><div className="section-title mb-3">{i.status}</div><h2 className="text-xl font-black">{i.name}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{i.next}</p><span className="mt-5 inline-flex badge badge-blue">Open Connector</span></Link>)}</div></AppShell>}
