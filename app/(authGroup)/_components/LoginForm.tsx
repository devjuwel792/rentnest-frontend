"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormField } from "./FormField";
import SubmitButton from "./SubmitButton";
import { setStoredAuth } from "@/lib/auth";
import { login } from "@/lib/api";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const DASHBOARD_PATHS: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get("registered") === "1";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const auth = await login({ email, password });
      setStoredAuth(auth.accessToken, auth.user);
      router.push(DASHBOARD_PATHS[auth.user?.role]);
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Cannot reach the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={fieldErrors.password}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
        />
      </FormField>

      {registered && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          ✓ Account created! Sign in to continue.
        </p>
      )}

      {message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {message}
        </p>
      )}

      <SubmitButton loading={loading} pendingText="Signing in...">
        Sign in
      </SubmitButton>
    </form>
  );
};

export default LoginForm;
