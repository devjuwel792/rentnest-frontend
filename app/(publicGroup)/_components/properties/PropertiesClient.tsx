"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getErrorMessage,
  useGetCategoriesQuery,
  useGetPropertiesQuery,
} from "@/lib/api";
import type { PropertyFilters } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { PropertyGridSkeleton } from "./Skeletons";

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5"];

interface ResolvedFilters {
  search: string;
  location: string;
  categoryId: string;
  minRent: string;
  maxRent: string;
  bedrooms: string;
}

function readFilters(searchParams: URLSearchParams): ResolvedFilters {
  return {
    search: searchParams.get("search") ?? "",
    location: searchParams.get("location") ?? "",
    categoryId: searchParams.get("categoryId") ?? "",
    minRent: searchParams.get("minRent") ?? "",
    maxRent: searchParams.get("maxRent") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
  };
}

const PropertiesClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const [searchDraft, setSearchDraft] = useState<string>(filters.search);
  const [prevUrlSearch, setPrevUrlSearch] = useState<string>(filters.search);

  if (filters.search !== prevUrlSearch) {
    setPrevUrlSearch(filters.search);
    setSearchDraft(filters.search);
  }

  const updateFilter = useCallback(
    (key: keyof PropertyFilters, value: string) => {
      const current = searchParams.get(key) ?? "";
      if (current === value) return;

      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(key, value);
      else next.delete(key);

      const qs = next.toString();
      router.replace(qs ? `/properties?${qs}` : "/properties", {
        scroll: false,
      });
    },
    [searchParams, router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("search", searchDraft);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchDraft, updateFilter]);

  const clearAll = () => {
    router.replace("/properties", { scroll: false });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, isError, error, refetch } =
    useGetPropertiesQuery(filters);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl lg:sticky lg:top-20">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>⚙️</span> Filter Catalog
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Reset all
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="search"
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Area, title, keyword..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              placeholder="e.g. Dhaka, Banani"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={filters.categoryId}
              onChange={(event) => updateFilter("categoryId", event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All categories</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700">
              Price range (monthly)
            </span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.minRent}
                onChange={(event) => updateFilter("minRent", event.target.value)}
                placeholder="Min"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={filters.maxRent}
                onChange={(event) => updateFilter("maxRent", event.target.value)}
                placeholder="Max"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              value={filters.bedrooms}
              onChange={(event) => updateFilter("bedrooms", event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              {BEDROOM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}+
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      <section>
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {filters.search && (
              <FilterChip
                label={`Search: ${filters.search}`}
                onClear={() => updateFilter("search", "")}
              />
            )}
            {filters.location && (
              <FilterChip
                label={filters.location}
                onClear={() => updateFilter("location", "")}
              />
            )}
            {filters.categoryId && (
              <FilterChip
                label="Category"
                onClear={() => updateFilter("categoryId", "")}
              />
            )}
            {filters.minRent && (
              <FilterChip
                label={`Min ৳${filters.minRent}`}
                onClear={() => updateFilter("minRent", "")}
              />
            )}
            {filters.maxRent && (
              <FilterChip
                label={`Max ৳${filters.maxRent}`}
                onClear={() => updateFilter("maxRent", "")}
              />
            )}
            {filters.bedrooms && (
              <FilterChip
                label={`${filters.bedrooms}+ beds`}
                onClear={() => updateFilter("bedrooms", "")}
              />
            )}
          </div>
        )}

        {isLoading ? (
          <PropertyGridSkeleton count={6} />
        ) : isError ? (
          <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
            <p className="text-4xl">😕</p>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              Couldn&apos;t load properties
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {getErrorMessage(error) ||
                "Please check your connection and try again."}
            </p>
            <button
              onClick={refetch}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Try again
            </button>
          </div>
        ) : (data ?? []).length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
            <p className="text-4xl">🔍</p>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              No properties match your filters
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting or clearing the filters above.
            </p>
            <button
              onClick={clearAll}
              className="mt-5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Showing {(data ?? []).length} properties
            </p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {(data ?? []).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
      {label}
      <button
        onClick={onClear}
        aria-label={`Remove ${label} filter`}
        className="text-indigo-400 hover:text-indigo-600"
      >
        ✕
      </button>
    </span>
  );
}

export default PropertiesClient;
