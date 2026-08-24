import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";

export const metadata = {
  title: "Create Account | RentNest",
  description: "Create your RentNest account as a tenant or landlord.",
};

export default function RegisterPage() {
  return (
    <div className="rounded-3xl border border-white/20 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Create Your Account 🚀
      </h1>
      <p className="mt-1.5 text-sm text-gray-300">
        Join RentNest today as a tenant or landlord.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
