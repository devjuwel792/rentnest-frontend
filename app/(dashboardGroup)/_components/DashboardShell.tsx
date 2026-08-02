"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearStoredAuth, useAuthUser } from "@/lib/auth";
import DashboardSidebar from "./DashboardSidebar";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
          <span className="text-sm">Checking your session...</span>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    clearStoredAuth();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold text-gray-900">
                {user?.name} · {user?.role.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                View site
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
