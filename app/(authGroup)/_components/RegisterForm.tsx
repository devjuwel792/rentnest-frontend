"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "./FormField";
import SubmitButton from "./SubmitButton";

const API_BASE_URL = "http://localhost:3000";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const DASHBOARD_PATHS: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
};

const ROLES = [
  {
    value: "TENANT",
    title: "Tenant",
    description: "I&apos;m looking for a rental home",
  },
  {
    value: "LANDLORD",
    title: "Landlord",
    description: "I want to list properties",
  },
];

const RegisterForm = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!role) errors.role = "Select a role";
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Enter a valid email address";
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[+\d][\d\s-]{6,}$/.test(phone))
      errors.phone = "Enter a valid phone number";
    if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password)
      errors.confirmPassword = "Passwords do not match";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role }),
      });
      const json = await res.json();

      if (json.success && json.data?.accessToken && json.data?.user) {
        localStorage.setItem("rentnest_token", json.data.accessToken);
        localStorage.setItem("rentnest_user", JSON.stringify(json.data.user));
        router.push(DASHBOARD_PATHS[json.data.user.role]);
      } else {
        setMessage(json.message || "Registration failed. Please try again.");
      }
    } catch {
      setMessage("Cannot reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField label="I am joining as" htmlFor="role" error={fieldErrors.role}>
        <div className="mt-1 grid grid-cols-2 gap-3">
          {ROLES.map((option) => {
            const selected = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setRole(option.value)}
                className={`rounded-lg border px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selected
                    ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    selected ? "text-indigo-700" : "text-gray-900"
                  }`}
                >
                  {option.title}
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </FormField>

      <FormField label="Full name" htmlFor="name" error={fieldErrors.name}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Rahim Uddin"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClassName}
        />
      </FormField>

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

      <FormField label="Phone" htmlFor="phone" error={fieldErrors.phone}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+8801712345678"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className={inputClassName}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Password" htmlFor="password" error={fieldErrors.password}>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          error={fieldErrors.confirmPassword}
        >
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClassName}
          />
        </FormField>
      </div>

      {message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {message}
        </p>
      )}

      <SubmitButton loading={loading} pendingText="Creating account...">
        Create account
      </SubmitButton>
    </form>
  );
};

export default RegisterForm;
