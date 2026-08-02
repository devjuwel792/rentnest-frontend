import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled | RentNest",
  description: "Your payment was cancelled.",
};

const PaymentCancelPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex w-full flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-14 shadow-sm">
        <p className="text-6xl">💳</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Payment cancelled
        </h1>
        <p className="mt-2 text-gray-500">
          No charges were made. You can try again whenever you&apos;re ready.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/tenant"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Back to my requests
          </Link>
          <Link
            href="/properties"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentCancelPage;
