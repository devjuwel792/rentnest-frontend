import type { Metadata } from "next";
import TenantDashboard from "../../_components/tenant/TenantDashboard";

export const metadata: Metadata = {
  title: "Tenant Dashboard | RentNest",
  description: "Track your rental requests, payments and reviews.",
};

const TenantDashboardPage = () => {
  return <TenantDashboard />;
};

export default TenantDashboardPage;
