"use client";

import { useMemo, useState } from "react";
import { useGetAdminRentalsQuery } from "@/lib/api";
import { formatDate, formatRent } from "@/lib/format";
import { RentalStatusBadge } from "../tenant/StatusBadge";
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

const AdminRentalList = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetAdminRentalsQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((rental) => {
      if (statusFilter && rental.status !== statusFilter) return false;
      if (!term) return true;
      return (
        rental.property?.title?.toLowerCase().includes(term) ||
        rental.tenant?.name?.toLowerCase().includes(term) ||
        rental.tenant?.email?.toLowerCase().includes(term) ||
        (rental.tenantName ?? "").toLowerCase().includes(term)
      );
    });
  }, [data, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rental requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of all rental requests across the platform.
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
          placeholder="🔍 Search tenant or property..."
          className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span className="text-sm text-gray-500">
          {filtered.length} request{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Couldn&apos;t load rentals
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
          <p className="text-4xl">📋</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            No rentals match your filters
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting the search or status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((rental) => {
            const price = rental.monthlyRent ?? rental.property?.rent;
            return (
              <div
                key={rental.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {rental.property?.title ??
                        `Property ${rental.propertyId}`}
                    </h3>
                    <RentalStatusBadge status={rental.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    🙋 {rental.tenant?.name ?? rental.tenantName ?? "Tenant"}
                    {rental.tenant?.email ? ` · ${rental.tenant.email}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Move-in {rental.moveInDate ? formatDate(rental.moveInDate) : "—"}
                    {" · "}Requested{" "}
                    {rental.createdAt ? formatDate(rental.createdAt) : "—"}
                    {rental.landlord?.name
                      ? ` · Landlord: ${rental.landlord.name}`
                      : ""}
                  </p>
                </div>
                {typeof price === "number" && (
                  <p className="shrink-0 font-bold text-indigo-600">
                    {formatRent(price)}
                    <span className="text-xs font-normal text-gray-500">
                      {" "}
                      /month
                    </span>
                  </p>
                )}
              </div>
            );
          })}
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

export default AdminRentalList;
