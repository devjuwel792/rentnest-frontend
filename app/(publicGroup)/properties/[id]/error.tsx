"use client";

import { useEffect } from "react";

export default function PropertyDetailError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 text-center">
      <p className="text-5xl">😕</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Something went wrong
      </h1>
      <p className="mt-2 text-gray-500">
        We couldn&apos;t load this property. Please try again.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Try again
      </button>
    </main>
  );
}
