import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const userCount = await prisma.appUser.count();

  if (userCount === 0) {
    redirect("/setup");
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
              SDI One Enterprise
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight">
              One platform for the entire business.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Understand what is happening, why it is happening, and what should
              happen next — without needing to know where the data came from.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white p-8 text-slate-950 shadow-2xl">
            <h2 className="text-2xl font-black">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">
              Access SDI One Mission Control.
            </p>

            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}