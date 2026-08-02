"use client";

import { useMemo, useState } from "react";
import { togglePropertyAvailability, useGetAdminPropertiesQuery } from "@/lib/api";
import { formatRent } from "@/lib/format";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

const AdminPropertyList = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetAdminPropertiesQuery();
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((property) => {
      if (
        availabilityFilter &&
        String(property.available ?? true) !== availabilityFilter
      ) {
        return false;
      }
      if (!term) return true;
      return (
        property.title?.toLowerCase().includes(term) ||
        property.location?.toLowerCase().includes(term)
      );
    });
  }, [data, search, availabilityFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleToggle = async (id: string) => {
    setBusyId(id);
    setMessage("");
    try {
      await togglePropertyAvailability(id);
      refetch();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Could not update the property."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Property moderation
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review all listings and take down unavailable ones.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="🔍 Search by title or location..."
          className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={availabilityFilter}
          onChange={(event) => {
            setAvailabilityFilter(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All listings</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
        <span className="text-sm text-gray-500">
          {filtered.length} listing{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {message}
        </p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Couldn&apos;t load properties
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
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">🏠</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            No listings match your filters
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting the search or availability filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                <th className="px-5 py-3 font-semibold">Property</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">
                  Landlord
                </th>
                <th className="px-5 py-3 font-semibold">Rent</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((property) => {
                const busy = busyId === property.id;
                const available = property.available !== false;
                return (
                  <tr
                    key={property.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {property.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        📍 {property.location} · {property.bedrooms} bd ·{" "}
                        {property.bathrooms} ba
                      </p>
                    </td>
                    <td className="hidden px-5 py-4 text-gray-500 lg:table-cell">
                      {property.landlord?.name ?? "—"}
                      {property.landlord?.email
                        ? ` · ${property.landlord.email}`
                        : ""}
                    </td>
                    <td className="px-5 py-4 font-semibold text-indigo-600">
                      {formatRent(property.rent)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggle(property.id)}
                        disabled={busy}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${
                          available
                            ? "border border-red-200 text-red-600 hover:bg-red-50"
                            : "bg-emerald-600 text-white hover:bg-emerald-500"
                        }`}
                      >
                        {busy
                          ? "Saving..."
                          : available
                            ? "Take down"
                            : "Restore"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminPropertyList;
