import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <span>🏠</span> RentNest
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              The modern, trusted marketplace connecting tenants and landlords with digital requests and secure payments.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/properties" className="transition-colors hover:text-indigo-600">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-indigo-600">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-indigo-600">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">Dashboards</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/dashboard/tenant" className="transition-colors hover:text-indigo-600">
                  Tenant Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/landlord" className="transition-colors hover:text-indigo-600">
                  Landlord Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="transition-colors hover:text-indigo-600">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">Trust &amp; Security</p>
            <div className="mt-3 space-y-2 text-xs text-gray-500">
              <p>🔒 256-bit Stripe Escrow Encryption</p>
              <p>🛡️ Verified Landlords &amp; Properties</p>
              <p>⭐ Transparent Tenant Reviews</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} RentNest Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
