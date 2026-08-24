import { Suspense } from "react";
import PropertiesClient from "../_components/properties/PropertiesClient";
import { PropertyGridSkeleton } from "../_components/properties/Skeletons";

export const metadata = {
  title: "Browse Properties | RentNest",
  description:
    "Search and filter rental properties by location, price, category and more.",
};

export default function PropertiesPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-slate-900 via-indigo-950/10 to-white pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-center sm:px-6">
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-indigo-300 backdrop-blur-md">
            🏠 100% Verified Rental Catalog
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Explore All Properties
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-gray-300 sm:text-base">
            Filter by city, rent budget, bedrooms, and category to find your perfect place.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Suspense fallback={<PropertyGridSkeleton count={6} />}>
          <PropertiesClient />
        </Suspense>
      </div>
    </main>
  );
}
