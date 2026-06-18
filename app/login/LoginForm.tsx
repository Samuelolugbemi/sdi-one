"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { login } from "./actions";

const initialState = {
  ok: false,
  error: "",
  redirectTo: "",
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, initialState);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </div>
      ) : null}

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
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-black text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
      >
        Sign in
      </button>
    </form>
  );
}