"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useGetPropertyQuery } from "@/lib/api";
import PropertyForm from "../../../../../_components/landlord/PropertyForm";

const EditPropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError, refetch } =
    useGetPropertyQuery(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit property</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the details and save your changes.
        </p>
      </div>

      {isLoading ? (
        <div className="max-w-2xl h-96 animate-pulse rounded-2xl border border-gray-200 bg-white" />
      ) : isError ? (
        <div className="flex max-w-2xl flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-3 text-sm font-medium text-gray-900">
            Couldn&apos;t load this property
          </p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      ) : property ? (
        <PropertyForm initial={property} />
      ) : (
        notFound()
      )}
    </div>
  );
};

export default EditPropertyPage;
