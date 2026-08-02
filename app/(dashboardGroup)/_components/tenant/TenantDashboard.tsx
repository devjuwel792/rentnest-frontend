"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/auth";
import {
  getErrorMessage,
  useGetMyPaymentsQuery,
  useGetMyRentalsQuery,
} from "@/lib/api";
import { formatDate, formatRent } from "@/lib/format";
import type { Rental } from "@/lib/types";
import RequestCard from "./RequestCard";
import LeaveReviewModal from "./LeaveReviewModal";
import { PaymentStatusBadge } from "./StatusBadge";

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

const TenantDashboard = () => {
  const user = useAuthUser();
  const {
    data: rentals,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyRentalsQuery();
  const { data: payments, isLoading: paymentsLoading } =
    useGetMyPaymentsQuery();
  const [reviewRental, setReviewRental] = useState<Rental | null>(null);

  const allRentals = rentals ?? [];
  const approvedCount = allRentals.filter((r) => r.status === "APPROVED").length;
  const pendingCount = allRentals.filter((r) => r.status === "PENDING").length;
  const totalPaid = (payments ?? []).reduce(
    (sum, payment) => sum + (payment.amount ?? 0),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s what&apos;s happening with your rental requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total requests" value={allRentals.length} icon="📋" />
        <StatCard label="Pending approval" value={pendingCount} icon="⏳" />
        <StatCard label="Approved" value={approvedCount} icon="✅" />
        <StatCard
          label="Total paid"
          value={formatRent(totalPaid)}
          icon="💳"
        />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Request history
          </h2>
          <span className="text-xs text-gray-400">
            {allRentals.length} request{allRentals.length === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading ? (
          <div className="mt-3 space-y-3">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-4xl">😕</p>
            <p className="mt-3 text-sm font-medium text-gray-900">
              Couldn&apos;t load your requests
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
        ) : allRentals.length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-4xl">🏠</p>
            <p className="mt-3 text-sm font-medium text-gray-900">
              No requests yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Browse properties and send your first rental request.
            </p>
            <Link
              href="/properties"
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {allRentals.map((rental) => (
              <RequestCard
                key={rental.id}
                rental={rental}
                onLeaveReview={() => setReviewRental(rental)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Payment history</h2>

        {paymentsLoading ? (
          <div className="mt-3 h-24 animate-pulse rounded-2xl border border-gray-200 bg-white" />
        ) : (payments ?? []).length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
            <p className="text-4xl">💳</p>
            <p className="mt-3 text-sm font-medium text-gray-900">
              No payments yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Payments you make will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {(payments ?? []).map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {payment.property?.title ??
                        payment.rental?.property?.title ??
                        `Rental ${payment.rentalId}`}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {payment.paidAt ?? payment.createdAt
                        ? formatDate(payment.paidAt ?? payment.createdAt)
                        : "—"}
                      {" · "}
                      Ref: {payment.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">
                      {formatRent(payment.amount)}
                    </p>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {reviewRental && (
        <LeaveReviewModal
          rental={reviewRental}
          onClose={() => setReviewRental(null)}
        />
      )}
    </div>
  );
};

export default TenantDashboard;
