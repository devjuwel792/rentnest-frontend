"use client";

import Link from "next/link";
import { clearStoredAuth, useAuthUser } from "@/lib/auth";

const DASHBOARD_PATHS: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export default function Navbar() {
  const user = useAuthUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-lg text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
              🏠
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              Rent<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Nest</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/properties"
              className="text-sm font-semibold text-gray-300 transition-colors hover:text-white"
            >
              Browse Properties
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={DASHBOARD_PATHS[user.role] ?? "/dashboard/tenant"}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4.5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95 hover:shadow-indigo-500/40"
              >
                <span>📊</span> Dashboard ({user.role.toLowerCase()})
              </Link>
              <button
                onClick={() => clearStoredAuth()}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4.5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95 hover:shadow-indigo-500/40"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
