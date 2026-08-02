import type { SidebarItem } from "@/lib/types";
import { TENANT_SIDEBAR_ITEMS } from "./tenantSidebarItems";
import { LANDLORD_SIDEBAR_ITEMS } from "./landlordSidebarItems";

export const sidebarMenuItems: Record<string, SidebarItem[]> = {
  TENANT: TENANT_SIDEBAR_ITEMS,
  LANDLORD: LANDLORD_SIDEBAR_ITEMS,
};
