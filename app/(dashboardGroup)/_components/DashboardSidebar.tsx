"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import type { SidebarItem } from "@/lib/types";
import { sidebarMenuItems } from "../_config/sidebarMenuItems";

const DashboardSidebar = ({ user }: { user: AuthUser }) => {
  const pathname = usePathname();
  const items: SidebarItem[] = sidebarMenuItems[user?.role] ?? [];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800/80 px-6 py-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-base shadow-lg shadow-indigo-500/30">
            🏠
          </span>
          <span className="text-xl font-black tracking-tight">
            Rent
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Nest
            </span>
          </span>
        </Link>
        <span className="mt-2.5 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
          {user?.role} Portal
        </span>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
