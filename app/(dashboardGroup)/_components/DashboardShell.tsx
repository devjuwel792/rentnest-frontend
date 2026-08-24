"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredAuth, useAuthUser } from "@/lib/auth";
import DashboardSidebar from "./DashboardSidebar";

const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
      return;
    }
    if (user) {
      if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
        router.replace(
          user.role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/tenant"
        );
      } else if (
        pathname.startsWith("/dashboard/landlord") &&
        user.role !== "LANDLORD"
      ) {
        router.replace(
          user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/tenant"
        );
      } else if (
        pathname.startsWith("/dashboard/tenant") &&
        user.role !== "TENANT"
      ) {
        router.replace(
          user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/landlord"
        );
      }
    }
  }, [user, pathname, router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
          <span className="text-sm font-semibold">Verifying session...</span>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    clearStoredAuth();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400">Welcome back,</p>
              <p className="flex items-center gap-2 text-base font-bold text-gray-900">
                <span>👋</span> {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100"
              >
                🌐 View Site
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50"
              >
                Log out
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
