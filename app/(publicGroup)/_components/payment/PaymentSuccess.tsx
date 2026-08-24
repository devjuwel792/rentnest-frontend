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
    <div className="flex flex-col items-center rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-xl sm:p-12">
      {status === "checking" ? (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Confirming Payment Status...
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we verify your Stripe checkout session.
          </p>
        </>
      ) : status === "success" ? (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl shadow-inner">
            🎉
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700">
            ✓ Transaction Verified &amp; Active
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">
            Your rental payment has been confirmed. Your tenancy is now active and the landlord has been notified.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/tenant"
              className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95"
            >
              Go to Tenant Portal →
            </Link>
            <Link
              href="/properties"
              className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Browse Properties
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-600">
            ⚠️
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Payment Confirmation Failed
          </h1>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            {message || "Something went wrong while confirming your payment."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/tenant"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500"
            >
              Return to Tenant Portal
            </Link>
            <Link
              href="/properties"
              className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Browse Properties
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
