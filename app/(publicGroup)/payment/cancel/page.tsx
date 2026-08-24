import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled | RentNest",
  description: "Your payment was cancelled.",
};

const PaymentCancelPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex w-full flex-col items-center rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xl sm:p-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner">
          💳
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700">
          Checkout Cancelled
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
          Payment Cancelled
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">
          No charges were meade to your account. You can resume your rental checkout anytime from your tenant dashboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/tenant"
            className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-95"
          >
            Back to Tenant Portal →
          </Link>
          <Link
            href="/properties"
            className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentCancelPage;
