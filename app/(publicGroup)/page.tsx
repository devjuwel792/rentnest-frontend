import Link from "next/link";
import HeroSearch from "./_components/home/HeroSearch";
import FeaturedProperties from "./_components/home/FeaturedProperties";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 pb-16 pt-20 text-center">
        <p className="text-sm font-semibold text-indigo-600">RentNest</p>
        <h1 className="mx-auto mt-2 max-w-2xl text-4xl font-bold text-gray-900 sm:text-5xl">
          Find &amp; list rental properties with ease
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Browse trusted rental listings, submit requests, and manage your
          properties — all in one place.
        </p>

        <HeroSearch />

        <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-600">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            🏙 {3}+ locations
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            🏠 Verified landlords
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            🔒 Secure payments
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured properties
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Handpicked rentals loved by our tenants.
            </p>
          </div>
          <Link
            href="/properties"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View all →
          </Link>
        </div>

        <FeaturedProperties />
      </section>
    </main>
  );
}
