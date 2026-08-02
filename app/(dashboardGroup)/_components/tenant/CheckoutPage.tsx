"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetRentalQuery, createCheckoutSession } from "@/lib/api";
import { formatDate, formatRent } from "@/lib/format";
import { RentalStatusBadge } from "./StatusBadge";

const CheckoutPage = ({ rentalId }: { rentalId: string }) => {
  const { data: rental, isLoading, isError, error, refetch } =
    useGetRentalQuery(rentalId);
  const [starting, setStarting] = useState(false);
  const [message, setMessage] = useState("");

  const price = rental?.monthlyRent ?? rental?.property?.rent;

  const handleProceed = async () => {
    setStarting(true);
    setMessage("");
    try {
      const session = await createCheckoutSession(rentalId);
      window.location.href = session.url;
    } catch (err) {
      setStarting(false);
      setMessage(
        err instanceof Error ? err.message : "Could not start checkout."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white" />
      </div>
    );
  }

  if (isError || !rental) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
        <p className="text-5xl">💳</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Request not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {error || "This request may have been removed."}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={refetch}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Try again
          </button>
          <Link
            href="/dashboard/tenant"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const property = rental.property;

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        ← Back to dashboard
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-gray-900">
              Pay for your rental
            </h1>
            <RentalStatusBadge status={rental.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {property?.title ?? `Rental request ${rental.id}`}
          </p>
          {property?.location && (
            <p className="mt-0.5 text-sm text-gray-500">
              📍 {property.location}
            </p>
          )}
        </div>

        <div className="space-y-3 px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Monthly rent</span>
            <span className="font-semibold text-gray-900">
              {typeof price === "number" ? formatRent(price) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Move-in date</span>
            <span className="font-semibold text-gray-900">
              {rental.moveInDate ? formatDate(rental.moveInDate) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Payment method</span>
            <span className="font-semibold text-gray-900">Stripe</span>
          </div>

          {rental.status !== "APPROVED" && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              ⚠️ This request is not approved yet. The landlord needs to
              approve it before you pay.
            </p>
          )}

          {message && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {message}
            </p>
          )}

          <button
            onClick={handleProceed}
            disabled={starting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starting && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {starting ? "Redirecting to Stripe..." : "Proceed to Stripe checkout"}
          </button>

          <p className="text-center text-xs text-gray-400">
            You&apos;ll be redirected to Stripe&apos;s secure checkout to
            complete your payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
