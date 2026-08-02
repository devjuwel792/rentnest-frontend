"use client";

import { useGetPropertiesQuery } from "@/lib/api";
import { PropertyCard } from "../properties/PropertyCard";
import { PropertyGridSkeleton } from "../properties/Skeletons";

const FeaturedProperties = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetPropertiesQuery();

  if (isLoading) {
    return <PropertyGridSkeleton count={6} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
        <p className="text-4xl">😕</p>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          Couldn&apos;t load featured properties
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || "Please check your connection and try again."}
        </p>
        <button
          onClick={refetch}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  const properties = (data ?? []).slice(0, 6);

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
        <p className="text-4xl">🏠</p>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          No properties yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Listings will appear here once landlords publish them.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default FeaturedProperties;
