import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-indigo-600">RentNest</p>
      <h1 className="mt-2 text-4xl font-bold text-gray-900">
        Find &amp; list rental properties with ease
      </h1>
      <p className="mt-3 max-w-xl text-gray-600">
        Browse rental listings, submit requests, and manage your properties —
        all in one place.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/properties"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Browse properties
        </Link>
        <Link
          href="/auth/login"
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Sign in
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Get started
        </Link>
      </div>
    </main>
  );
}
