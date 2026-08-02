import Image from "next/image";
import Link from "next/link";
import { formatRent } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🏠
          </div>
        )}
        {property.available === false && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold text-white">
            Unavailable
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-lg font-bold text-indigo-600">
            {formatRent(property.rent)}
            <span className="text-xs font-normal text-gray-500"> /month</span>
          </p>
          {property.averageRating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              ★ {property.averageRating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <h3 className="mt-1 truncate font-medium text-gray-900">
          {property.title}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500">{property.location}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="text-gray-400">🛏</span> {property.bedrooms} bd
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-gray-400">🛁</span> {property.bathrooms} ba
            </span>
            {property.area ? (
              <span className="inline-flex items-center gap-1">
                <span className="text-gray-400">📐</span> {property.area} sqft
              </span>
            ) : null}
          </div>
          {property.category?.name ? (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {property.category.name}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
