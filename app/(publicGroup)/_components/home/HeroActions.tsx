"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/auth";

const DASHBOARD_PATHS: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export default function HeroActions() {
  const user = useAuthUser();

  if (user) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href={DASHBOARD_PATHS[user.role] ?? "/dashboard/tenant"}
          className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
        >
          Go to Dashboard ({user.role.toLowerCase()}) →
        </Link>
        <Link
          href="/properties"
          className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/20"
        >
          Browse All Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
      <Link
        href="/login"
        className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/20"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/40"
      >
        Create Account
      </Link>
    </div>
  );
}
