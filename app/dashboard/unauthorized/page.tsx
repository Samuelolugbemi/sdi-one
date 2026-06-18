import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="p-8">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <h1 className="text-3xl font-black text-red-900">Access denied</h1>
        <p className="mt-3 max-w-2xl text-red-700">
          You do not have permission to view this area of SDI One.
        </p>

        <Link
          href="/dashboard/command-center"
          className="mt-6 inline-flex rounded-2xl bg-red-700 px-5 py-3 font-black text-white"
        >
          Return to Mission Control
        </Link>
      </div>
    </main>
  );
}