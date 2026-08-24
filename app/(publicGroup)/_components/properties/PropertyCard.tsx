import Image from "next/image";
import Link from "next/link";
import { formatRent } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🏠
          </div>
        )}
        {property.available === false && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            Unavailable
          </span>
        )}
        {property.averageRating ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-amber-600 shadow-md backdrop-blur-md">
            ★ {property.averageRating.toFixed(1)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xl font-extrabold text-indigo-600">
            {formatRent(property.rent)}
            <span className="text-xs font-normal text-gray-500"> /month</span>
          </p>
          {property.category?.name ? (
            <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              {property.category.name}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 truncate text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-500">
          <span>📍</span> {property.location}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <span className="inline-flex items-center gap-1">
              <span>🛏</span> {property.bedrooms} bd
            </span>
            <span className="inline-flex items-center gap-1">
              <span>🛁</span> {property.bathrooms} ba
            </span>
            {property.area ? (
              <span className="inline-flex items-center gap-1">
                <span>📐</span> {property.area} sqft
              </span>
            ) : null}
          </div>
          <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
