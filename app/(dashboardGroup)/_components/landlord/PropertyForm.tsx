"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Property, PropertyInput } from "@/lib/types";
import {
  createProperty,
  updateProperty,
  useGetCategoriesQuery,
} from "@/lib/api";

type FormStatus = "idle" | "submitting" | "error";

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const labelClass = "block text-sm font-medium text-gray-700";

const PropertyForm = ({ initial }: { initial?: Property }) => {
  const router = useRouter();
  const { data: categories } = useGetCategoriesQuery();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [rent, setRent] = useState(initial ? String(initial.rent) : "");
  const [bedrooms, setBedrooms] = useState(
    initial ? String(initial.bedrooms) : ""
  );
  const [bathrooms, setBathrooms] = useState(
    initial ? String(initial.bathrooms) : ""
  );
  const [area, setArea] = useState(initial?.area ? String(initial.area) : "");
  const [amenities, setAmenities] = useState(
    initial?.amenities?.join(", ") ?? ""
  );
  const [images, setImages] = useState(initial?.images?.join(", ") ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const isEditing = Boolean(initial);

  const buildInput = (): PropertyInput => ({
    title: title.trim(),
    description: description.trim(),
    address: address.trim(),
    location: location.trim(),
    rent: Number(rent),
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    area: area ? Number(area) : undefined,
    amenities: amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    images: images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    categoryId: categoryId || undefined,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");
    try {
      if (isEditing && initial) {
        await updateProperty(initial.id, buildInput());
      } else {
        await createProperty(buildInput());
      }
      router.push("/dashboard/landlord");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : `Could not ${isEditing ? "update" : "create"} the property.`
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="propertyTitle" className={labelClass}>
          Title *
        </label>
        <input
          id="propertyTitle"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Modern 2-bedroom apartment in Dhanmondi"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="propertyDescription" className={labelClass}>
          Description
        </label>
        <textarea
          id="propertyDescription"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the property, features and surroundings..."
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="propertyAddress" className={labelClass}>
            Address
          </label>
          <input
            id="propertyAddress"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="House 12, Road 5"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="propertyLocation" className={labelClass}>
            Location *
          </label>
          <input
            id="propertyLocation"
            type="text"
            required
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. Dhanmondi, Dhaka"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="propertyRent" className={labelClass}>
            Monthly rent (৳) *
          </label>
          <input
            id="propertyRent"
            type="number"
            required
            min="0"
            value={rent}
            onChange={(event) => setRent(event.target.value)}
            placeholder="15000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="propertyArea" className={labelClass}>
            Area (sqft)
          </label>
          <input
            id="propertyArea"
            type="number"
            min="0"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            placeholder="1200"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="propertyBedrooms" className={labelClass}>
            Bedrooms *
          </label>
          <input
            id="propertyBedrooms"
            type="number"
            required
            min="0"
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            placeholder="2"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="propertyBathrooms" className={labelClass}>
            Bathrooms *
          </label>
          <input
            id="propertyBathrooms"
            type="number"
            required
            min="0"
            value={bathrooms}
            onChange={(event) => setBathrooms(event.target.value)}
            placeholder="1"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="propertyAmenities" className={labelClass}>
          Amenities
        </label>
        <input
          id="propertyAmenities"
          type="text"
          value={amenities}
          onChange={(event) => setAmenities(event.target.value)}
          placeholder="WiFi, Lift, Parking (comma separated)"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="propertyImages" className={labelClass}>
          Image URLs
        </label>
        <input
          id="propertyImages"
          type="text"
          value={images}
          onChange={(event) => setImages(event.target.value)}
          placeholder="https://..., https://... (comma separated)"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="propertyCategory" className={labelClass}>
          Category
        </label>
        <select
          id="propertyCategory"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {(categories ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {status === "error" && message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {message}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {status === "submitting"
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Add property"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
