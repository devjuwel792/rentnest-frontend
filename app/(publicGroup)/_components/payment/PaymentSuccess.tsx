"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { confirmPayment } from "@/lib/api";

type Status = "checking" | "success" | "error";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>(
    sessionId ? "checking" : "error"
  );
  const [message, setMessage] = useState(
    sessionId ? "" : "No payment session was provided."
  );

  useEffect(() => {
    if (!sessionId) return;
    let active = true;

    async function run(session: string) {
      try {
        await confirmPayment(session);
        if (active) setStatus("success");
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Could not confirm payment."
        );
      }
    }

    run(sessionId);
    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
      {status === "checking" ? (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
          <p className="mt-4 text-lg font-semibold text-gray-900">
            Confirming your payment...
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please wait a moment.
          </p>
        </>
      ) : status === "success" ? (
        <>
          <p className="text-6xl">🎉</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Payment successful!
          </h1>
          <p className="mt-2 text-gray-500">
            Your rental payment has been confirmed. The landlord has been
            notified.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/tenant"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              View my requests
            </Link>
            <Link
              href="/properties"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Browse properties
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-5xl">😕</p>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Payment could not be confirmed
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {message || "Something went wrong while confirming your payment."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/tenant"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              View my requests
            </Link>
            <Link
              href="/properties"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Browse properties
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
