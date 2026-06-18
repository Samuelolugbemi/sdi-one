import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { initializePlatform } from "./actions";

export default async function SetupPage() {
  const existingUsers = await prisma.appUser.count();

  if (existingUsers > 0) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              SDI One Enterprise Setup
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight">
              Welcome to SDI One.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              This is the first-time platform installer. Create the first
              administrator account to initialize SDI One and unlock the
              enterprise dashboard.
            </p>

            <div className="mt-10 grid gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-bold text-white">1. Create Administrator</div>
                <div className="mt-1">The first user receives full platform access.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-bold text-white">2. Initialize Security</div>
                <div className="mt-1">Roles, permissions, and access rules begin here.</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-bold text-white">3. Enter Mission Control</div>
                <div className="mt-1">Start using the SDI One operating platform.</div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white p-8 text-slate-950 shadow-2xl">
            <h2 className="text-2xl font-black">Create first administrator</h2>
            <p className="mt-2 text-sm text-slate-600">
              This account will manage users, roles, integrations, and platform
              configuration.
            </p>

            <form action={initializePlatform} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-bold">Full name</label>
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="Samuel Olugbemi"
                />
              </div>

              <div>
                <label className="text-sm font-bold">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="you@shaftdrillers.com"
                />
              </div>

              <div>
                <label className="text-sm font-bold">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="text-sm font-bold">Confirm password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                Initialize SDI One
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}