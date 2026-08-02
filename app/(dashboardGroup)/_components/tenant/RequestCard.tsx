import Link from "next/link";
import type { Rental } from "@/lib/types";
import { formatDate, formatRent } from "@/lib/format";
import { RentalStatusBadge } from "./StatusBadge";

const RequestCard = ({
  rental,
  onLeaveReview,
}: {
  rental: Rental;
  onLeaveReview: () => void;
}) => {
  const property = rental.property;
  const price = rental.monthlyRent ?? property?.rent;
  const propertyId = property?.id ?? rental.propertyId;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900">
              {property?.title ?? `Property ${propertyId ?? "request"}`}
            </h3>
            <RentalStatusBadge status={rental.status} />
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            📍 {property?.location ?? "Location unavailable"}
          </p>
        </div>
        {typeof price === "number" && (
          <p className="text-lg font-bold text-indigo-600">
            {formatRent(price)}
            <span className="text-xs font-normal text-gray-500"> /month</span>
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600 sm:grid-cols-3">
        <div>
          <p className="text-xs text-gray-400">Move-in date</p>
          <p className="font-medium text-gray-800">
            {rental.moveInDate ? formatDate(rental.moveInDate) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Requested on</p>
          <p className="font-medium text-gray-800">
            {rental.createdAt ? formatDate(rental.createdAt) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Bedrooms</p>
          <p className="font-medium text-gray-800">
            {property?.bedrooms ?? "—"} bd · {property?.bathrooms ?? "—"} ba
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {rental.status === "APPROVED" && (
          <Link
            href={`/dashboard/tenant/requests/${rental.id}/pay`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Pay now →
          </Link>
        )}
        {rental.status === "PENDING" && (
          <p className="text-sm text-gray-500">
            ⏳ Awaiting landlord approval
          </p>
        )}
        {propertyId && rental.status === "COMPLETED" && (
          <button
            onClick={onLeaveReview}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            ⭐ Leave review
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
