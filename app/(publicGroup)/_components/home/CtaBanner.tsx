import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-2xl sm:p-14">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
            🏢 For Landlords & Property Managers
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Have a property to rent out? List it on RentNest today.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-indigo-100">
            Reach thousands of verified tenants, accept digital requests, and manage rent payments effortlessly.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-900 shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              List Your Property Now →
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign In to Landlord Portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
