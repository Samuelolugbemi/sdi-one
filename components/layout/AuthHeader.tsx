import Link from 'next/link';
import { Bell, LogOut, Search, Sparkles, UserCircle } from 'lucide-react';
import { getCurrentUser, getUserRoleNames } from '@/lib/auth';
import { logoutAction } from '@/app/login/actions';

export async function AuthHeader() {
  const user = await getCurrentUser();
  const roles = getUserRoleNames(user);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-xl">
      <form action="/search" className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-slate-400" />
        <input name="q" className="input h-11 w-full bg-slate-50 pl-10" placeholder="Search customers, jobs, vendors, invoices, equipment..." />
      </form>
      <div className="ml-4 flex items-center gap-2">
        <Link href="/dashboard/ai" className="hidden rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 sm:inline-flex"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> AI Ready</Link>
        <Link href="/dashboard/notifications" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"><Bell className="h-4 w-4" /></Link>
        <Link href="/dashboard/security" className="hidden rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 sm:block">
          <div className="font-black">{user?.name || 'Guest'}</div>
          <div className="max-w-[150px] truncate text-slate-400">{roles[0] || 'No role'}</div>
        </Link>
        <form action={logoutAction}>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" title="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
