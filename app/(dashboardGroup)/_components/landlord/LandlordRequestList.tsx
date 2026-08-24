"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getErrorMessage,
  updateRentalRequestStatus,
  useGetLandlordRequestsQuery,
} from "@/lib/api";
import { formatDate, formatRent } from "@/lib/format";
import { RentalStatusBadge } from "../tenant/StatusBadge";

const LandlordRequestList = () => {
  const { data: requests, isLoading, isError, error, refetch } =
    useGetLandlordRequestsQuery();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const allRequests = requests ?? [];

  const handleDecision = async (id: string, status: string) => {
    setBusyId(id);
    setMessage("");
    try {
      await updateRentalRequestStatus(id, status);
      refetch();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : `Could not ${status.toLowerCase()} the request.`
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incoming requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and respond to tenant rental requests.
        </p>
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
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Couldn&apos;t load requests
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {getErrorMessage(error) || "Please try again."}
          </p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      ) : allRequests.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">📥</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            No requests yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            When tenants request your properties, they&apos;ll show up here.
          </p>
          <Link
            href="/dashboard/landlord/properties/new"
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Add a property
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allRequests.map((rental) => {
            const property = rental.property;
            const price = rental.monthlyRent ?? property?.rent;
            const tenantName =
              rental.tenant?.name ?? rental.tenantName ?? "Tenant";
            const busy = busyId === rental.id;

            return (
              <div
                key={rental.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {property?.title ?? `Property ${rental.propertyId}`}
                      </h3>
                      <RentalStatusBadge status={rental.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      🙋 {tenantName}
                      {rental.tenant?.email
                        ? ` · ${rental.tenant.email}`
                        : ""}
                    </p>
                  </div>
                  {typeof price === "number" && (
                    <p className="font-bold text-indigo-600">
                      {formatRent(price)}
                      <span className="text-xs font-normal text-gray-500">
                        {" "}
                        /month
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-4 grid gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">Move-in date</p>
                    <p className="font-medium text-gray-800">
                      {rental.moveInDate ? formatDate(rental.moveInDate) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Requested on</p>
                    <p className="font-medium text-gray-800">
                      {rental.createdAt ? formatDate(rental.createdAt) : "—"}
                    </p>
                  </div>
                </div>

                {rental.status === "PENDING" ? (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(rental.id, "APPROVED")}
                      disabled={busy}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleDecision(rental.id, "REJECTED")}
                      disabled={busy}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                    {busy && (
                      <span className="text-sm text-gray-400">
                        Updating...
                      </span>
                    )}
                  </div>
                ) : rental.status === "ACTIVE" ? (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <p className="text-sm font-medium text-emerald-600">
                      ⚡ Active Tenancy (Paid)
                    </p>
                    <button
                      onClick={() => handleDecision(rental.id, "COMPLETED")}
                      disabled={busy}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                    >
                      Mark Tenancy Completed
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-500">
                    {rental.status === "APPROVED"
                      ? "✅ Approved — awaiting tenant payment."
                      : rental.status === "REJECTED"
                        ? "Rejected — tenant has been notified."
                        : rental.status === "COMPLETED"
                          ? "🎉 Rental completed."
                          : `Status: ${rental.status}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandlordRequestList;
