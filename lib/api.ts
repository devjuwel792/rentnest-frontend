import { useEffect, useState } from "react";
import type {
  Category,
  CheckoutSession,
  Payment,
  Property,
  PropertyFilters,
  QueryResult,
  Rental,
  ReviewInput,
} from "./types";
import { getStoredToken } from "./auth";

function buildQueryString(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function useQuery<T>(
  url: string | null,
  options?: { token?: string | null }
): QueryResult<T> {
  const token = options?.token ?? null;
  const [data, setData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const target = url;
    if (!target) return;

    const controller = new AbortController();
    let active = true;

    async function run(route: string, auth: string | null) {
      setIsFetching(true);
      try {
        const res = await fetch(route, {
          signal: controller.signal,
          headers: auth ? { Authorization: `Bearer ${auth}` } : undefined,
        });
        const json = await res.json();
        if (!active) return;
        if (!res.ok || json.success === false) {
          throw new Error(json.message || `Request failed (${res.status})`);
        }
        setData(json.data as T);
        setError(null);
        setIsError(false);
      } catch (err) {
        if (!active) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setData(null);
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setIsError(true);
      } finally {
        if (active) setIsFetching(false);
      }
    }

    run(target, token);
    return () => {
      active = false;
      controller.abort();
    };
  }, [url, token, attempt]);

  const isLoading = data === null && !isError;

  return { data, isLoading, isFetching, isError, error, refetch: () => setAttempt((n) => n + 1) };
}

export function useGetPropertiesQuery(
  filters: PropertyFilters = {}
): QueryResult<Property[]> {
  const url = `/api/properties${buildQueryString(filters)}`;
  return useQuery<Property[]>(url);
}

export function useGetCategoriesQuery(): QueryResult<Category[]> {
  return useQuery<Category[]>("/api/categories");
}

export function useGetPropertyQuery(id?: string): QueryResult<Property> {
  const url = id ? `/api/properties/${id}` : null;
  return useQuery<Property>(url);
}

export function useGetMyRentalsQuery(): QueryResult<Rental[]> {
  return useQuery<Rental[]>("/api/rentals", { token: getStoredToken() });
}

export function useGetRentalQuery(id?: string): QueryResult<Rental> {
  const url = id ? `/api/rentals/${id}` : null;
  return useQuery<Rental>(url, { token: getStoredToken() });
}

export function useGetMyPaymentsQuery(): QueryResult<Payment[]> {
  return useQuery<Payment[]>("/api/payments", { token: getStoredToken() });
}

export async function createCheckoutSession(
  rentalId: string
): Promise<CheckoutSession> {
  const token = getStoredToken();
  const res = await fetch("/api/payments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ rentalId }),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Could not start payment.");
  }
  const data = json.data ?? {};
  const url = data.url ?? data.checkoutUrl ?? data.checkout_session?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("Checkout URL missing from response.");
  }
  return { url, sessionId: data.sessionId ?? data.session?.id };
}

export async function createReview(input: ReviewInput): Promise<void> {
  const token = getStoredToken();
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Could not submit review.");
  }
}

export async function confirmPayment(sessionId: string): Promise<unknown> {
  const res = await fetch(
    `/api/payments/confirm?session_id=${encodeURIComponent(sessionId)}`
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Could not confirm payment.");
  }
  return json.data;
}
