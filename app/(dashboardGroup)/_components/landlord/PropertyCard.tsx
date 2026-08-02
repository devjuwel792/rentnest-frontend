import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatRent } from "@/lib/format";

const PropertyCard = ({
  property,
  busy,
  onToggleAvailability,
  onDelete,
}: {
  property: Property;
  busy: boolean;
  onToggleAvailability: () => void;
  onDelete: () => void;
}) => {
  const image = property.images?.[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🏠
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            property.available === false
              ? "bg-gray-900/80 text-white"
              : "bg-emerald-500/90 text-white"
          }`}
        >
          {property.available === false ? "Unavailable" : "Available"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {property.title}
          </h3>
          <p className="shrink-0 font-bold text-indigo-600">
            {formatRent(property.rent)}
          </p>
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500">
          📍 {property.location}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          🛏 {property.bedrooms} bd · 🛁 {property.bathrooms} ba
          {property.area ? ` · 📐 ${property.area} sqft` : ""}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <Link
            href={`/dashboard/landlord/properties/${property.id}/edit`}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Edit
          </Link>
          <button
            onClick={onToggleAvailability}
            disabled={busy}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {property.available === false ? "Mark available" : "Mark unavailable"}
          </button>
          <button
            onClick={onDelete}
            disabled={busy}
            className="ml-auto rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
