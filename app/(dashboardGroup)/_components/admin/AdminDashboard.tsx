"use client";

import Link from "next/link";
import {
  useGetAdminPropertiesQuery,
  useGetAdminRentalsQuery,
  useGetAdminUsersQuery,
} from "@/lib/api";
import { formatRent } from "@/lib/format";
import { RentalStatusBadge } from "../tenant/StatusBadge";

const StatCard = ({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string | number;
  icon: string;
  href?: string;
}) => {
  const body = (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  const classes =
    "block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md";

  return href ? (
    <Link href={href} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
};

const AdminDashboard = () => {
  const users = useGetAdminUsersQuery();
  const properties = useGetAdminPropertiesQuery();
  const rentals = useGetAdminRentalsQuery();

  const allUsers = users.data ?? [];
  const allProperties = properties.data ?? [];
  const allRentals = rentals.data ?? [];

  const tenantCount = allUsers.filter((u) => u.role === "TENANT").length;
  const landlordCount = allUsers.filter((u) => u.role === "LANDLORD").length;
  const bannedCount = allUsers.filter((u) => u.status === "BANNED").length;
  const availableCount = allProperties.filter(
    (p) => p.available !== false
  ).length;
  const pendingCount = allRentals.filter((r) => r.status === "PENDING").length;
  const approvedCount = allRentals.filter(
    (r) => r.status === "APPROVED"
  ).length;
  const totalRent = allProperties.reduce(
    (sum, p) => sum + (p.rent ?? 0),
    0
  );

  const loading = users.isLoading && properties.isLoading && rentals.isLoading;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Platform overview 🛡️
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Key statistics across users, properties and rental requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={allUsers.length}
          icon="👥"
          href="/dashboard/admin/users"
        />
        <StatCard label="Tenants" value={tenantCount} icon="🙋" />
        <StatCard label="Landlords" value={landlordCount} icon="🏢" />
        <StatCard label="Banned users" value={bannedCount} icon="🚫" />
        <StatCard
          label="Properties"
          value={allProperties.length}
          icon="🏠"
          href="/dashboard/admin/properties"
        />
        <StatCard label="Available" value={availableCount} icon="✅" />
        <StatCard
          label="Rental requests"
          value={allRentals.length}
          icon="📋"
          href="/dashboard/admin/rentals"
        />
        <StatCard
          label="Pending / approved"
          value={`${pendingCount} / ${approvedCount}`}
          icon="⏳"
        />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          💰 Combined monthly rent of all listings
        </h2>
        <p className="mt-1 text-3xl font-bold text-indigo-600">
          {formatRent(totalRent)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Sum of asking rent across {allProperties.length} properties.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Latest rental requests</h2>
          <div className="mt-3 space-y-3">
            {allRentals.slice(0, 5).map((rental) => (
              <div
                key={rental.id}
                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {rental.property?.title ?? `Property ${rental.propertyId}`}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {rental.tenant?.name ?? rental.tenantName ?? "Tenant"} ·{" "}
                    {rental.tenant?.email ?? ""}
                  </p>
                </div>
                <RentalStatusBadge status={rental.status} />
              </div>
            ))}
            {allRentals.length === 0 && (
              <p className="text-sm text-gray-500">No rentals yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Newest properties</h2>
          <div className="mt-3 space-y-3">
            {allProperties.slice(0, 5).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {property.title}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {property.location} · {property.landlord?.name ?? "—"}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-indigo-600">
                  {formatRent(property.rent)}
                </p>
              </div>
            ))}
            {allProperties.length === 0 && (
              <p className="text-sm text-gray-500">No properties yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
