"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createCheckoutSession,
  getErrorMessage,
  useGetRentalQuery,
} from "@/lib/api";
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
      <div className="mx-auto max-w-xl">
        <div className="h-72 animate-pulse rounded-3xl border border-gray-200/80 bg-white shadow-lg" />
      </div>
    );
  }

  if (isError || !rental) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-gray-200/80 bg-white px-6 py-12 text-center shadow-xl">
        <p className="text-5xl">💳</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Request Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {getErrorMessage(error) || "This request may have been removed."}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={refetch}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
          >
            Try Again
          </button>
          <Link
            href="/dashboard/tenant"
            className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const property = rental.property;

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/dashboard/tenant"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-500"
      >
        ← Back to My Requests
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl">
        <div className="border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              🔒 Stripe Secure Checkout
            </span>
            <RentalStatusBadge status={rental.status} />
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {property?.title ?? `Rental Request ${rental.id.slice(-6)}`}
          </h1>
          {property?.location && (
            <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-gray-600">
              <span>📍</span> {property.location}
            </p>
          )}
        </div>

        <div className="space-y-4 px-6 py-6 sm:px-8">
          <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-500">Monthly Rent Amount</span>
              <span className="text-lg font-black text-indigo-600">
                {typeof price === "number" ? formatRent(price) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-gray-200/60 pt-2.5">
              <span className="font-medium text-gray-500">Move-in Date</span>
              <span className="font-bold text-gray-900">
                {rental.moveInDate ? formatDate(rental.moveInDate) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-gray-200/60 pt-2.5">
              <span className="font-medium text-gray-500">Payment Escrow Provider</span>
              <span className="flex items-center gap-1 font-bold text-gray-900">
                <span>💳</span> Stripe (SSL 256-bit Encrypted)
              </span>
            </div>
          </div>

          {rental.status !== "APPROVED" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="flex items-center gap-1.5 font-bold">
                <span>⚠️</span> Approval Required
              </p>
              <p className="mt-1 text-xs text-amber-700">
                The landlord must approve this request before payment can be processed.
              </p>
            </div>
          )}

          {message && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
            >
              <p className="flex items-center gap-1.5 font-bold">
                <span>⚠️</span> {message}
              </p>
            </div>
          )}

          <button
            onClick={handleProceed}
            disabled={starting || rental.status !== "APPROVED"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-indigo-500/25 transition-all hover:opacity-95 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starting && (
              <svg
                className="h-5 w-5 animate-spin"
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
            {starting ? "Redirecting to Stripe..." : "🔒 Proceed to Stripe Checkout"}
          </button>

          <p className="text-center text-xs text-gray-400">
            You will be redirected securely to Stripe&apos;s hosted payment page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
