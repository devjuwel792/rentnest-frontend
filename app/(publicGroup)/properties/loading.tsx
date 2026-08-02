import { PropertyGridSkeleton } from "../_components/properties/Skeletons";

export default function PropertiesLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
      </div>
      <PropertyGridSkeleton count={6} />
    </main>
  );
}
