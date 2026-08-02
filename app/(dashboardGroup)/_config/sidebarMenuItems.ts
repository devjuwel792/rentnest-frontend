import type { SidebarItem } from "@/lib/types";
import { TENANT_SIDEBAR_ITEMS } from "./tenantSidebarItems";

export const sidebarMenuItems: Record<string, SidebarItem[]> = {
  TENANT: TENANT_SIDEBAR_ITEMS,
};
