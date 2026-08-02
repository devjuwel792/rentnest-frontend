import type { SidebarItem } from "@/lib/types";

export const LANDLORD_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard/landlord",
    icon: "📊",
  },
  {
    label: "Add Property",
    href: "/dashboard/landlord/properties/new",
    icon: "➕",
  },
  {
    label: "Requests",
    href: "/dashboard/landlord/requests",
    icon: "📥",
  },
];
