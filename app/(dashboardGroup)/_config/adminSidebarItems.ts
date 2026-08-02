import type { SidebarItem } from "@/lib/types";

export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: "📊",
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: "👥",
  },
  {
    label: "Properties",
    href: "/dashboard/admin/properties",
    icon: "🏠",
  },
  {
    label: "Rentals",
    href: "/dashboard/admin/rentals",
    icon: "📋",
  },
];
