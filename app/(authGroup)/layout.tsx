import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-600"
          >
            🏠 RentNest
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            Find &amp; list rental properties with ease
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
