import { Sidebar } from './Sidebar';
import { AuthHeader } from './AuthHeader';

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f4f7fb]">
    <Sidebar />
    <main className="lg:pl-72">
      <AuthHeader />
      <div className="p-6 lg:p-8">{children}</div>
    </main>
  </div>;
}
