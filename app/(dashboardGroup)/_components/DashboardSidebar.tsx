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
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-5 py-5">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          🏠 RentNest
        </Link>
        <p className="mt-1 text-xs text-gray-500">
          {user?.role === "LANDLORD" ? "Landlord dashboard" : "Tenant dashboard"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
