import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";

export const metadata = {
  title: "Create Account | RentNest",
  description: "Create your RentNest account as a tenant or landlord.",
};

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Join RentNest as a tenant or landlord.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
