import { Suspense } from "react";
import PropertiesClient from "../_components/properties/PropertiesClient";
import { PropertyGridSkeleton } from "../_components/properties/Skeletons";

export const metadata = {
  title: "Browse Properties | RentNest",
  description: "Search and filter rental properties by location, price, category and more.",
};

export default function PropertiesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse properties</h1>
        <p className="mt-1 text-gray-500">
          Find your next home with our advanced filters.
        </p>
      </div>

      <Suspense fallback={<PropertyGridSkeleton count={6} />}>
        <PropertiesClient />
      </Suspense>
    </main>
  );
}
