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
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={DASHBOARD_PATHS[user.role] ?? "/dashboard/tenant"}
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          Go to Dashboard ({user.role.toLowerCase()}) →
        </Link>
        <Link
          href="/properties"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/login"
        className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
      >
        Create Account
      </Link>
    </div>
  );
}
