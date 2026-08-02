import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In | RentNest",
  description: "Sign in to your RentNest account.",
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-500">
        Sign in to continue to your dashboard.
      </p>

      <div className="mt-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        New to RentNest?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
        <p className="font-medium text-gray-600">Demo accounts</p>
        <p>Tenant: rahim@tenant.com / password123</p>
        <p>Landlord: kamal@landlord.com / password123</p>
        <p>Admin: admin@rentnest.com / admin123</p>
      </div>
    </div>
  );
}
