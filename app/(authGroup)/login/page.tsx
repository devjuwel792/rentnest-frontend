import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "../_components/LoginForm";

export const metadata = {
  title: "Sign In | RentNest",
  description: "Sign in to your RentNest account.",
};

export default function LoginPage() {
  return (
    <div className="rounded-3xl border border-white/20 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Welcome Back 👋
      </h1>
      <p className="mt-1.5 text-sm text-gray-300">
        Sign in to access your tenant or landlord portal.
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        New to RentNest?{" "}
        <Link
          href="/register"
          className="font-bold text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 backdrop-blur-md">
        <p className="font-bold text-indigo-300">🔑 Demo Accounts</p>
        <div className="mt-2 space-y-1 font-mono text-[11px] text-gray-300">
          <p>
            <span className="text-gray-400">Tenant:</span> rahim@tenant.com /
            password123
          </p>
          <p>
            <span className="text-gray-400">Landlord:</span> kamal@landlord.com /
            password123
          </p>
          <p>
            <span className="text-gray-400">Admin:</span> admin@rentnest.com /
            admin123
          </p>
        </div>
      </div>
    </div>
  );
}
