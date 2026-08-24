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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <span>🏠</span> RentNest
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600"
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
              >
                <span>📊</span> Dashboard
              </Link>
              <button
                onClick={() => clearStoredAuth()}
                className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
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
