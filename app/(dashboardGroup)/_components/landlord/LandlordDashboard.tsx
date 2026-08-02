"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/auth";
import {
  useGetLandlordRequestsQuery,
  useGetMyPropertiesQuery,
  deleteProperty,
  togglePropertyAvailability,
} from "@/lib/api";
import { formatRent } from "@/lib/format";
import PropertyCard from "./PropertyCard";

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          {icon}
        </span>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const LandlordDashboard = () => {
  const user = useAuthUser();
  const {
    data: properties,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyPropertiesQuery();
  const { data: requests } = useGetLandlordRequestsQuery();
  const [busyId, setBusyId] = useState<string | null>(null);

  const allProperties = properties ?? [];
  const allRequests = requests ?? [];
  const availableCount = allProperties.filter(
    (p) => p.available !== false
  ).length;
  const pendingCount = allRequests.filter(
    (r) => r.status === "PENDING"
  ).length;
  const estimatedIncome = allRequests
    .filter((r) => r.status === "APPROVED")
    .reduce((sum, r) => sum + (r.monthlyRent ?? r.property?.rent ?? 0), 0);

  const handleToggle = async (id: string) => {
    setBusyId(id);
    try {
      await togglePropertyAvailability(id);
      refetch();
    } catch {
      refetch();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this property permanently?")) return;
    setBusyId(id);
    try {
      await deleteProperty(id);
      refetch();
    } catch {
      window.alert("Could not delete this property.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your listings and incoming rental requests.
          </p>
        </div>
        <Link
          href="/dashboard/landlord/properties/new"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          ➕ Add property
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My properties" value={allProperties.length} icon="🏠" />
        <StatCard label="Available" value={availableCount} icon="✅" />
        <StatCard label="Pending requests" value={pendingCount} icon="📥" />
        <StatCard
          label="Est. monthly income"
          value={formatRent(estimatedIncome)}
          icon="💰"
        />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            My properties
          </h2>
          <Link
            href="/dashboard/landlord/requests"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View requests →
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-4xl">😕</p>
            <p className="mt-3 text-sm font-medium text-gray-900">
              Couldn&apos;t load your properties
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {error || "Please try again."}
            </p>
            <button
              onClick={refetch}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Try again
            </button>
          </div>
        ) : allProperties.length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-4xl">🏠</p>
            <p className="mt-3 text-sm font-medium text-gray-900">
              No properties yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first listing to start receiving rental requests.
            </p>
            <Link
              href="/dashboard/landlord/properties/new"
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                busy={busyId === property.id}
                onToggleAvailability={() => handleToggle(property.id)}
                onDelete={() => handleDelete(property.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandlordDashboard;
