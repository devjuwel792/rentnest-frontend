"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getErrorMessage, useGetPropertyQuery } from "@/lib/api";
import { formatRent, formatDate } from "@/lib/format";
import { PropertyDetailSkeleton } from "./Skeletons";
import RequestRentModal from "./RequestRentModal";

const PropertyDetailClient = ({ id }: { id: string }) => {
  const { data: property, isLoading, isError, error, refetch } =
    useGetPropertyQuery(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  const openRequestModal = () => {
    setAuthed(Boolean(localStorage.getItem("rentnest_token")));
    setModalOpen(true);
  };

  if (isLoading) return <PropertyDetailSkeleton />;

  if (isError || !property) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 text-center">
        <p className="text-5xl">🏚</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Property not found
        </h1>
        <p className="mt-2 text-gray-500">
          {getErrorMessage(error) ||
            "This listing may have been removed or never existed."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={refetch}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Try again
          </button>
          <Link
            href="/properties"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Browse properties
          </Link>
        </div>
      </main>
    );
  }

  const images = property.images?.length ? property.images : [];
  const selectedImageSrc = images[selectedImage] ?? null;

  const reviews = property.reviews ?? [];
  const reviewCount =
    property._count?.reviews ?? property.reviewCount ?? reviews.length;
  const averageRating =
    property.averageRating ??
    (reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : undefined);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Link
        href="/properties"
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        ← Back to properties
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
            {selectedImageSrc ? (
              <Image
                src={selectedImageSrc}
                alt={property.title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl">
                🏠
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${
                    index === selectedImage
                      ? "border-indigo-600"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - image ${index + 1}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">About this property</h2>
            <p className="mt-2 whitespace-pre-line text-gray-600">
              {property.description || "No description provided by the landlord."}
            </p>
          </section>

          {property.amenities && property.amenities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Reviews {reviewCount ? `(${reviewCount})` : ""}
            </h2>

            {averageRating ? (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-amber-500">
                  {"★".repeat(Math.round(averageRating))}
                  {"☆".repeat(5 - Math.round(averageRating))}
                </span>
                <span className="text-sm text-gray-500">
                  from {reviewCount ?? 0} review(s)
                </span>
              </div>
            ) : null}

            <div className="mt-4 space-y-4">
              {property.reviews && property.reviews.length > 0 ? (
                property.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        {review.tenant?.name ?? review.tenantName ?? "Tenant"}
                      </p>
                      <span className="text-sm text-amber-500">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    {review.createdAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No reviews yet. Be the first to leave one after your stay.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-4 lg:h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-indigo-600">
              {formatRent(property.rent)}
              <span className="text-sm font-normal text-gray-500"> /month</span>
            </p>
            <h1 className="mt-2 text-xl font-semibold text-gray-900">
              {property.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              📍 {property.address || property.location}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-gray-100 py-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {property.bedrooms}
                </p>
                <p className="text-xs text-gray-500">Bedrooms</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {property.bathrooms}
                </p>
                <p className="text-xs text-gray-500">Bathrooms</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {property.area ? property.area : "—"}
                </p>
                <p className="text-xs text-gray-500">Sq. ft.</p>
              </div>
            </div>

            <button
              onClick={openRequestModal}
              disabled={property.available === false}
              className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {property.available === false
                ? "Currently unavailable"
                : "Request to Rent"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              You&apos;ll only pay after the landlord approves your request.
            </p>
          </div>

          {property.landlord && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Landlord
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                  {property.landlord.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {property.landlord.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {property.landlord.email}
                  </p>
                  {property.landlord.phone && (
                    <p className="text-xs text-gray-500">
                      {property.landlord.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {modalOpen && (
        <RequestRentModal
          property={property}
          authed={authed}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
};

export default PropertyDetailClient;
