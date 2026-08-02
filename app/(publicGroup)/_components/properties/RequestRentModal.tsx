"use client";

import { useState } from "react";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatRent } from "@/lib/format";

type RequestRentModalProps = {
  property: Property;
  authed: boolean;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

const RequestRentModal = ({
  property,
  authed,
  onClose,
}: RequestRentModalProps) => {
  const [moveInDate, setMoveInDate] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!moveInDate) return;

    setStatus("submitting");
    setMessage("");
    try {
      const token = localStorage.getItem("rentnest_token");
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId: property.id, moveInDate }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Request failed. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Request failed.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Request to rent"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Request to Rent
            </h2>
            <p className="mt-1 line-clamp-1 text-sm text-gray-500">
              {property.title} · {formatRent(property.rent)}/mo
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {!authed ? (
          <div className="mt-6 text-center">
            <p className="text-4xl">🔒</p>
            <p className="mt-3 font-medium text-gray-900">
              Sign in to request this property
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tenants need an account to submit rental requests.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Create an account
              </Link>
            </div>
          </div>
        ) : status === "success" ? (
          <div className="mt-6 text-center">
            <p className="text-4xl">🎉</p>
            <p className="mt-3 font-semibold text-gray-900">
              Request sent successfully!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              The landlord has been notified. Once approved, you can proceed to
              payment.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="moveInDate"
                className="block text-sm font-medium text-gray-700"
              >
                Preferred move-in date
              </label>
              <input
                id="moveInDate"
                type="date"
                min={today}
                required
                value={moveInDate}
                onChange={(event) => setMoveInDate(event.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                The landlord will review your request and respond soon.
              </p>
            </div>

            {status === "error" && message && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" && (
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
              {status === "submitting" ? "Submitting..." : "Submit request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestRentModal;
